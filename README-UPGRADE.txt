LỘC AN SNEAKER COLLECTION — SITE UPGRADE PACKAGE
Date: 2026-09-29

IMPORTANT PRESERVATION GUARANTEE
- Existing catalog-additions.js from the live repository was preserved byte-for-byte.
- The only change to catalog-additions.js is an appended loader at the very end.
- No sneaker metadata was edited.
- No sneaker story was edited.
- No sneaker image sizing / Grid scale / 3D scale was edited.
- Existing Yuto Matcha, Quai 54 F&F, adiFOM and all prior display tuning remain untouched.

FILES TO UPLOAD TO THE REPOSITORY ROOT
- catalog-additions.js  (replace existing file)
- site-enhancements.js
- sw.js
- offline.html
- stats.html
- collection-stats.js
- collection-stats.css
- robots.txt
- sitemap.xml

FILES TO UPLOAD WITH THEIR FOLDERS
- tools/validate-catalog.mjs
- tools/optimize-images.mjs
- .github/workflows/catalog-quality.yml
- .github/workflows/image-optimization.yml

WHAT THE UPGRADE ADDS
1. Automatic catalog validation on GitHub Actions.
2. Image delivery improvements: lazy loading, async decoding, fetch priority.
3. A manual lossless WebP optimization workflow that never overwrites originals.
4. Dynamic per-sneaker SEO/share metadata and JSON-LD.
5. robots.txt and sitemap.xml.
6. Collection Statistics page, calculated directly from the live catalog.
7. PWA/offline cache with conservative network-first behavior for code/content.
8. Accessibility: focus-visible, aria state syncing, aria-live counts,
   and reduced-motion support.
9. A subtle Collection Statistics link is added to the footer.

AFTER UPLOAD
- Wait for GitHub Pages to deploy.
- Hard refresh once: Ctrl+F5 on Windows or Cmd+Shift+R on Mac.
- Open /stats.html?lang=vi to verify the statistics page.
- In GitHub Actions, Catalog quality check will run automatically.
- Image optimization is manual under Actions > Build optimized image archive.
  It creates an artifact with optimized copies and does NOT modify original images.
