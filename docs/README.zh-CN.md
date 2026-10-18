# 群晖 NetBird 客户端

[在线文档](https://weewxx.github.io/netbird-synology/zh-CN/)

[English](../README.md) · 简体中文 · [繁體中文](README.zh-TW.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [日本語](README.ja.md)

社区维护的非官方套件，基于 TechHutTV/netbird-dsm 提交 5efc24c。官方核心为 0.81.2，套件版本为 0.81.2-2。本项目独立于群晖和 NetBird。

## 安装与更新

需要 DSM 7.0 或更高版本。Intel／AMD 机型选择 amd64，64 位 ARM 机型选择 arm64；请先核对 NAS 架构。下载 SPK 后，在套件中心选择“手动安装”。也可在“设置 → 套件来源”添加对应地址，获得在线更新。

[GitHub Releases / SPK](https://github.com/WEEWXX/netbird-synology/releases/latest)

- x86_64: https://weewxx.github.io/netbird-synology/x86_64/index.json
- ARM64: https://weewxx.github.io/netbird-synology/aarch64/index.json

## 连接与功能

从 DSM 打开 NetBird，使用自建管理服务器地址和安装密钥注册。支持六种界面语言、跟随系统／浅色／深色主题，以及 P2P／中继连接详情。页面打开时每 24 小时检查更新，关闭页面后不运行后台检查；发现新版只提示。安装由 DSM 完成，暂不提供应用内一键安装。

## 故障排查与注意事项

连接操作需要通过 HTTPS 打开 DSM，并使用管理员账号。无法访问 NAS 时，检查服务监听地址、NetBird 访问策略和连接详情。升级前保留独立的局域网访问，VPN 会短暂中断。安装、升级和重启仍需实机验收；翻译尚需母语使用者复核。

[Issues](https://github.com/WEEWXX/netbird-synology/issues) · [Upstream](UPSTREAM-README.md) · [Validation / English](validation-v1.md)
