# Backend — detection API & analysis pipeline

Two things in one folder:

1. A **FastAPI + MediaPipe** service that powers the study app's real‑time face‑compliance feedback.
2. An **offline statistical‑analysis pipeline** that turns exported participant data into the tables and figures used in the Bachelor's thesis.

Backend for the [guided passport-photo capture study](../README.md) — see the root README for the research question, architecture and results.

## Tech stack

- **FastAPI** + **Uvicorn** — HTTP API (`/detect`).
- **MediaPipe FaceMesh** + **OpenCV** + **NumPy** — landmark extraction, brightness / background / pose metrics.
- **pandas** + **SciPy** — paired/unpaired tests (Mann–Whitney, t‑test, χ²/Fisher, Spearman) and effect sizes.
- **matplotlib** — figure generation.

Python 3.11+. Dependencies are pinned in `requirements.txt`.

## Run it

```bash
python -m venv venv
source venv/Scripts/activate       # Windows bash; bin/activate on macOS/Linux
pip install -r requirements.txt

# 1) Face‑detection API (consumed by the app)
uvicorn server:app --host 0.0.0.0 --port 8000 --reload

# 2) Offline analysis pipeline (re‑run whenever ParticipantsData/ changes)
python analysis.py    # writes tables to analysis/
python plots.py       # writes figures to figures/
```

Bind to `0.0.0.0` so a phone on the same LAN can reach the host — a device cannot resolve `localhost` to your machine. Point the app at this host by setting `EXPO_PUBLIC_BACKEND_URL=http://<LAN-IP>:8000` (see `PassportPhotoCaptureApp/constants/Config.js`).

## `server.py` — face‑detection API

Single endpoint: `POST /detect` — accepts a base64‑encoded frame, returns a normalized JSON response containing:

- face count + bounding box,
- landmark set from MediaPipe FaceMesh,
- brightness metrics and a background‑OK flag,
- head pose (yaw, roll),
- eye openness and mouth openness.

The app maps this response to per‑step compliance hints in `util/ComplianceCheck.js`. Keep the two in sync: when you add a metric here, add its rule there.

## Analysis pipeline

Input:  `ParticipantsData/study_results_experiment.json` (exported from the app).
Output: `analysis/` (CSV + JSON) and `figures/` (PNG).

`analysis.py` is a single script that:

1. Loads all participant records.
2. Derives per‑row metrics:
   - `taskTime` = `endTimestamp − startTimestamp`
   - `SUS score` from the 10 SUS items
   - mean Likert from the 5 custom items
   - `errorsPerAttempt`
3. Runs paired and unpaired inferential tests across the two UI variants.
4. Writes every result as both `.csv` (for inspection) and `.json` (for downstream code).

`plots.py` consumes `analysis/` and regenerates all figures used in the thesis.

## Folder map

| Path | Purpose |
|---|---|
| `server.py` | FastAPI app, MediaPipe pipeline, `/detect` endpoint |
| `analysis.py` | Full offline stats pipeline |
| `plots.py` | Figure generation from `analysis/` outputs |
| `ParticipantsData/` | Raw exports from the study app (pipeline input) |
| `analysis/` | Derived tables (CSV + JSON) |
| `figures/` | Plots used in the thesis |
| `requirements.txt` | Pinned dependencies (fastapi, mediapipe, opencv-python, numpy, pandas, scipy, matplotlib) |

## Conventions

- Re‑run `analysis.py` **before** `plots.py` — plots read from `analysis/`, not from raw data.
- Detection‑logic changes must be paired with updates to the app's `ComplianceCheck.js` / `StepInformations.js`.
- Keep the `/detect` response schema additive; the client normalizes it in `AdaptFaceDedectionMetrics.js`.
