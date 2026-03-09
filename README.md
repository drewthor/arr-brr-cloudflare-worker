# arr-brr-cloudflare-worker

A Cloudflare Worker that receives webhooks from [Sonarr](https://sonarr.tv) and [Radarr](https://radarr.video), and forwards notifications to [brrr](https://brrr.now).

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler`)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- A [brrr](https://brrr.now) account with a webhook URL

### Install dependencies

```sh
npm install
```

### Configure secrets

Three secrets must be set. These are **not** stored in `wrangler.toml` and are kept encrypted by Cloudflare.

```sh
# The brrr webhook secret (the br_usr_... portion of your brrr webhook URL)
npx wrangler secret put BRRR_SECRET

# A secret string that Sonarr will send in the X-Webhook-Secret header
npx wrangler secret put SONARR_WEBHOOK_SECRET

# A secret string that Radarr will send in the X-Webhook-Secret header
npx wrangler secret put RADARR_WEBHOOK_SECRET
```

Choose any strong random strings for `SONARR_WEBHOOK_SECRET` and `RADARR_WEBHOOK_SECRET` -- they just need to match what you configure in Sonarr/Radarr.

For local development, create a `.dev.vars` file (git-ignored):

```
BRRR_SECRET=br_usr_your_secret_here
SONARR_WEBHOOK_SECRET=your-sonarr-secret
RADARR_WEBHOOK_SECRET=your-radarr-secret
```

### Deploy

```sh
npm run deploy
```

This will deploy the worker. Note the URL it prints (e.g. `https://arr-brr-cloudflare-worker.<your-subdomain>.workers.dev`).

### Configure Sonarr

1. Go to **Settings > Connect > +** and add a **Webhook** notification
2. Set the **URL** to `https://<your-worker-url>/webhook/sonarr`
3. Set **Method** to `POST`
4. Under **Tags / Headers** (advanced), add a custom header:
   - **Key:** `X-Webhook-Secret`
   - **Value:** the same string you set for `SONARR_WEBHOOK_SECRET`
5. Enable whichever events you want (On Grab, On Download, On Upgrade, etc.)
6. Click **Test** to verify, then **Save**

### Configure Radarr

1. Go to **Settings > Connect > +** and add a **Webhook** notification
2. Set the **URL** to `https://<your-worker-url>/webhook/radarr`
3. Set **Method** to `POST`
4. Under **Tags / Headers** (advanced), add a custom header:
   - **Key:** `X-Webhook-Secret`
   - **Value:** the same string you set for `RADARR_WEBHOOK_SECRET`
5. Enable whichever events you want (On Grab, On Download, On Upgrade, etc.)
6. Click **Test** to verify, then **Save**

## Event toggles

All events are **enabled by default**. To disable specific events, edit `wrangler.toml` and set the corresponding variable to `"false"`, then redeploy.

### Sonarr events

| Variable | Event | Default |
|---|---|---|
| `SONARR_ON_GRAB` | Release grabbed from indexer | `"true"` |
| `SONARR_ON_DOWNLOAD` | Episode file imported | `"true"` |
| `SONARR_ON_UPGRADE` | Episode file upgraded (replaces existing) | `"true"` |
| `SONARR_ON_RENAME` | Episode files renamed | `"true"` |
| `SONARR_ON_SERIES_ADD` | New series added | `"true"` |
| `SONARR_ON_SERIES_DELETE` | Series deleted | `"true"` |
| `SONARR_ON_EPISODE_FILE_DELETE` | Episode file deleted | `"true"` |
| `SONARR_ON_HEALTH` | Health check issue detected | `"true"` |
| `SONARR_ON_HEALTH_RESTORED` | Health check issue resolved | `"true"` |
| `SONARR_ON_APPLICATION_UPDATE` | Sonarr updated to new version | `"true"` |
| `SONARR_ON_MANUAL_INTERACTION_REQUIRED` | Download needs manual intervention | `"true"` |

### Radarr events

| Variable | Event | Default |
|---|---|---|
| `RADARR_ON_GRAB` | Release grabbed from indexer | `"true"` |
| `RADARR_ON_DOWNLOAD` | Movie file imported | `"true"` |
| `RADARR_ON_UPGRADE` | Movie file upgraded (replaces existing) | `"true"` |
| `RADARR_ON_RENAME` | Movie files renamed | `"true"` |
| `RADARR_ON_MOVIE_ADDED` | New movie added | `"true"` |
| `RADARR_ON_MOVIE_DELETE` | Movie deleted | `"true"` |
| `RADARR_ON_MOVIE_FILE_DELETE` | Movie file deleted | `"true"` |
| `RADARR_ON_HEALTH` | Health check issue detected | `"true"` |
| `RADARR_ON_HEALTH_RESTORED` | Health check issue resolved | `"true"` |
| `RADARR_ON_APPLICATION_UPDATE` | Radarr updated to new version | `"true"` |
| `RADARR_ON_MANUAL_INTERACTION_REQUIRED` | Download needs manual intervention | `"true"` |

### Example: disable rename notifications

In `wrangler.toml`:

```toml
[vars]
SONARR_ON_RENAME = "false"
RADARR_ON_RENAME = "false"
```

Then redeploy:

```sh
npm run deploy
```

## Development

```sh
npm run dev
```

This starts a local dev server using Wrangler. Secrets are loaded from `.dev.vars`.

## Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/webhook/sonarr` | Receives Sonarr webhook payloads |
| `POST` | `/webhook/radarr` | Receives Radarr webhook payloads |

All other methods/paths return `404` or `405`.

## License

[MIT](LICENSE)
