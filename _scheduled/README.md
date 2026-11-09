# Scheduled blog posts

Posts listed in `posts.json` publish automatically every Monday morning
(see `.github/workflows/publish-scheduled.yml`). Netlify puts them live.

- Change a date: edit `date` in `posts.json`.
- Cancel a post: remove its entry from `posts.json`.
- Edit a post before it goes live: edit `posts/<slug>.html`.
- Preview what is due: `FAKE_DATE=2026-12-07 python3 _scheduled/publish.py --dry-run`

This folder is blocked from public view by `netlify.toml`.
