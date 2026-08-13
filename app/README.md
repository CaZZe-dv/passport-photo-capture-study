# App — Expo / React Native study client

Expo / React Native study app for a Bachelor's thesis comparing two UI variants for capturing ICAO‑compliant passport photos. Participants complete the capture task under both variants (within‑subjects), then fill out questionnaires. All results are persisted locally and exported as JSON for offline statistical analysis.

Study client for the [guided passport-photo capture study](../README.md) — see the root README for the research question, architecture and results.

## Tech stack

- **Expo SDK / React Native** — cross‑platform client (Android, iOS, web).
- **React Navigation** — stack‑based study flow.
- **AsyncStorage** — local persistence of in‑progress sessions and final results.
- **expo-camera** — live frame capture, base64‑encoded and sent to the backend.

## Run it

```bash
npm install
npm start            # Metro bundler + QR
npm run android      # expo run:android
npm run ios          # expo run:ios
npm run web          # expo start --web
```

No linter or test runner is configured.

## Backend connection

The backend URL lives in `constants/Config.js` and can be overridden without touching source:

```bash
EXPO_PUBLIC_BACKEND_URL=http://<your-LAN-IP>:8000 npm start
```

Use the dev machine's **LAN IP**, not `localhost` — on a physical device that resolves to the phone itself. The bundled fallback is the address used during the study. To run without a backend, swap `util/FaceDetectionMock.js` into `util/FaceDedection.js`.

## Study flow

Defined in `navigation/AppNavigator.js`:

```
StartScreen → ChooseUIScreen → StartTestScreen
  → {Baseline | Optimized}UIScreen → …ReviewScreen → …RetryScreen?
  → EndTestScreen → Questionnaire* → QuestionnaireEndScreen
```

`ChooseUIScreen` + `store/StorageService.js:getNextUITypeSmart` counterbalance which UI variant each participant sees first. The two variants (`screens/baselineUIScreens/` vs `screens/optimizedUIScreens/`, mirrored in `components/`) are the experimental conditions — they are intentionally kept symmetrical and independent.

## Folder map

| Folder | Purpose |
|---|---|
| `screens/` | One screen per study step, split by UI variant and questionnaire |
| `components/` | Reusable UI pieces (`Camera/`, `compliance/`, `OptimizedUI/`, `Questionnaire/`, …) |
| `navigation/` | Stack navigator — single source of truth for the flow |
| `store/` | `StudyResultsContext` (app‑wide state, 5‑min run timeout) + `StorageService` (AsyncStorage wrapper) |
| `models/` | Class shapes: `TestValue`, `Steps`, `Questions`, … |
| `constants/` | Static data: question text, UI copy, hint catalog, `StepInformations` |
| `util/` | Face‑detection glue (`FaceDedection`, `AdaptFaceDedectionMetrics`, `ComplianceCheck`), image cropping, data export |

## Face‑detection pipeline (client side)

1. `components/Camera/` captures a frame, base64‑encodes it.
2. `util/FaceDedection.js` POSTs it to the backend `/detect` endpoint.
3. `util/AdaptFaceDedectionMetrics.js` normalizes the response.
4. `util/ComplianceCheck.js` maps metrics → user hint for the current `STEP` (face count → centering → lighting → …).
5. The active screen renders the hint from `constants/StepInformations.js`.

When changing detection logic, update **both** the backend (`server.py`) and `ComplianceCheck.js` / `StepInformations.js` together.

## Data export

Final results are written through `util/DataExportService.js` / `ExportModalScreen` and land in `PassportPhotoCapture-Backend/ParticipantsData/study_results_experiment.json`, which is the direct input to the backend's `analysis.py`.

## Conventions

- New strings (hints, questionnaire items) go into `constants/` and are referenced from the matching model in `models/` — do **not** inline copy in screen components.
- Keep baseline and optimized variants behaviorally symmetrical; only the UX differs.
