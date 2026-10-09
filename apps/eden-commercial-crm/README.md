# Eden Commercial CRM — CC App Hub App

Standalone app extracted from the Eden GMC public website.

## Includes
- 97 seeded commercial prospects
- Daily contact queue
- Automatic follow-up dates
- Quote status and pipeline stages
- One-off/monthly/annual contract values
- Commercial site survey
- CSV export
- Optional Supabase cloud sync

## CC App Hub
Upload this folder as its own app/repository, then add its published `index.html` URL as the Eden Commercial CRM tile in the CC App Hub.

## Cloud sync
Run `SUPABASE-CRM-SETUP.sql` once and add only the Supabase Project URL + publishable key to `supabase-config.js`. Never put a service-role/secret key in a public static app.
