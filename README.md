# Notion Life Calendar · Mood Tracker · Diary

Designed for this Notion schema:
- `What happened today (Diary)` — Title
- `Date` — Date
- `Mood` — Select or Status
- `Happiness` — optional
- `Categories` — optional
- `Created at` — optional

Views:
- Lifetime: 90 years × 52 weeks. A week uses the dominant mood color among that week's daily entries. Click a week to open Week view.
- Year: one square per day.
- Month: calendar grid with mood color + diary marker.
- Week: 7 daily diary-preview cards.

Click a day in Year / Month / Week to choose Mood, write Diary, and Save directly to Notion.

## Notion connection permissions
This widget writes data, so enable:
- Read content
- Update content
- Insert content
User information can remain `No user information`.

Give the connection Content access to the Life Calendar database.

## Vercel environment variables
- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`
- `BIRTH_DATE` in `YYYY-MM-DD`
- `LIFESPAN_YEARS` optional, defaults to 90

Do not put the Notion token in GitHub.

Mood names should match the widget's list exactly.
