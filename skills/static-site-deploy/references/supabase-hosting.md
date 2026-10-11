# Supabase hosting decision

Use this reference when a user asks to publish a frontend on Supabase or to combine Supabase with a managed frontend host.

## Decision table

| Need | Preferred placement | Reason |
|---|---|---|
| Database, Auth, Storage, RLS, backend API | Supabase project | These are Supabase's core managed services |
| Static Next.js export or SPA with a normal public URL | Vercel, Netlify, GitHub Pages, or equivalent static host | The host serves HTML, CSS and JS as a web application with predictable asset routing |
| Server-side Next.js rendering | Vercel or another SSR-capable host | Static storage is not an SSR runtime |
| Supabase Edge Function API | Supabase Edge Functions | Use for API/orchestration logic, not as an assumed static-site host |
| HTML from a Supabase public Storage bucket | Only after verifying browser content type and asset behavior | A file URL may be downloadable/plain text rather than a fully served website |
| HTML from an Edge Function URL | Only after verifying the deployed route and content type; custom-domain requirements may apply | A function endpoint is not automatically equivalent to frontend hosting |

## Procedure

1. Build the frontend and confirm the exported artifact (`out/` for a static Next.js export).
2. Inspect the Supabase project and the user's authorized deployment capabilities without printing tokens.
3. Verify the chosen Supabase path can serve HTML with `text/html`, resolve `/_next/` or equivalent assets, support client-side routing, and provide HTTPS from a public URL.
4. If any of those checks fail, recommend split hosting: frontend on a managed web host, Supabase for backend services.
5. Keep the frontend's public environment variables limited to publishable values such as project URL and anon/publishable key; never ship service-role keys.
6. Verify from a clean machine or external network: document status, CSS/JS status, styled rendering, route navigation and console/network errors.
7. Report the exact public URL only after the external verification passes.

## Integration pattern

Use Supabase as the platform backend behind a stable frontend API boundary:

```text
Browser UI → portal API/client → Supabase Edge Function or approved upstream adapter → Quicklead systems
```

Keep Quicklead operational-system credentials server-side. Use RLS and server-side authorization for customer, fleet, vehicle, booking, invoice and approval scopes.

## Pitfalls

- Do not promise a Supabase URL merely because a file uploaded successfully; upload success does not prove browser rendering.
- Do not put service-role keys in `NEXT_PUBLIC_*` variables; public variables are bundled into the browser.
- Do not call localhost a cross-PC access link; use a public HTTPS host.
- Do not create or authorize a hosting account on the user's behalf outside the provider's approved login flow.
