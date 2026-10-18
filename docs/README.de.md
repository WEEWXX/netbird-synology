# NetBird für Synology

[Dokumentationswebsite](https://weewxx.github.io/netbird-synology/de/)

[English](../README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · Deutsch · [Français](README.fr.md) · [日本語](README.ja.md)

Inoffizielles, von der Community gepflegtes Paket auf Basis von TechHutTV/netbird-dsm, Commit 5efc24c. NetBird-Version: 0.81.2; Paketversion: 0.81.2-2. Das Projekt ist unabhängig von Synology und NetBird.

## Installation und Updates

DSM 7.0 oder neuer erforderlich. Wählen Sie amd64 für Intel-/AMD-Geräte oder arm64 für unterstützte 64-Bit-ARM-Geräte. Prüfen Sie zuvor die NAS-Architektur. Installieren Sie die SPK-Datei über „Manuelle Installation“ im Paket-Zentrum. Für Online-Updates fügen Sie die passende URL unter „Einstellungen → Paketquellen“ hinzu.

[GitHub Releases / SPK](https://github.com/WEEWXX/netbird-synology/releases/latest)

- x86_64: https://weewxx.github.io/netbird-synology/x86_64/index.json
- ARM64: https://weewxx.github.io/netbird-synology/aarch64/index.json

## Verbindung und Funktionen

Öffnen Sie NetBird in DSM und registrieren Sie das Gerät mit der URL Ihres Verwaltungsservers und einem Setup Key. Die Oberfläche bietet sechs Sprachen, ein helles/dunkles Design mit Systemeinstellung und Details zu P2P- und Relay-Verbindungen. Bei geöffneter Seite wird alle 24 Stunden nach Updates gesucht. Nach dem Schließen läuft keine Hintergrundprüfung. Neue Versionen werden nur gemeldet; die Installation erfolgt über DSM. Eine Ein-Klick-Installation in der App ist noch nicht verfügbar.

## Fehlerbehebung und Hinweise

Verbindungsaktionen erfordern HTTPS und ein DSM-Administratorkonto. Prüfen Sie bei Zugriffsproblemen die Listen-Adressen der NAS-Dienste, die NetBird-Zugriffsrichtlinien und die Verbindungsdetails. Halten Sie während eines Updates einen unabhängigen LAN-Zugang bereit; die VPN-Verbindung wird kurz unterbrochen. Installation, Upgrade und Neustart müssen noch auf echter NAS-Hardware geprüft werden. Muttersprachliches Lektorat der Übersetzungen steht aus.

[Issues](https://github.com/WEEWXX/netbird-synology/issues) · [Upstream](UPSTREAM-README.md) · [Validation / English](validation-v1.md)
