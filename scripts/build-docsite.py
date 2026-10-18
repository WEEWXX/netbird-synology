#!/usr/bin/env python3
"""Build six static documentation pages and the existing DSM catalog paths."""
import argparse,html,json,re,shutil,hashlib,tarfile
from pathlib import Path
LABELS={'en':'English','zh-CN':'简体中文','zh-TW':'繁體中文','de':'Deutsch','fr':'Français','ja':'日本語'}
COPY={
'en':['Overview','Install & update','Connect','Troubleshooting','Download SPK','Appearance','System','Light','Dark','Community-maintained · Unofficial','Package sources','Documentation'],
'zh-CN':['项目介绍','安装与更新','连接配置','故障排查','下载安装包','外观','跟随系统','浅色','深色','社区维护 · 非官方项目','套件来源','使用文档'],
'zh-TW':['專案介紹','安裝與更新','連線設定','疑難排解','下載安裝套件','外觀','跟隨系統','淺色','深色','社群維護 · 非官方專案','套件來源','使用文件'],
'de':['Überblick','Installation & Updates','Verbindung','Fehlerbehebung','SPK herunterladen','Darstellung','System','Hell','Dunkel','Community-gepflegt · Inoffiziell','Paketquellen','Dokumentation'],
'fr':['Présentation','Installation et mises à jour','Connexion','Dépannage','Télécharger le SPK','Apparence','Système','Clair','Sombre','Projet communautaire · Non officiel','Sources de paquets','Documentation'],
'ja':['概要','インストールと更新','接続設定','トラブルシューティング','SPK をダウンロード','表示','システム','ライト','ダーク','コミュニティによる保守 · 非公式','パッケージソース','ドキュメント']}
IDS=['overview','install','connect','help']
def esc(value):return html.escape(str(value),quote=True)
def paragraphs(text):
 return ''.join('<p>'+esc(p.strip())+'</p>' for p in text.split('\n\n') if p.strip() and not p.lstrip().startswith(('[','- x86','- ARM')))
def build(root,assets,out,repo,base):
 out.mkdir(parents=True,exist_ok=True)
 versions=set()
 for arch,family in [('amd64','x86_64'),('arm64','aarch64')]:
  files=list(assets.glob('netbird_*_synology_'+arch+'.spk'))
  if len(files)!=1:raise ValueError('Exactly one SPK per architecture required')
  file=files[0]
  with tarfile.open(file) as archive:info=archive.extractfile('INFO').read().decode()
  version=re.search(r'^version="([0-9]+\.[0-9]+\.[0-9]+-[0-9]+)"$',info,re.M).group(1)
  if file.name!=f'netbird_{version}_synology_{arch}.spk':raise ValueError('Package name/version mismatch')
  versions.add(version);raw=file.read_bytes();folder=out/family;folder.mkdir(exist_ok=True)
  package=dict(package='netbird',version=version,dname='NetBird',desc='Community-maintained NetBird client for Synology DSM.',maintainer='NetBird DSM Community',maintainer_url='https://github.com/'+repo,distributor='NetBird DSM Community',distributor_url='https://github.com/'+repo,thumbnail=[base+'/icon-256.png'],link=f'https://github.com/{repo}/releases/download/v{version}/{file.name}',md5=hashlib.md5(raw).hexdigest(),sha256=hashlib.sha256(raw).hexdigest(),size=len(raw),qinst=True,qstart=True,qupgrade=True,start=True,thirdparty=True,beta=False)
  (folder/'index.json').write_text(json.dumps({'packages':[package]},ensure_ascii=False)+'\n')
 if len(versions)!=1:raise ValueError('Architecture versions must match')
 version=versions.pop()
 for file in ['docs.css','docs.js']:shutil.copy2(root/'site'/file,out/file)
 shutil.copy2(root/'spk/PACKAGE_ICON_256.PNG',out/'icon-256.png')
 for lang,c in COPY.items():
  source=(root/'docs'/f'README.{lang}.md').read_text()
  blocks=re.split(r'^## .+$',source,flags=re.M)
  intro=re.sub(r'^# .+\n','',blocks[0],count=1).strip()
  sections=[intro,*blocks[1:]]
  if len(sections)!=4:raise ValueError('Four semantic sections required: '+lang)
  nav=''.join(f'<a href="#{key}">{esc(c[i])}</a>' for i,key in enumerate(IDS))
  options=''.join(f'<option value="{key}"'+(' selected' if key==lang else '')+'>'+label+'</option>' for key,label in LABELS.items())
  content=''
  for i,(key,body) in enumerate(zip(IDS,sections)):
   content+=f'<section id="{key}"><span class="number">0{i+1}</span><h2>{esc(c[i])}</h2>{paragraphs(body)}'
   if key=='install':
    content+=f'<a class="download" href="https://github.com/{repo}/releases/latest">{esc(c[4])} ↗</a><h3>{esc(c[10])}</h3>'
    for family in ['x86_64','aarch64']:content+=f'<label class="source">{family}<input readonly aria-label="{family}" value="{base}/{family}/index.json"></label>'
   content+='</section>'
  page=f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>NetBird for Synology · {esc(c[11])}</title><link rel="stylesheet" href="../docs.css"><script src="../docs.js" defer></script></head><body><header><a class="brand" href="#overview"><img src="../icon-256.png" alt="">NetBird <span>for Synology</span></a><div class="preferences"><label><span class="sr">Language</span><select id="language" aria-label="Language">{options}</select></label><label><span class="sr">{esc(c[5])}</span><select id="theme" aria-label="{esc(c[5])}"><option value="system">{esc(c[6])}</option><option value="light">{esc(c[7])}</option><option value="dark">{esc(c[8])}</option></select></label><a href="https://github.com/{repo}">GitHub ↗</a></div></header><div class="layout"><aside><p>{esc(c[11])}</p><nav>{nav}</nav><small>v{esc(version)}<br>DSM 7.0+</small></aside><main><div class="intro"><p class="eyebrow">{esc(c[9])}</p><h1>NetBird<br><span>for Synology.</span></h1><p class="version">NetBird {esc(version.split('-')[0])} / SPK {esc(version)}</p></div>{content}<footer><a href="https://github.com/TechHutTV/netbird-dsm">TechHutTV/netbird-dsm · 5efc24c</a><a href="https://github.com/{repo}/issues">Issues ↗</a></footer></main></div></body></html>'''
  folder=out/lang;folder.mkdir(exist_ok=True);(folder/'index.html').write_text(page)
 (out/'index.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NetBird for Synology</title><script src="docs.js" defer></script></head><body><a href="en/">English</a> · <a href="zh-CN/">简体中文</a> · <a href="zh-TW/">繁體中文</a> · <a href="de/">Deutsch</a> · <a href="fr/">Français</a> · <a href="ja/">日本語</a></body></html>')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--assets',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--repository',default='WEEWXX/netbird-synology');p.add_argument('--base-url',default='https://weewxx.github.io/netbird-synology');a=p.parse_args();build(Path(__file__).resolve().parents[1],a.assets,a.output,a.repository,a.base_url.rstrip('/'))
