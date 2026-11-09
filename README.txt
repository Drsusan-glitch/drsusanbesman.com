DRSUSANBESMAN.COM - WEBSITE FOLDER

WHAT'S INSIDE
  index.html ............... Home
  about/ ................... About Dr. Besman
  rebuild-method/ .......... The REBUILD Method
  services/ ................ Services overview + 6 service pages
  book/ .................... Request a Consultation (links to Alma)
  blog/ .................... The Journal + 3 articles
  privacy/ ................. Website Privacy Policy
  sms-privacy-policy/ ...... SMS Privacy Policy (for your texting service)
  thank-you/ ............... Shown after a newsletter sign-up
  guide-thank-you/ ......... Shown after a guide sign-up (download button)
  404.html ................. "Page not found"
  assets/ .................. Photos, logo, garden video, chat assistant
  assets/rebuilding-after-divorce-guide.pdf ... The free guide
  assets/site.css + site.js  Shared polish: mobile menu, sticky header,
                             animations, accessibility (added Nov 2026)
  sitemap.xml, robots.txt .. For Google
  netlify.toml ............. Netlify settings (redirects, caching)

UPDATE THE SITE ON NETLIFY
  1. app.netlify.com -> your site -> Deploys tab.
  2. Drag this whole "website" folder onto the box at the bottom.
  3. Wait for "Published".

TURN ON THE SIGN-UP FORMS (one time)
  1. Netlify -> your site -> Site configuration -> Forms -> Enable form detection.
  2. Upload the folder again so Netlify finds the forms ("guide" and "newsletter").
  3. Forms -> Form notifications -> Add notification -> Email notification
     -> drsusan@drsusanbesman.com.
  Sign-ups appear under Forms (free: 100 per month). Export to Mailchimp anytime as CSV.

AFTER CONNECTING DRSUSANBESMAN.COM
  - Google Search Console: add the site, submit https://drsusanbesman.com/sitemap.xml
  - Texting service policy link: https://drsusanbesman.com/sms-privacy-policy/

SHARED POLISH FILES (assets/site.css, assets/site.js)
  Any page that has these two lines in its <head>, right after </style>,
  gets the mobile menu, sticky header, phone link, animations and
  accessibility upgrades:
    <link rel="stylesheet" href="/assets/site.css">
    <script src="/assets/site.js" defer></script>
  Already added to: index.html, 404.html.
  To remove the upgrades from a page, delete those two lines.

MAILCHIMP (guide sign-ups)
  assets/signup.js sends each guide sign-up to Mailchimp (audience
  "Dr. Susan Besman") AND to Netlify Forms as a backup, then shows the
  download page. The welcome emails are a Mailchimp Customer Journey that
  starts when someone signs up. The newsletter form still goes to Netlify
  only (export the CSV from Netlify Forms when you're ready to email them).
