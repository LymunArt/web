# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Entrepreneurs and small/medium businesses (pymes) without in-house technical staff. They currently rent tools from SaaS providers, run operations by hand in spreadsheets, or need help keeping their office computers running. They are not technical: they describe what they need in their own words and want someone to handle the technology while they keep the final say.

A second, narrower audience is returning clients: anyone who has completed three services with LymunArt unlocks LymunArt Dev (see below).

Country/region of the client base is not yet stated; copy uses Latin American Spanish ("computadores", "celulares").

## Product Purpose

LymunArt is a technology services business. It gives small businesses their own technology instead of rented technology: equipment maintenance, websites, mobile apps, and automation. This site presents those services, explains the ownership argument, and routes visitors to contact LymunArt.

Success: a non-technical business owner understands what LymunArt does, why owning their systems beats renting them, and reaches out with their idea.

## Positioning

"No hay nada mejor que lo propio." Everything LymunArt builds is delivered in the client's name: the code, the data, the domain, and the access credentials. The pitch is ownership and independence from providers who charge monthly, hold the data, raise prices, or shut down, set against one-size-fits-all SaaS. The client decides at every step; LymunArt proposes and guides.

## Operating Context

- Four services: equipment maintenance (cleaning, backups, diagnosis and repair), websites (branded, mobile-ready, domain in the client's name, client-editable), mobile apps (Android and iPhone, store publication), and automation (inventories, appointments, orders, reports that today live in spreadsheets).
- Working process: the client explains the need → receives a clear proposal with times and costs and decides → LymunArt builds while showing progress, and the client approves each stage → everything is handed over in the client's name.
- For now LymunArt is the founder alone (working with AI tools); hiring is planned for later. The site must not imply a team or staff that does not exist yet. Dev clients work directly with the founder. (Updated 2026-10-15.)
- Based in Bogotá, Colombia: registration with the Cámara de Comercio de Bogotá (CCB) and trademark registration with the SIC are in progress.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4 via PostCSS, `next/font`. Spanish UI (`lang="es"`); code identifiers and comments are in Spanish.
- Light/dark theme with a toggle persisted in `localStorage`, falling back to the OS preference.
- Routes: `/` (home landing with condensed sections) plus one full page per nav item for SEO and Google sitelinks, each with its own metadata, and `/dev` (LymunArt Dev).
- **LymunArt Dev:** an exclusive area for special clients, unlocked automatically after a client's third completed service. At two completed services the client is told they are one away; at three a wine-colored "Ganaste tu acceso a LymunArt Dev" button appears in the site header. That button needs client accounts, which do not exist yet (`lib/acceso-dev.ts`). On the main site, Dev is linked only from the footer. It offers direct attention from the founder, priority in delivery, custom systems, and ongoing support. Client login to see their projects is planned ("próximamente"), not built.
- **Phased rollout:** this is phase 1. Contact channels are not live yet. An AI assistant ("Asistente LymunArt") that interviews the visitor and forwards the request arrives in phase 3. WhatsApp arrives once there is a company number. Until then contact is shown as "próximamente".
- Undecided: client region, pricing (proposals are per project; no public prices), the contact channel available before phase 3.

## Brand Commitments

- Name: **LymunArt**, written with "Art" set apart in the accent color in the wordmark. Slogan: "No hay nada mejor que lo propio."
- Logo: a crescent moon beside five buildings. Variants in `public/logo/` (`lymunart-logo.svg`, `-negativo`, `-tinta`, `-cielo`, plus `lymunart-dev-logo.svg`). Brand rules carried in code: use the negative version on dark backgrounds; the logo is never shown under 64 px (the header uses the wordmark instead).
- Voice: the whole site, LymunArt Dev included, addresses the visitor as **tú**, warm and plain, with no technical jargon. The client should feel they are the one deciding ("el patrón") without feeling they know more than LymunArt. (Decided 2026-10-14, `docs/rediseno-landing.md`.)
- Web palette, max three roles: light base (cream/white), orange `#D9661A` as primary for actions, sky blue `#B8E6F9` to highlight links and words; ink `#1E1B2E` for text. Lilac `#B79CED` and the rest of the brand-guide palette are reserved for special moments such as finish or pay buttons.
- Fonts: only Sora (headings) and Inter (text) across the whole site, Dev included.
- LymunArt Dev keeps its own identity (black `#000000`, wine `#330A15`, white text). It is not a section of the main landing: it lives at `/dev` with its own navbar and footer and a clear way back to LymunArt.
- The palette and fonts in `app/globals.css` and `app/layout.tsx` come from a brand guide that is not in this repository.

## Evidence on Hand

- Delivered projects exist, but none are documented in the repository yet; client names, screenshots, and permission to publish have to come from the founder.
- No testimonials, client counts, metrics, press, or prices. Do not invent any of these. A clients/testimonials section exists in code but stays hidden until real data is added.
- No company social media accounts yet; footer social links wait for them.
- Logo assets: `public/logo/`.

## Product Principles

1. **Ownership is the product.** Every claim and flow should make clear that the client ends up owning the code, data, domain, and access.
2. **The client decides.** Present choices and clear next steps. Never pressure, and never hide costs or process.
3. **Plain language first.** Write for a business owner, not an engineer. If a term needs explaining, use a different term.
4. **Honest about what is still coming.** Unbuilt channels and features are labeled "próximamente", never presented as live.
5. **Dev is earned.** LymunArt Dev should feel like a reward for loyalty, separate in tone and identity, without making the main brand feel second-class.
