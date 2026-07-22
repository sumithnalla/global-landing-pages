# Manikonda Branch Landing Page Implementation Plan

We are restructuring and building the new **Manikonda Branch Landing Page** and updating **Thank You Page** based on the specifications in `manikonda-branch.md`.

## Key Objectives
1. **Paid Traffic Optimized Section Hierarchy**: Reorder page sections to maximize paid ad conversions (prove match -> curriculum -> social proof -> objection handling FAQ -> final urgency CTA).
2. **Dynamic Course Customization (`?course=fico` or `?course=mm`)**:
   - Parse URL parameter `?course=fico` or `?course=mm` dynamically.
   - Update document title, meta tags, H1 headline band, hero form headline, and form source tags automatically.
   - Bring the relevant course module card (SAP FICO or SAP MM) to the top of the Program Overview section.
3. **Modular File Architecture**:
   - Extract custom styles into `style.css`.
   - Extract form handling, lead submissions, modal controls, immediate callback, and URL parameter logic into `script.js`.
   - Ensure clean HTML markup in `sap-manikonda.html` (and sync with `sap-training-manikonda-hyderabad.html` / `index.html` as needed).
4. **Thank You Page (`manikonda-thank.html`)**:
   - Verify layout, GTM tracking, WhatsApp contact link, and back-to-landing-page navigation.
5. **Asset Copy**:
   - Copy required media assets (logos, company badges, student photos, award images, icons, syllabus PDF) from `d:\sumith\GlobalCoach IT\` into `d:\sumith\GlobalCoach IT\brach-wise landing\`.

---

## Section Order (Reordered for Paid Traffic)

| Order | Section | Content & Purpose |
|-------|---------|-------------------|
| 1 | **Header** | Logo, phone contact CTA, Book Demo button |
| 2 | **Headline Band** | Dynamic H1 banner (`SAP FICO` / `SAP MM` / `SAP Training & Placement`) |
| 3 | **Hero + Form** | Image slider + hero demo booking form |
| 4 | **Program Overview (Modules)** | *Moved up to Position 4* — Immediately proves curriculum relevance after hero |
| 5 | **Instant Callback Bar** | 10-minute quick callback phone capture |
| 6 | **Alumni Logos** | Top hiring companies carousel |
| 7 | **Testimonials / Real Stories** | Video + student success stories & packages |
| 8 | **Why Choose Global Coach** | 10+ yrs, 5000+ students, certified trainers, award images, syllabus download |
| 9 | **Mid-Page Form** | Mid-funnel conversion booking form |
| 10 | **FAQ** | *Moved right before final push* — Handles fees & duration objections right before final decision |
| 11 | **Re-engagement Banner** | "Admissions Open Now" banner before footer |
| 12 | **Footer** | Address, landmark, phone, copyright links |

---

## Proposed File Changes

### [brach-wise landing]

#### [NEW] [style.css](file:///d:/sumith/GlobalCoach%20IT/brach-wise%20landing/style.css)
- Contains custom CSS rules (headline band grid, logo carousel animations, hero layout styles, responsive adjustments, modal overlays).

#### [NEW] [script.js](file:///d:/sumith/GlobalCoach%20IT/brach-wise%20landing/script.js)
- Contains:
  1. **URL Parameter Parser (`?course=fico` / `?course=mm`)**: Swaps H1, title, meta description, form default sources, and highlights/re-orders FICO vs MM cards dynamically.
  2. **Form Submissions**: Integrates Google Sheets Webhook (`CONTACT_FORM_ENDPOINT`) and CRM Webhook (`CRATIO_WEBHOOK_URL`) with seamless redirect to `manikonda-thank.html`.
  3. **Immediate Callback Handler**: Handles 10-minute callback submissions.
  4. **PDF Download Logic**: Downloads syllabus PDF before redirecting if requested.

#### [MODIFY] [sap-manikonda.html](file:///d:/sumith/GlobalCoach%20IT/brach-wise%20landing/sap-manikonda.html)
- Update HTML structure to match the new paid traffic section order.
- Link `style.css` and `script.js`.
- Add `id="module-fico"` and `id="module-mm"` data attributes for dynamic JS reordering.

#### [MODIFY] [manikonda-thank.html](file:///d:/sumith/GlobalCoach%20IT/brach-wise%20landing/manikonda-thank.html)
- Ensure clean design, correct back button link (`sap-manikonda.html`), WhatsApp link, and GTM tracking.

---

## Verification Plan

### Manual Verification
1. Open `sap-manikonda.html` in browser.
2. Test default URL (no parameter): Verify default headline and sections order.
3. Test `sap-manikonda.html?course=fico`: Verify H1 changes to **SAP FICO Training & Placement Assistance**, document title updates, and SAP FICO module card moves to the top of Program Overview.
4. Test `sap-manikonda.html?course=mm`: Verify H1 changes to **SAP MM Training & Placement Assistance**, document title updates, and SAP MM module card moves to top.
5. Test Form Submissions (Hero form, Mid-page form, Modal form, Instant Callback bar): Verify submit functionality and redirect to `manikonda-thank.html`.
6. Verify responsive layout on desktop and mobile breakpoints.
