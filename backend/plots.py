import os
import pandas as pd
import matplotlib.pyplot as plt

#SETUP
os.makedirs("figures", exist_ok=True)

plt.rcParams.update({
    "font.size": 12
})

#LOAD DATA
df = pd.read_json("analysis/processed_data.json")

baseline = df[df["uiType"] == "baseline"]
guided = df[df["uiType"] == "optimized"]  #keep data as is, only rename for display

#HELPER FUNCTIONS
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

#Task completion time
plt.figure()
plt.boxplot([baseline["taskTime"], guided["taskTime"]])
plt.xticks([1, 2], ["Baseline UI", "Guided UI"])
plt.title("Task Completion Time")
plt.ylabel("Seconds")
plt.savefig("figures/task_time.png", dpi=300)

#Number of attempts
plt.figure()
plt.boxplot([baseline["attempts"], guided["attempts"]])
plt.xticks([1, 2], ["Baseline UI", "Guided UI"])
plt.title("Number of Attempts")
plt.savefig("figures/attempts.png", dpi=300)

#SUS + Likert (side by side)
fig, axes = plt.subplots(1, 2, figsize=(10, 5))

axes[0].boxplot([baseline["SUS"], guided["SUS"]])
axes[0].set_xticks([1, 2])
axes[0].set_xticklabels(["Baseline UI", "Guided UI"])
axes[0].set_title("SUS Score")
axes[0].set_ylabel("Score")

axes[1].boxplot([baseline["Likert"], guided["Likert"]])
axes[1].set_xticks([1, 2])
axes[1].set_xticklabels(["Baseline UI", "Guided UI"])
axes[1].set_title("Likert Scores")

plt.tight_layout()
plt.savefig("figures/sus_likert.png", dpi=300)

#Error plots (2x2 grid)
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

axes[0, 0].boxplot([baseline["errorCount"], guided["errorCount"]])
axes[0, 0].set_xticks([1, 2])
axes[0, 0].set_xticklabels(["Baseline UI", "Guided UI"])
axes[0, 0].set_title("Total Errors")
axes[0, 0].set_ylabel("Errors")

axes[0, 1].boxplot([baseline["errorsPerAttempt"], guided["errorsPerAttempt"]])
axes[0, 1].set_xticks([1, 2])
axes[0, 1].set_xticklabels(["Baseline UI", "Guided UI"])
axes[0, 1].set_title("Errors per Attempt")

axes[1, 0].boxplot([baseline["successRate"], guided["successRate"]])
axes[1, 0].set_xticks([1, 2])
axes[1, 0].set_xticklabels(["Baseline UI", "Guided UI"])
axes[1, 0].set_title("Success Rate")

axes[1, 1].set_visible(False)

plt.tight_layout()
plt.savefig("figures/errors_grid.png", dpi=300)

#Attempts vs Errors
plt.figure()
plt.scatter(df["attempts"], df["errorCount"])
plt.xlabel("Attempts")
plt.ylabel("Errors")
plt.title("Attempts vs Errors")
plt.savefig("figures/attempts_vs_errors.png", dpi=300)

#Time vs Attempts
plt.figure()
plt.scatter(df["attempts"], df["taskTime"])
plt.xlabel("Attempts")
plt.ylabel("Task Time")
plt.title("Task Time vs Attempts")
plt.savefig("figures/time_vs_attempts.png", dpi=300)

#Learning curve
attempt_df = extract_attempt_errors(df)

if not attempt_df.empty:
    plt.figure()

    for ui in ["baseline", "optimized"]:
        subset = attempt_df[attempt_df["uiType"] == ui]
        means = subset.groupby("attempt")["errors"].mean()

        label = "Baseline UI" if ui == "baseline" else "Guided UI"
        plt.plot(means.index, means.values, label=label)

    plt.xlabel("Attempt")
    plt.ylabel("Errors")
    plt.title("Errors per Attempt (Learning Effect)")
    plt.legend()

    plt.savefig("figures/learning_curve.png", dpi=300)

#Errors per step
step_df = extract_step_errors(df)

if not step_df.empty:
    pivot = step_df.pivot_table(
        index="step",
        columns="uiType",
        values="count",
        aggfunc="mean"
    )

    pivot.rename(columns={
        "baseline": "Baseline UI",
        "optimized": "Guided UI"
    }, inplace=True)

    pivot.plot(kind="bar")

    plt.title("Errors per Step")
    plt.ylabel("Average Errors")
    plt.xticks(rotation=45)

    plt.tight_layout()

    plt.savefig("figures/errors_per_step.png", dpi=300)

print("All plots saved")