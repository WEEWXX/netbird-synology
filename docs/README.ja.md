# Synology 向け NetBird

[オンラインドキュメント](https://weewxx.github.io/netbird-synology/ja/)

[English](../README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · 日本語

TechHutTV/netbird-dsm のコミット 5efc24c を基に、コミュニティが保守する非公式パッケージです。NetBird 本体は 0.81.2、パッケージは 0.81.2-2 です。Synology および NetBird の公式プロジェクトではありません。

## インストールと更新

DSM 7.0 以降が必要です。NAS の CPU アーキテクチャを確認し、Intel／AMD 機種には amd64、対応する 64 ビット ARM 機種には arm64 を選んでください。SPK をダウンロードし、パッケージセンターの「手動インストール」から導入します。オンライン更新を利用する場合は、「設定 → パッケージソース」に対応する URL を追加してください。

[GitHub Releases / SPK](https://github.com/WEEWXX/netbird-synology/releases/latest)

- x86_64: https://weewxx.github.io/netbird-synology/x86_64/index.json
- ARM64: https://weewxx.github.io/netbird-synology/aarch64/index.json

## 接続と機能

DSM から NetBird を開き、自分で運用する管理サーバーの URL とセットアップキーで NAS を登録します。6 言語、システム設定に連動するライト／ダーク表示、P2P・リレー接続の詳細表示に対応しています。ページを開いている間は 24 時間ごとに更新を確認します。ページを閉じるとバックグラウンドでの確認は行いません。新しいバージョンは通知のみで、自動インストールはしません。インストールは DSM が行い、アプリ内のワンクリックインストールは未対応です。

## トラブルシューティングと注意事項

接続操作には HTTPS と DSM の管理者アカウントが必要です。NAS にアクセスできない場合は、サービスの待ち受けアドレス、NetBird のアクセスルール、接続の詳細を確認してください。更新中は VPN が一時的に切断されるため、VPN に依存しない LAN 接続を確保してください。インストール、アップグレード、再起動は実機での検証が必要です。翻訳はネイティブスピーカーによる確認がまだ完了していません。

[Issues](https://github.com/WEEWXX/netbird-synology/issues) · [Upstream](UPSTREAM-README.md) · [Validation / English](validation-v1.md)
