# Adaptable UI

Research PoC testing whether an LLM can adapt UI/UX (starting with a
deeply nested side menu) based on user actions and analytics.

## Structure

- `api/`: Express.js API, data stored in a lowdb JSON file
- `app/`: React frontend

## Run

- Ports: app TODO, api TODO
- Env: TODO (LLM API key and model name, if any)
- Data file: TODO path, e.g. `api/db.json` (mount it as a volume so
  data survives container restarts)

## How the experiment works

User actions are stored by the api. The AI processes the stored data
and decides what happens with the UI (for example reordering menu
items or adding a shortcut to frequently visited pages). The UI
adaptation logic is use-case specific and not implemented yet.

## Rules for agents

- This is a research PoC: prefer simple, readable code over
  production hardening.
- Ask before adding dependencies.
- Document the shape of the lowdb data file (TODO: where) and ask
  before changing it.
- Keep everything runnable with `docker compose up`.