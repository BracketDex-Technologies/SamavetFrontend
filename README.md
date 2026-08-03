# Samavet ePawati frontend

Mobile-first React and Vite frontend for Samavet ePawati.

## Local development

Copy `.env.example` to `.env.local`, then run:

```bash
npm ci
npm run dev
```

## Production verification

```bash
npm run lint
npm run build
npm run preview
```

Only `VITE_API_BASE_URL` is required. Vite variables are public browser configuration; never store database passwords, JWT secrets, Supabase service-role keys, or WhatsApp keys in them.

For the Vercel Production environment, set `VITE_API_BASE_URL=https://samavetbackend.onrender.com/api/v1` and redeploy after changing it. The custom production domain is `https://epawati.samavet.in`.

The included `vercel.json` configures SPA routing, immutable caching for hashed assets, and browser security headers. The included Docker and Nginx configuration provides an alternative static deployment.

## Performance behavior

- Hashed production assets are cached for one year.
- HTML is not cached, so releases become visible immediately.
- The UI uses system fonts and does not block rendering on third-party font downloads.
- API requests time out with a readable retry message.
- Session refresh and workspace synchronization are deduplicated.
- Receipt rendering and WhatsApp finalization run after slip creation is confirmed.

## React + TypeScript + Vite notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories. Vercel
