# NetBird for Synology

Unofficial community package based on TechHutTV/netbird-dsm commit 5efc24c. Official NetBird core: 0.81.2. Package version: 0.81.2-2. Independent of Synology and NetBird.

## Installation and updates

DSM 7.0 or later is required. Choose amd64 for supported Intel/AMD NAS models or arm64 for supported 64-bit ARM models. Check your NAS architecture first. Download the SPK and use Manual Install in DSM Package Center. Add the matching package-source URL under Settings → Package Sources for online updates.

## Connection and features

Open NetBird from DSM and enroll using your management-server URL and a Setup Key. Six languages, system/light/dark appearance and P2P/relay connection details are available. The open page checks for updates every 24 hours and remembers results; closing it stops checks. New versions are announced without automatic installation. DSM handles installation; in-app one-click installation is not included.

## Troubleshooting and limitations

Connection actions require HTTPS and a DSM administrator account. If NAS access fails, check service listen addresses, NetBird access policies and peer details. Keep an independent LAN connection during upgrades because VPN briefly disconnects. Installation, upgrade and reboot require real NAS validation. Translations still need native-speaker review.
