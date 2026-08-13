import os
import json
import numpy as np
import pandas as pd
from datetime import datetime
from scipy.stats import mannwhitneyu, ttest_ind, chi2_contingency, spearmanr, fisher_exact

#STORE STATISTICAL RESULTS
results_log = []

#LOAD DATA
def load_data(path):
    data = []

    if os.path.isdir(path):
        for file in os.listdir(path):
            if file.endswith(".json"):
                with open(os.path.join(path, file)) as f:
                    content = json.load(f)
                    data.extend(content if isinstance(content, list) else [content])

    elif os.path.isfile(path):
        with open(path) as f:
            content = json.load(f)
            data.extend(content if isinstance(content, list) else [content])
    else:
        raise ValueError("Invalid path")

    return pd.DataFrame(data)

#PREPROCESSING
def preprocess(df):
    df["taskTime"] = df.apply(lambda row: (
        datetime.fromisoformat(row["endTimestamp"].replace("Z", "")) -
        datetime.fromisoformat(row["startTimestamp"].replace("Z", ""))
    ).total_seconds(), axis=1)

    def sus(row):
        odd = sum([row[f"sus_question{i}"] - 1 for i in [1, 3, 5, 7, 9]])
        even = sum([5 - row[f"sus_question{i}"] for i in [2, 4, 6, 8, 10]])
        return (odd + even) * 2.5

    df["SUS"] = df.apply(sus, axis=1)
    df["Likert"] = df[[f"custom_question{i}" for i in range(1, 6)]].mean(axis=1)

    df["errorsPerAttempt"] = df.apply(
        lambda r: r["errorCount"] / r["attempts"] if r["attempts"] > 0 else 0,
        axis=1
    )

    df["warningsPerAttempt"] = df.apply(
        lambda r: r["warningCount"] / r["attempts"] if r["attempts"] > 0 else 0,
        axis=1
    )

    df["totalChecks"] = df["errorCount"] + df["warningCount"] + df["successesCount"]

    df["successRate"] = df.apply(
        lambda r: r["successesCount"] / r["totalChecks"] if r["totalChecks"] > 0 else 0,
        axis=1
    )

    return df

#SPLIT GROUPS
def split_groups(df):
    return df[df["uiType"] == "baseline"], df[df["uiType"] == "optimized"]

#EFFECT SIZE: r from Mann-Whitney U
def mann_whitney_r(group1, group2, U):
    n1 = len(group1)
    n2 = len(group2)
    N = n1 + n2
    mean_U = n1 * n2 / 2
    std_U = (n1 * n2 * (n1 + n2 + 1) / 12) ** 0.5

    if std_U == 0:
        return 0.0

    Z = (U - mean_U) / std_U
    r = abs(Z) / (N ** 0.5)
    return round(r, 4)

#EFFECT SIZE: Cohen's d from two groups
def cohens_d(group1, group2):
    n1 = len(group1)
    n2 = len(group2)
    var1 = np.var(group1, ddof=1)
    var2 = np.var(group2, ddof=1)
    pooled_std = np.sqrt(((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2))

    if pooled_std == 0:
        return 0.0

    d = abs(np.mean(group1) - np.mean(group2)) / pooled_std
    return round(d, 4)

#LOG RESULT
def log_result(name, stat, p, method, effect_size=None, effect_type=None):
    sig = "SIGNIFICANT" if p < 0.05 else "not significant"

    es_str = ""
    if effect_size is not None and effect_type is not None:
        es_str = f", {effect_type}={effect_size:.4f}"

    print(f"{name} ({method}): stat={stat}, p={p:.4f}{es_str} → {sig}")

    results_log.append({
        "test": name,
        "method": method,
        "statistic": float(stat) if stat is not None else None,
        "p_value": float(p),
        "significant": sig,
        "effect_size": float(effect_size) if effect_size is not None else None,
        "effect_type": effect_type
    })

#CORE TESTS
def test_task_time(b, g):
    stat, p = mannwhitneyu(b["taskTime"], g["taskTime"])
    r = mann_whitney_r(b["taskTime"], g["taskTime"], stat)
    log_result("Task Time", stat, p, "Mann-Whitney U", r, "r")

def test_attempts(b, g):
    stat, p = mannwhitneyu(b["attempts"], g["attempts"])
    r = mann_whitney_r(b["attempts"], g["attempts"], stat)
    log_result("Attempts", stat, p, "Mann-Whitney U", r, "r")

#COMPLIANCE
def test_first_attempt(df):
    table = pd.crosstab(df["uiType"], df["firstAttemptComplianceSuccess"])

    if (table.values < 5).any():
        odds_ratio, p = fisher_exact(table)
        log_result("First Attempt Compliance", None, p, "Fisher's Exact Test", odds_ratio, "OR")
    else:
        stat, p, _, _ = chi2_contingency(table)
        n = len(df)
        k = min(table.shape)
        v = np.sqrt(stat / (n * (k - 1))) if n * (k - 1) > 0 else 0
        log_result("First Attempt Compliance", stat, p, "Chi-square Test", v, "Cramers_V")

def test_task_success(df):
    table = pd.crosstab(df["uiType"], df["taskSuccess"])

    if table.shape[1] < 2:
        print("Task Success: no variation (all succeeded) — skipping test")
        log_result("Task Success", None, 1.0, "Skipped (no variation)", None, None)
        return

    if (table.values < 5).any():
        odds_ratio, p = fisher_exact(table)
        log_result("Task Success", None, p, "Fisher's Exact Test", odds_ratio, "OR")
    else:
        stat, p, _, _ = chi2_contingency(table)
        n = len(df)
        k = min(table.shape)
        v = np.sqrt(stat / (n * (k - 1))) if n * (k - 1) > 0 else 0
        log_result("Task Success", stat, p, "Chi-square Test", v, "Cramers_V")

#USABILITY
def test_sus(b, g):
    stat, p = ttest_ind(b["SUS"], g["SUS"])
    d = cohens_d(b["SUS"], g["SUS"])
    log_result("SUS", stat, p, "Independent t-test", d, "Cohens_d")

def test_likert(b, g):
    stat, p = ttest_ind(b["Likert"], g["Likert"])
    d = cohens_d(b["Likert"], g["Likert"])
    log_result("Likert", stat, p, "Independent t-test", d, "Cohens_d")

#ERRORS
def test_errors(b, g):
    stat, p = mannwhitneyu(b["errorCount"], g["errorCount"])
    r = mann_whitney_r(b["errorCount"], g["errorCount"], stat)
    log_result("Errors", stat, p, "Mann-Whitney U", r, "r")

def test_warnings(b, g):
    stat, p = mannwhitneyu(b["warningCount"], g["warningCount"])
    r = mann_whitney_r(b["warningCount"], g["warningCount"], stat)
    log_result("Warnings", stat, p, "Mann-Whitney U", r, "r")

def test_error_rate(b, g):
    stat, p = mannwhitneyu(b["errorsPerAttempt"], g["errorsPerAttempt"])
    r = mann_whitney_r(b["errorsPerAttempt"], g["errorsPerAttempt"], stat)
    log_result("Errors per Attempt", stat, p, "Mann-Whitney U", r, "r")

def test_success_rate(b, g):
    stat, p = mannwhitneyu(b["successRate"], g["successRate"])
    r = mann_whitney_r(b["successRate"], g["successRate"], stat)
    log_result("Success Rate", stat, p, "Mann-Whitney U", r, "r")

#CORRELATION
def test_correlation(df):
    stat, p = spearmanr(df["attempts"], df["errorCount"])
    log_result("Attempts vs Errors", stat, p, "Spearman Correlation", abs(stat), "r_s")

    stat, p = spearmanr(df["taskTime"], df["attempts"])
    log_result("TaskTime vs Attempts", stat, p, "Spearman Correlation", abs(stat), "r_s")

#ATTEMPT-LEVEL
def extract_attempt_errors(df):
    rows = []

    for _, row in df.iterrows():
        for attempt in row.get("attemptHistory", []):
            errors = sum(
                1 for r in attempt.get("results", [])
                if r.get("hint") == "Error"
            )

            rows.append({
                "uiType": row["uiType"],
                "attempt": attempt.get("attempt", 0),
                "errors": errors
            })

    return pd.DataFrame(rows)

def test_attempt_learning(df):
    attempt_df = extract_attempt_errors(df)

    b = attempt_df[attempt_df["uiType"] == "baseline"]["errors"]
    g = attempt_df[attempt_df["uiType"] == "optimized"]["errors"]

    if len(b) > 0 and len(g) > 0:
        stat, p = mannwhitneyu(b, g)
        r = mann_whitney_r(b, g, stat)
        log_result("Attempt-Level Errors", stat, p, "Mann-Whitney U", r, "r")

#STEP ANALYSIS
def extract_step_errors(df):
    rows = []

    for _, row in df.iterrows():
        for step, values in row.get("errors", {}).items():
            total = sum(values.values()) if isinstance(values, dict) else 0

            rows.append({
                "uiType": row["uiType"],
                "step": step,
                "count": total
            })

    return pd.DataFrame(rows)

def test_step_errors(df):
    step_df = extract_step_errors(df)

    for step in step_df["step"].unique():
        subset = step_df[step_df["step"] == step]

        b = subset[subset["uiType"] == "baseline"]["count"]
        g = subset[subset["uiType"] == "optimized"]["count"]

        if len(b) > 0 and len(g) > 0:
            stat, p = mannwhitneyu(b, g)
            r = mann_whitney_r(b, g, stat)
            log_result(f"Errors in {step}", stat, p, "Mann-Whitney U", r, "r")

#DESCRIPTIVE STATS (median, IQR, SD for thesis reporting)
def export_descriptives(df):
    baseline = df[df["uiType"] == "baseline"]
    guided = df[df["uiType"] == "optimized"]

    metrics = [
        "taskTime", "attempts", "errorCount", "warningCount",
        "errorsPerAttempt", "warningsPerAttempt", "successRate",
        "SUS", "Likert", "firstAttemptComplianceSuccess", "taskSuccess"
    ]

    rows = []
    for m in metrics:
        if m not in df.columns:
            continue

        for label, group in [("baseline", baseline), ("guided", guided)]:
            vals = group[m].dropna()
            rows.append({
                "metric": m,
                "uiType": label,
                "mean": round(float(vals.mean()), 4),
                "median": round(float(vals.median()), 4),
                "std": round(float(vals.std()), 4),
                "Q1": round(float(vals.quantile(0.25)), 4),
                "Q3": round(float(vals.quantile(0.75)), 4),
                "IQR": round(float(vals.quantile(0.75) - vals.quantile(0.25)), 4),
                "min": round(float(vals.min()), 4),
                "max": round(float(vals.max()), 4),
                "n": int(len(vals))
            })

    desc_df = pd.DataFrame(rows)
    desc_df.to_csv("analysis/descriptives.csv", index=False)
    desc_df.to_json("analysis/descriptives.json", orient="records", indent=2)
    print(f"✔ Descriptives exported ({len(rows)} entries)")

#EXPORT
def export_all(df):
    os.makedirs("analysis", exist_ok=True)

    #Processed Data
    df.to_json("analysis/processed_data.json", orient="records", indent=2)
    df.to_csv("analysis/processed_data.csv", index=False)

    #Summary
    summary = df.groupby("uiType").mean(numeric_only=True)
    summary.to_csv("analysis/summary.csv")
    summary.to_json("analysis/summary.json", orient="records", indent=2)

    #Statistical Results (now includes effect sizes)
    df_results = pd.DataFrame(results_log)
    df_results.to_json("analysis/statistical_results.json", orient="records", indent=2)
    df_results.to_csv("analysis/statistical_results.csv", index=False)

    #Comments
    comments = [
        {
            "participantId": row.get("participantId"),
            "uiType": row.get("uiType"),
            "comment": row.get("open_feedback", "").strip()
        }
        for _, row in df.iterrows()
        if isinstance(row.get("open_feedback", ""), str) and row["open_feedback"].strip()
    ]

    comments_df = pd.DataFrame(comments)

    if not comments_df.empty:
        comments_df.to_csv("analysis/comments.csv", index=False)
        comments_df.to_json("analysis/comments.json", orient="records", indent=2)

    #Descriptive statistics (median, IQR, SD)
    export_descriptives(df)

    print(f"\n✔ Export complete ({len(df)} rows, {len(df_results)} tests, {len(comments_df)} comments)")

# MAIN
def run_all(path):
    df = load_data(path)
    df = preprocess(df)

    baseline, optimized = split_groups(df)

    test_task_time(baseline, optimized)
    test_attempts(baseline, optimized)
    test_first_attempt(df)
    test_task_success(df)

    test_sus(baseline, optimized)
    test_likert(baseline, optimized)

    test_errors(baseline, optimized)
    test_warnings(baseline, optimized)
    test_error_rate(baseline, optimized)
    test_success_rate(baseline, optimized)

    test_correlation(df)
    test_attempt_learning(df)
    test_step_errors(df)

    export_all(df)

if __name__ == "__main__":
    run_all("C:/Users/Matthias/Desktop/Bachelors_Thesis/PassportPhotoCapture-Backend/ParticipantsData/study_results_experiment.json")