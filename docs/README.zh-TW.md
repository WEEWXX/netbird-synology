# Synology NetBird 用戶端

[線上文件](https://weewxx.github.io/netbird-synology/zh-TW/)

[English](../README.md) · [简体中文](README.zh-CN.md) · 繁體中文 · [Deutsch](README.de.md) · [Français](README.fr.md) · [日本語](README.ja.md)

由社群維護的非官方套件，基於 TechHutTV/netbird-dsm 提交 5efc24c。NetBird 核心版本為 0.81.2，套件版本為 0.81.2-2。本專案與 Synology、NetBird 均無隸屬關係。

## 安裝與更新

需要 DSM 7.0 以上版本。Intel／AMD 機型請選 amd64，64 位元 ARM 機型請選 arm64；請先確認 NAS 架構。下載 SPK 後，在套件中心選擇「手動安裝」。亦可於「設定 → 套件來源」加入對應網址，以取得線上更新。

[GitHub Releases / SPK](https://github.com/WEEWXX/netbird-synology/releases/latest)

- x86_64: https://weewxx.github.io/netbird-synology/x86_64/index.json
- ARM64: https://weewxx.github.io/netbird-synology/aarch64/index.json

## 連線與功能

從 DSM 開啟 NetBird，輸入自架管理伺服器網址與安裝金鑰完成註冊。提供六種語言、跟隨系統／淺色／深色外觀，以及 P2P／中繼連線詳細資訊。頁面開啟時每 24 小時檢查更新；關閉後不執行背景檢查。有新版時僅顯示通知，安裝由 DSM 執行，尚未提供應用程式內一鍵安裝。

## 疑難排解與注意事項

請使用管理員帳號，透過 HTTPS 開啟 DSM 後再操作連線。無法存取 NAS 時，請檢查服務監聽位址、NetBird 存取原則與連線詳細資訊。更新時 VPN 會短暫中斷，請保留獨立的區域網路連線。安裝、更新與重新啟動仍需實機驗證；翻譯尚待母語使用者審閱。

[Issues](https://github.com/WEEWXX/netbird-synology/issues) · [Upstream](UPSTREAM-README.md) · [Validation / English](validation-v1.md)
