# NetBird pour Synology

[Documentation en ligne](https://weewxx.github.io/netbird-synology/fr/)

[English](../README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [Deutsch](README.de.md) · Français · [日本語](README.ja.md)

Paquet non officiel maintenu par la communauté, basé sur TechHutTV/netbird-dsm, commit 5efc24c. Version du client NetBird : 0.81.2 ; version du paquet : 0.81.2-2. Ce projet est indépendant de Synology et de NetBird.

## Installation et mises à jour

DSM 7.0 ou version ultérieure est requis. Choisissez amd64 pour les modèles Intel/AMD ou arm64 pour les modèles ARM 64 bits pris en charge, après vérification de l’architecture du NAS. Installez le fichier SPK via « Installation manuelle » dans le Centre de paquets. Pour les mises à jour en ligne, ajoutez l’URL adaptée dans « Paramètres → Sources de paquets ».

[GitHub Releases / SPK](https://github.com/WEEWXX/netbird-synology/releases/latest)

- x86_64: https://weewxx.github.io/netbird-synology/x86_64/index.json
- ARM64: https://weewxx.github.io/netbird-synology/aarch64/index.json

## Connexion et fonctionnalités

Ouvrez NetBird depuis DSM, puis enregistrez le NAS avec l’URL de votre serveur de gestion et une clé de configuration (Setup Key). Six langues, les thèmes clair/sombre ou système et les détails des connexions P2P/relais sont disponibles. La recherche de mises à jour a lieu toutes les 24 heures lorsque la page est ouverte. Aucune vérification ne continue après sa fermeture. Une nouvelle version est signalée sans être installée automatiquement. DSM assure l’installation ; l’installation en un clic dans l’application n’est pas encore disponible.

## Dépannage et précautions

Les commandes de connexion nécessitent HTTPS et un compte administrateur DSM. En cas d’échec d’accès au NAS, vérifiez les adresses d’écoute des services, les règles d’accès NetBird et les détails de connexion. Conservez un accès LAN indépendant pendant la mise à jour : le VPN sera brièvement interrompu. L’installation, la mise à niveau et le redémarrage restent à valider sur un NAS réel. Les traductions doivent encore être relues par des locuteurs natifs.

[Issues](https://github.com/WEEWXX/netbird-synology/issues) · [Upstream](UPSTREAM-README.md) · [Validation / English](validation-v1.md)
