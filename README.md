# NetBird for Synology

English · [简体中文](docs/README.zh-CN.md) · [繁體中文](docs/README.zh-TW.md) · [Deutsch](docs/README.de.md) · [Français](docs/README.fr.md) · [日本語](docs/README.ja.md)

Community maintenance of [TechHutTV/netbird-dsm](https://github.com/TechHutTV/netbird-dsm), based on upstream commit `5efc24c`. This project is independent of Synology and NetBird. Original networking, DSM authentication and enrollment behavior are retained. Packaging base: `TechHutTV/netbird-dsm@5efc24c`; core: `netbirdio/netbird@v0.81.2`; community package: `0.81.2-2`.

## Version 0.81.2-2

- Official NetBird core **0.81.2**, verified against the official stable release on 2026-10-19.
- English, 简体中文, 繁體中文, Deutsch, Français, 日本語. Semantic translation keys, whole sentences, local number/time formatting; names, addresses and raw logs remain intact.
- System/light/dark appearance, orange accent, browser-local preferences and responsive layout.
- In-app public release checks with numeric SPK revisions and architecture matching. Installation remains under DSM Package Center; offline SPKs remain available.
- Optional hourly upstream detection, regression/build checks and update proposals; no unattended NAS installation.

Translations are localization drafts and need native-speaker review. Test results and NAS acceptance are separate: see [validation](docs/validation-v1.md). Original upstream instructions and historical hardware results are preserved in [upstream documentation](docs/UPSTREAM-README.md); they are not acceptance results for this fork.

## Build

```sh
make test
make download package SYNOLOGY_ARCH=x86_64 UPDATE_REPOSITORY=WEEWXX/netbird-synology
make download package SYNOLOGY_ARCH=aarch64 UPDATE_REPOSITORY=WEEWXX/netbird-synology
```

`VERSION` pins the official core; `REVISION` is our positive integer package revision. The package version is `0.81.2-2`, Git tag `v0.81.2-2`, title `v0.81.2-2_synology`, and asset `netbird_0.81.2-2_synology_amd64.spk` or `..._arm64.spk`. Same-core changes increment REVISION; a newer upstream resets it to 1. The official download is checked against its published SHA-256 file before extraction.

`make package` requires GNU tar and Python 3. Tests additionally require Node.js and jq. The default update source is `WEEWXX/netbird-synology`. Fork maintainers must override `UPDATE_REPOSITORY` to their own published repository.

## Online updates and publishing

The existing release workflow builds both architectures and publishes per-architecture DSM package catalogs on GitHub Pages. Add the catalog matching the NAS architecture in DSM Package Center once; subsequent published packages can be discovered there. In-app checks read only the configured public repository's stable release metadata, validate version/architecture/download origin, and link to its release notes and SPK downloads. Automatic discovery runs at most once per 24 hours per browser/profile while the page is active; opening it after the interval triggers a check. The last attempt and validated release result are remembered, and manual checks bypass the interval. Closing the app does not leave a background NAS task running. Network errors do not mean “up to date.” The app does not overwrite its own executable or gain root installation privileges.

The community repository is [WEEWXX/netbird-synology](https://github.com/WEEWXX/netbird-synology). Package source URLs:

- x86_64: https://weewxx.github.io/netbird-synology/x86_64/index.json
- ARM64: https://weewxx.github.io/netbird-synology/aarch64/index.json

Configure Pages, then enable `ENABLE_UPSTREAM_SYNC=true` in repository variables. The hourly workflow detects an official stable release, runs tests, builds both architectures and proposes a version-update PR. Compatibility and NAS acceptance must be reviewed before publishing with Build SPK Release. GitHub Actions can require explicit workflow approval on forks. No remote workflow or publication is enabled by a local build.

Do not select TechHutTV's repository as this fork's update feed: that would offer upstream packaging without this fork's changes. Existing manual root/TUN installations require the upstream migration/ownership checks before adopting a package. Upgrade during independent LAN access: restarting the VPN may interrupt the connection used for administration.

## Contributing

Edit `spk/package/ui/locales/<locale>.json`, retain all placeholders and run `python3 scripts/build-presentation.py`. English is the fallback. Keep local terminology natural, preserve security warnings and check actual long-text layouts. Raw diagnostic logs remain in their original language for troubleshooting.

Upstream service code and NetBird licenses/attribution must be preserved. This checkout has no standalone upstream packaging LICENSE file; no blanket license over the upstream packaging is asserted here. Original attribution is retained. The official core license is included at `share/licenses/NETBIRD-LICENSE` inside each SPK.
