# Sage's Middle-earth Command Homepage

## GitHub Pages upload rule

Upload the contents of this folder to the root of your `abdickers/HomePage` repo.

Your repo root should look like this:

```text
HomePage/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
│   ├── Headerhomepage.png
│   ├── palantir.svg
│   ├── ring-footer.svg
│   ├── sigil.svg
│   └── avatars/
│       ├── avatar-01-row1-col1.png
│       ├── ...
│       └── avatar-13-row4-col4.png
└── README.md
```

The page pulls service icons through favicon URLs at runtime, so no extra icon files are needed in the repo.

## Google Calendar

The calendar panel is wired for live Google Calendar events using browser OAuth.

In `js/app.js`, find:

```js
googleCalendar: {
  clientId: '',
  calendarId: 'primary',
  scopes: 'https://www.googleapis.com/auth/calendar.readonly',
  maxResults: 8
}
```

Replace `clientId` with a Google OAuth 2.0 Client ID for a Web application. In Google Cloud Console, add your local preview origin and your GitHub Pages origin as authorized JavaScript origins, for example:

```text
http://localhost:4173
https://abdickers.github.io
```

The OAuth client ID is public by design. Do not add a client secret to this static site.

Google sign-in must be completed in a normal browser tab, such as Chrome or Edge. VS Code preview panes and other embedded webviews can trigger Google's "Access blocked" OAuth policy screen.

If you still see an OAuth error in a normal browser, check these settings:

- The OAuth client type is `Web application`, not Desktop.
- Authorized JavaScript origins include the exact local origin, such as `http://localhost:4173`.
- If you open `127.0.0.1`, add `http://127.0.0.1:4173` too.
- The Google Calendar API is enabled for the same Google Cloud project.
- If the OAuth consent screen is in Testing mode, your Google account is listed under Test users.

## Weather Underground

The weather panel is configured for:

- Station name: Sage Cabin
- Station ID: KMOHARRI62

Add your Weather Underground / weather.com API key in:

```text
js/app.js
```

Find:

```js
weatherApiKey: ''
```

Replace with:

```js
weatherApiKey: 'YOUR_API_KEY_HERE'
```
