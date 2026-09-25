# Confidence Plans — GitHub Pages App

A single-file, mobile-friendly app with a landing-page plan selector and six 12-week programmes.

## Included plans
- Conversation & Social Skills (the original uploaded 12-week programme)
- Confident Dating Mindset
- Approaching Women
- Dating & Relationships
- Self-Worth & People-Pleasing
- 12-Week Complete Programme

Progress is stored independently for each plan in browser localStorage.

## Run locally
Open `index.html` in a browser.

## Publish on GitHub Pages
Upload `index.html` to your repository and enable Pages from the main branch / root.


## Adding apps without rebuilding the Hub
1. Upload the new app folder to `apps/` in GitHub (or host it elsewhere).
2. Open the Hub and press **+ Add App**.
3. Enter its title, icon, description and path/URL.
4. When signed in, the custom app catalogue syncs through the Supabase `user_app_data` record.

For permanent repository-defined apps, edit `config/apps.json`. Those tiles load automatically on every device.
