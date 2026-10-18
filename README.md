# NetBird DSM Client

Community maintenance of [TechHutTV/netbird-dsm](https://github.com/TechHutTV/netbird-dsm), based on upstream commit `5efc24c`. This project is independent of Synology and NetBird. Original networking, DSM authentication and enrollment behavior are retained.

## Version 0.81.2-1

- Official NetBird core **0.81.2**, verified against the official stable release on 2026-10-19.
- English, 简体中文, 繁體中文, Deutsch, Français, 日本語. Semantic translation keys, whole sentences, local number/time formatting; names, addresses and raw logs remain intact.
- System/light/dark appearance, orange accent, browser-local preferences and responsive layout.
- In-app public release checks with numeric SPK revisions and architecture matching. Installation remains under DSM Package Center; offline SPKs remain available.
- Optional hourly upstream detection, regression/build checks and update proposals; no unattended NAS installation.

Translations are localization drafts and need native-speaker review. Test results and NAS acceptance are separate: see [validation](docs/validation-v1.md). Original upstream instructions and historical hardware results are preserved in [upstream documentation](docs/UPSTREAM-README.md); they are not acceptance results for this fork.

## Build

```sh
make test
make download package SYNOLOGY_ARCH=x86_64 UPDATE_REPOSITORY=OWNER/REPOSITORY
make download package SYNOLOGY_ARCH=aarch64 UPDATE_REPOSITORY=OWNER/REPOSITORY
```

`VERSION` pins the official core; `REVISION` is our positive integer package revision. The package version is `0.81.2-1`, Git tag `v0.81.2-1`, title `v0.81.2-1_synology`, and asset `netbird_0.81.2-1_synology_amd64.spk` or `..._arm64.spk`. Same-core changes increment REVISION; a newer upstream resets it to 1. The official download is checked against its published SHA-256 file before extraction.

`make package` requires GNU tar and Python 3. Tests additionally require Node.js and jq. Source defaults do not invent an update repository; local builds show “update source not configured” unless `UPDATE_REPOSITORY` is supplied.

## Online updates and publishing

The existing release workflow builds both architectures and publishes per-architecture DSM package catalogs on GitHub Pages. Add the catalog matching the NAS architecture in DSM Package Center once; subsequent published packages can be discovered there. In-app checks read only the configured public repository's stable release metadata, validate version/architecture/download origin, and link to its release notes and SPK downloads. Automatic discovery runs at most once per 24 hours per browser/profile while the page is active; opening it after the interval triggers a check. The last attempt and validated release result are remembered, and manual checks bypass the interval. Closing the app does not leave a background NAS task running. Network errors do not mean “up to date.” The app does not overwrite its own executable or gain root installation privileges.

Configure the actual community repository and Pages, then enable `ENABLE_UPSTREAM_SYNC=true` in repository variables. The hourly workflow detects an official stable release, runs tests, builds both architectures and proposes a version-update PR. Compatibility and NAS acceptance must be reviewed before publishing with Build SPK Release. GitHub Actions can require explicit workflow approval on forks. No remote workflow or publication is enabled by a local build.

Do not select TechHutTV's repository as this fork's update feed: that would offer upstream packaging without this fork's changes. Existing manual root/TUN installations require the upstream migration/ownership checks before adopting a package. Upgrade during independent LAN access: restarting the VPN may interrupt the connection used for administration.

## Contributing

Edit `spk/package/ui/locales/<locale>.json`, retain all placeholders and run `python3 scripts/build-presentation.py`. English is the fallback. Keep local terminology natural, preserve security warnings and check actual long-text layouts. Raw diagnostic logs remain in their original language for troubleshooting.

Upstream service code and NetBird licenses/attribution must be preserved. This checkout has no standalone upstream packaging LICENSE file; its licensing terms must be clarified before public redistribution of derivative SPKs. No new license is asserted over upstream work.
