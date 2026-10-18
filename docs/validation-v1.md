# DSM client 0.81.2-1 validation

Date: 2026-10-19 (Asia/Taipei). Upstream packaging base: 5efc24c. Official core: 0.81.2; community revision: 1.

## Checks performed

- Linux isolated build container on ubuntu-worker: 132 Python tests pass. Coverage includes DSM authentication/administrator denial, CSRF/HTTPS controls, enrollment validation, bounded diagnostics, service ownership and shutdown, core-download checksum and stable upstream detection. No DSM/NAS production configuration was modified.
- Node: 8 tests pass for six-locale key/placeholder parity, locale fallback, whole dynamic sentences, French plural forms, theme selection, local-vs-upload diagnostic wording, numeric package revisions and stable architecture-specific update offers. JavaScript syntax checks pass.
- Browser preview uses synthetic NAS-A / PC-B data. All six languages were switched; IP/name preservation, theme persistence after reload, light/dark appearance and desktop horizontal overflow were checked. Chinese light screenshot is in the workspace preview directory. HTTP preview intentionally disables VPN actions.
- Both amd64 and arm64 SPKs are built from official binaries verified against upstream SHA-256. Package inspection checks version/architecture, six catalogs, presentation/update assets and absence of macOS AppleDouble metadata.

## Scope and remaining acceptance

These are build and browser-preview results, not NAS installation results. A DSM 7 test NAS must still verify initial install, upgrade from the prior community package, Package Center catalog discovery, connection/disconnection, reboot recovery, retained registration, P2P/relay and Synology Drive access. Mobile layout and native-speaker review remain pending. A passing package build does not prove every NAS model listed by upstream architecture tokens is compatible.

The app performs online release discovery; DSM Package Center owns installation. Local candidate SPKs intentionally have no invented GitHub update feed. Publishing the actual repository/Pages catalog and injecting UPDATE_REPOSITORY activates that path. Remote GitHub workflows have not been enabled or exercised by this local development run.

Upstream packaging has no standalone LICENSE in the checked-out source. Clarify derivative redistribution rights before public release; NetBird core licensing and attribution remain upstream's.
