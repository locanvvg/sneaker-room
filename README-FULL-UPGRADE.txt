LỘC AN SNEAKER COLLECTION — FULL 6/6 UPGRADE PACKAGE
Date: 2026-09-29

PRESERVATION GUARANTEE
- No sneaker metadata is changed.
- No sneaker story is changed.
- No Grid or 3D shoe sizing/scaling is changed.
- Existing Yuto Matcha / Quai 54 galleries and adiFOM sizing remain preserved.
- This package also includes the two latest fixes:
  1) VI footer says "THỐNG KÊ BỘ SƯU TẬP" and follows VI/EN switching.
  2) Size filter removes sizes that do not exist in IN COLLECTION.

THE SIX UPGRADES
1. Catalog validator
   .github/workflows/catalog-quality.yml
   tools/validate-catalog.mjs

2. Image optimization
   Runtime lazy/priority improvements: site-enhancements.js
   Manual lossless WebP builder:
   .github/workflows/image-optimization.yml
   tools/optimize-images.mjs
   The workflow NEVER overwrites original sneaker images.

3. SEO / share metadata
   site-enhancements.js
   robots.txt
   sitemap.xml

4. Collection Statistics
   stats.html
   collection-stats.js
   collection-stats.css

5. PWA / offline
   sw.js
   offline.html

6. Accessibility / keyboard polish
   site-enhancements.js

FILES TO REPLACE IN REPOSITORY ROOT
- catalog-additions.js
- site-enhancements.js
- sw.js

FILES TO ADD/OVERWRITE IN REPOSITORY ROOT
- stats.html
- collection-stats.js
- collection-stats.css
- offline.html
- robots.txt
- sitemap.xml

DIRECTORIES THAT MUST BE UPLOADED WITH EXACT PATHS
- tools/validate-catalog.mjs
- tools/optimize-images.mjs
- .github/workflows/catalog-quality.yml
- .github/workflows/image-optimization.yml

IMPORTANT
The previous upload missed tools/ and .github/workflows/. Those paths are required for the
Catalog quality check and image optimization workflow to exist in GitHub Actions.

AFTER UPLOAD
1. Wait for GitHub Pages to finish deployment.
2. Hard refresh once (Ctrl+F5 / Cmd+Shift+R).
3. Verify homepage footer language and size filters.
4. Open stats.html?lang=vi.
5. Open GitHub > Actions. You should see:
   - Catalog quality check
   - Build optimized image archive

The image optimization workflow is manual by design. Running it creates an artifact containing
optimized WebP copies. It does not modify or replace the original sneaker PNG/JPG files.
