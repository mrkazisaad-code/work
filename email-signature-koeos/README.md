# KOEOS email signatures and brand strips

HTML email signatures for KOEOS, with plain-text fallbacks and brand-strip images, all built from editable sources.

## What is here

| Path | Contents |
|---|---|
| `signatures/<slug>.html` | Copy-paste signature: open it in a browser, select all and copy (see [INSTALL.md](INSTALL.md)) |
| `signatures/<slug>-with-strip.html` | The same signature with the signature strip switched on |
| `signatures/<slug>.txt` | Plain-text fallback |
| `assets/` | PNGs to host at `https://koeos.io/email/` (list below) |
| `strip-source/koeos-strips.html` | One editable source for the wordmark and strips A and B (open it in a browser to preview) |
| `previews/` | Screenshots: white and simulated dark mode, at 640px (desktop) and 375px, plus one with images blocked |
| `config/signatures.json` | Every configurable field |
| `scripts/` | Generators (see Rebuilding) |

People: `qazi-saad-khan`, `david-waroquier`, and `generic-template` (placeholders for every personal field).

## Configurable fields

All fields are set in `config/signatures.json`. After any change, run the rebuild commands below.

| Field | Where | Notes |
|---|---|---|
| Name | `people[].name` | |
| Title | `people[].title` | |
| Discipline line | `people[].discipline` | `null` uses `defaultDiscipline` (Product · Operating model · Commercialisation · Venture building). Separate items with ` · `. |
| Email | `people[].email` | Linked with `mailto:` |
| Phone | `people[].phone` | Optional. Linked with `tel:`. Set to `""` to remove the line. |
| LinkedIn | `people[].linkedin` | Shown as the text link "LinkedIn" |
| Strip on/off | `people[].strip` | Controls `<slug>.html`. The `-with-strip` file is always generated with the strip on. |
| Company details | `company.details` | Always shown in the footer |
| Location | `company.location` | Luxembourg |
| Website | `company.website`, `company.websiteLabel` | |
| Proposition | `company.proposition` | We make technology pay. |
| Privacy line on/off, label, URL | `company.privacy.enabled`, `.label`, `.url` | On by default |
| Disclaimer on/off and text | `company.disclaimer.enabled`, `.text` | Off by default. The text is to be supplied; none has been written. |
| Image hosting | `assets.baseUrl` | `https://koeos.io/email/` |

## Placeholders still to fill

The brief did not supply these values, so they are left as bracketed placeholders:

- `[TITLE]` for Qazi Saad Khan and David Waroquier
- `[EMAIL]` for Qazi Saad Khan and David Waroquier
- `[PHONE]` for Qazi Saad Khan and David Waroquier. This is optional: set it to `""` to drop the line.
- `[COMPANY NAME AND LEGAL FORM]`, `[REGISTERED OFFICE ADDRESS]`, `[RCS NUMBER]` (company details)
- `[DISCLAIMER TEXT, ONE OR TWO SENTENCES, TO BE SUPPLIED]`, only used if the disclaimer is switched on
- Generic template only: `[NAME]`, `[LINKEDIN URL]`

## Images to host

The website lives in a different repository (`mrkazisaad-code/koeos`). These files from `assets/` are hosted there and live at the URLs the signatures use (added in mrkazisaad-code/koeos#3, 22 Oct 2026). After re-rendering an asset, copy it to the same path and redeploy:

| File | Upload to (koeos repository) | Served at |
|---|---|---|
| `assets/koeos-wordmark@2x.png` | `public/email/koeos-wordmark@2x.png` | https://koeos.io/email/koeos-wordmark@2x.png |
| `assets/koeos-strip-signature@2x.png` | `public/email/koeos-strip-signature@2x.png` | https://koeos.io/email/koeos-strip-signature@2x.png |
| `assets/koeos-strip-banner@2x.png` | `public/email/koeos-strip-banner@2x.png` | https://koeos.io/email/koeos-strip-banner@2x.png |

Images are always referenced by absolute https URL. There are no base64 or CID images. If an image cannot load, the signature shows its alt text and remains complete.

| Asset | Display size | Export | File size | Alt text |
|---|---|---|---|---|
| Wordmark | 81 × 16 | 162 × 32, transparent | about 1 KB | KOEOS |
| A. Proposal and newsletter banner | 1200 × 220 | 2400 × 440 | about 21 KB | KOEOS. We make technology pay. |
| B. Signature strip | 480 × 64 | 960 × 128 | about 5 KB | We make technology pay. |

## Rebuilding

From the repository root, after `npm install`:

```sh
node email-signature-koeos/scripts/render-strips.mjs     # strip-source -> assets/*.png (2x)
node email-signature-koeos/scripts/build-signatures.mjs  # config -> signatures/*.html, *.txt
node email-signature-koeos/scripts/render-previews.mjs   # signatures -> previews/*.png
```

The renderers use the Chromium that Playwright provides. Set `CHROME_PATH` to use another Chrome or Chromium.

## Design and compatibility notes

- **Structure:** table-based with inline styles only. No CSS grid, flexbox, JavaScript, web fonts, external CSS, SVG, background images or hover effects. Text is set in Arial, Helvetica, sans-serif.
- **Layout:** identity on the left, contact details on the right, separated by a 1px teal rule.
  - The two blocks are tables floated with `align="left"` (276px + 224px, within 520px). They sit side by side in Outlook for Windows and other desktop clients. On narrow screens the contact block wraps below, and the same rule becomes its left edge.
  - The signature never scrolls sideways at 375px.
- **Copper:** used once, as a 2 × 16px rule before the proposition.
- **Contrast on white:**
  - Primary text `#3D4A47`: 9.3:1. Secondary text `#566663`: 6.0:1.
  - Link text uses `#298079`: 4.7:1. This is the nearest shade of the brand teal `#2E8F87` that passes 4.5:1, since `#2E8F87` itself measures 3.9:1. The dividers keep `#2E8F87`.
- **Dark mode:** the signature sits on white, never in a dark box. In clients that invert colours (Gmail apps, Outlook dark mode), text and dividers invert and stay readable (see `previews/*-dark-*`). The wordmark is a transparent PNG in a mid-tone teal that holds on both white and dark backgrounds.
  - Real-client rendering (Outlook for Windows, Gmail, Apple Mail) could not be tested from the build environment. Test with a real send before rolling out.
- **Images blocked:** every name, title, contact detail and the proposition are real text (see `previews/qazi-saad-khan-images-blocked.png`).
- **Retired copy:** "Turn technology into value" and "Build · Operate · Commercialise · Scale" appear nowhere.
- **Strip variants:** the brief mentions a variant C but does not define it, so only A and B are produced.
