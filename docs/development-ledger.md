# DSM global client v1 execution

Scope approved in chat: official stable core + numeric SPK revision, en/zh-CN/zh-TW/de/fr/ja, local conventions, system/light/dark with orange accent, online update discovery with DSM-owned installation. User requested implementation; no additional feature/design approval is pending.

Repository: /Users/weewxx/Library/CloudStorage/SynologyDrive-MACAI/Netbird/repositories/netbird-dsm; branch feat/global-client-v1; upstream base 5efc24c. Codebase project explicitly matched this path and indexed full/nonpersistent.

- Baseline Mac: upstream Linux-dependent service tests cannot run correctly (/proc, platform-specific file/process behavior). Do not alter service logic for Mac compatibility.
- Presentation: missing-module tests RED, six locale catalog parity/placeholder/fallback/whole-sentence/theme tests GREEN. English fallback and raw device names/logs preserved. Locale drafts require native-speaker review; no claim of professional human review.
- Updates: missing-module tests RED, numeric comparisons and stable arch-specific asset validation GREEN. No update source is invented: UPDATE_REPOSITORY is injected by actual publication builds, local build defaults unconfigured.
- Upstream sync: RED then GREEN for stable-only/no downgrade/no injected version. Hourly opt-in GitHub workflow detects upstream, tests/builds both architectures, proposes a PR. Stable publication remains controlled.
- Core: official latest verified 2026-10-19 as v0.81.2; VERSION=0.81.2, REVISION=1. Official archive checksum verification added RED→GREEN.
- First Linux run: all service checks passed; failures were old HTML string assertions not allowing presentation attributes, plus macOS tar-generated AppleDouble files. Assertion expectations updated to tolerate attributes while retaining exact value/row semantics. Source archive must use plain Python tarfile rather than macOS metadata.

Remaining: finish fixed error/status copy coverage, browser language/theme/state verification, clean Linux suite, dual-architecture SPK build and inspection, source review, documentation. NAS installation/reboot/upgrade and live VPN/Drive acceptance remain separate; do not deploy to NAS without an explicit deployment request.

2026-10-19 final review: six locale drafts and accessible labels, dynamic summaries, diagnostic destination wording, light/dark styling and browser-local persistence implemented. Linux 132 + Node 8 passed; official 0.81.2 dual-architecture packaging succeeded. Public update feed intentionally unset until a real community repository is published. NAS installation and native-speaker review remain unclaimed. Validation scope recorded in validation-v1.md.

2026-10-19 UI feedback: brand and language/appearance controls share a centered topbar; six-language desktop geometry checked with no overflow. Update discovery now displays bounded plaintext release notes, localized publication date, package size and exact architecture-specific SPK link. The update fixture is explicitly synthetic and is outside the package. Node suite: 9 passed; Linux status/authentication regression passed. This source/preview refinement has not replaced the previously delivered SPKs. In-app installation is not implemented; DSM Package Center already supports online package-source updates.

2026-10-19 cadence: user selected 24-hour automatic discovery. Added browser-local last-attempt/result persistence, first-open/elapsed-day checks, timer and visibility resume, manual bypass. No background NAS daemon or automatic installation. 11 Node tests pass, including fake-clock reload/day/manual integration coverage. The synthetic update preview detects its fixture without clicking. Source/preview only; SPKs remain the previous candidates.
