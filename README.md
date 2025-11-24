# PCBS Da Wish — Brawl Stars Predictions style site

This package contains a static multi-page site inspired by Brawl Stars event pages.
Customization:
- Site title: PCBS Da Wish
- Currency: points
- Login: username-only (simple client-side)

Files:
- index.html, predictions.html, leaderboard.html, rewards.html, teams.html, profile.html, rules.html, admin.html
- styles.css (Brawl-inspired)
- app.js (core logic, localStorage key: pcbs_wish_v1)
- admin.js (admin panel logic)
- auth.js (simple username login)
- favicon.svg
- .github/workflows/pages.yml (GitHub Pages automatic deploy)

How to publish:
1. Create a public repository (e.g., `campeonato`) on GitHub.
2. Upload all files in this package to the repository root.
3. Commit and push.
4. The included GitHub Actions workflow will deploy to GitHub Pages automatically.
5. Your site URL will be: https://YOUR-USERNAME.github.io/REPO-NAME/

To reset data: open DevTools -> Application -> Local Storage -> remove key `pcbs_wish_v1`.
