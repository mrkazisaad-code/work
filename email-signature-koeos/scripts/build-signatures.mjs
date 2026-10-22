// Builds every signature from config/signatures.json.
// Usage (from the repository root): node email-signature-koeos/scripts/build-signatures.mjs
// Writes, per person, to signatures/:
//   <slug>.html             copy-paste signature (strip as set in config, off by default)
//   <slug>-with-strip.html  the same signature with the signature strip switched on
//   <slug>.txt              plain-text fallback
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const config = JSON.parse(readFileSync(new URL('config/signatures.json', root), 'utf8'));
const wordmarkSize = JSON.parse(readFileSync(new URL('assets/wordmark-size.json', root), 'utf8'));
const outDir = fileURLToPath(new URL('signatures/', root));
mkdirSync(outDir, { recursive: true });

// Colours (all text passes 4.5:1 on white). Link text uses #298079, the nearest shade of the
// brand teal #2E8F87 that passes 4.5:1 (#2E8F87 itself measures 3.89:1); dividers use #2E8F87.
const C = { primary: '#3D4A47', secondary: '#566663', link: '#298079', divider: '#2E8F87', copper: '#D9894A' };
const FONT = 'Arial, Helvetica, sans-serif';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Middle dots as entities; keep each item together so lines only break after a separator
const dots = (s) =>
  esc(s)
    .split(' · ')
    .map((part) => part.replace(/ /g, '&nbsp;'))
    .join('&nbsp;&middot; ');
const telHref = (p) => (/^\[.*\]$/.test(p) ? p : p.replace(/[^\d+]/g, ''));
const linkStyle = `color:${C.link};text-decoration:none;`;
const asset = (file) => config.assets.baseUrl + file;

function contactRows(p) {
  const rows = [
    `<span style="color:${C.secondary};">${esc(config.company.location)}</span>`,
    `<a href="mailto:${esc(p.email)}" style="${linkStyle}">${esc(p.email)}</a>`,
    `<a href="${esc(config.company.website)}" style="${linkStyle}">${esc(config.company.websiteLabel)}</a>`,
    `<a href="${esc(p.linkedin)}" style="${linkStyle}">LinkedIn</a>`,
  ];
  if (p.phone) rows.push(`<a href="tel:${esc(telHref(p.phone))}" style="${linkStyle}">${esc(p.phone)}</a>`);
  return rows
    .map((r) => `<tr><td style="font-family:${FONT};font-size:12px;line-height:18px;mso-line-height-rule:exactly;color:${C.secondary};">${r}</td></tr>`)
    .join('\n                ');
}

function signatureHtml(p, withStrip) {
  const discipline = p.discipline || config.defaultDiscipline;
  const co = config.company;
  const strip = withStrip
    ? `
  <tr>
    <td style="padding:14px 0 0 0;">
      <a href="${esc(co.website)}" style="text-decoration:none;"><img src="${asset(config.assets.strip)}" width="480" alt="We make technology pay." style="display:block;width:480px;max-width:100%;height:auto;border:0;outline:none;font-family:${FONT};font-size:12px;color:${C.primary};"></a>
    </td>
  </tr>`
    : '';
  const privacy = co.privacy.enabled
    ? `<br>${esc(co.privacy.label)} <a href="${esc(co.privacy.url)}" style="${linkStyle}">${esc(co.privacy.url.replace(/^https?:\/\//, ''))}</a>`
    : '';
  const disclaimer = co.disclaimer.enabled ? `<br>${esc(co.disclaimer.text)}` : '';

  return `<!-- KOEOS SIGNATURE START -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="520" style="width:520px;max-width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
  <tr>
    <td style="padding:0;">
      <!-- Identity (left) and contact details (right). On narrow screens the right block wraps below. -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="276" align="left" style="width:276px;max-width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:0 16px 12px 0;">
            <img src="${asset(config.assets.wordmark)}" width="${wordmarkSize.width}" height="${wordmarkSize.height}" alt="KOEOS" style="display:block;width:${wordmarkSize.width}px;height:${wordmarkSize.height}px;border:0;outline:none;font-family:${FONT};font-size:13px;font-weight:bold;letter-spacing:1px;color:${C.primary};">
          </td>
        </tr>
        <tr>
          <td style="padding:0 16px 0 0;font-family:${FONT};font-size:16px;line-height:20px;mso-line-height-rule:exactly;font-weight:bold;color:${C.primary};">${esc(p.name)}</td>
        </tr>
        <tr>
          <td style="padding:2px 16px 0 0;font-family:${FONT};font-size:13px;line-height:18px;mso-line-height-rule:exactly;color:${C.secondary};">${esc(p.title)}</td>
        </tr>
        <tr>
          <td style="padding:6px 16px 12px 0;font-family:${FONT};font-size:11px;line-height:16px;mso-line-height-rule:exactly;letter-spacing:0.5px;color:${C.secondary};">${dots(discipline)}</td>
        </tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="224" align="left" style="width:224px;max-width:100%;border-collapse:collapse;">
        <tr>
          <td style="border-left:1px solid ${C.divider};padding:0 0 0 16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                ${contactRows(p)}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:14px 0 0 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td width="2" height="16" bgcolor="${C.copper}" style="width:2px;height:16px;background-color:${C.copper};font-size:1px;line-height:16px;mso-line-height-rule:exactly;">&nbsp;</td>
          <td style="padding:0 0 0 8px;font-family:${FONT};font-size:13px;line-height:16px;mso-line-height-rule:exactly;font-weight:bold;color:${C.primary};">${esc(co.proposition)}</td>
        </tr>
      </table>
    </td>
  </tr>${strip}
  <tr>
    <td style="padding:14px 0 0 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="border-top:1px solid ${C.divider};padding:8px 0 0 0;font-family:${FONT};font-size:10px;line-height:14px;mso-line-height-rule:exactly;color:${C.secondary};">${dots(co.details)}${privacy}${disclaimer}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<!-- KOEOS SIGNATURE END -->`;
}

function page(p, withStrip) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>KOEOS signature: ${esc(p.name)}${withStrip ? ' (with strip)' : ''}</title>
</head>
<body style="margin:0;padding:24px 16px;background-color:#ffffff;">
${signatureHtml(p, withStrip)}
</body>
</html>
`;
}

function plainText(p) {
  const co = config.company;
  const lines = [
    p.name,
    p.title,
    p.discipline || config.defaultDiscipline,
    '',
    'KOEOS',
    co.location,
    p.email,
    co.website,
    `LinkedIn: ${p.linkedin}`,
  ];
  if (p.phone) lines.push(p.phone);
  lines.push('', co.proposition, '', '--', co.details);
  if (co.privacy.enabled) lines.push(`${co.privacy.label} ${co.privacy.url}`);
  if (co.disclaimer.enabled) lines.push(co.disclaimer.text);
  return lines.join('\n') + '\n';
}

for (const p of config.people) {
  writeFileSync(outDir + `${p.slug}.html`, page(p, p.strip));
  writeFileSync(outDir + `${p.slug}-with-strip.html`, page(p, true));
  writeFileSync(outDir + `${p.slug}.txt`, plainText(p));
  console.log(`signatures/${p.slug}.html, -with-strip.html, .txt`);
}
