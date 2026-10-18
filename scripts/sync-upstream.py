#!/usr/bin/env python3
"""Detect newer stable upstream releases; changes require the normal PR tests."""
import json,os,re,sys,urllib.request
from pathlib import Path
VERSION=re.compile(r'^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$')
def version(value):
 m=VERSION.fullmatch(value) if isinstance(value,str) else None
 return tuple(map(int,m.groups())) if m else None

def candidate(release,current):
 if release.get('draft') is not False or release.get('prerelease') is not False:return None
 tag=release.get('tag_name','');v=version(tag);old=version(current)
 if v is None or old is None or v<=old:return None
 return '.'.join(map(str,v))

def main():
 root=Path(__file__).resolve().parents[1]
 headers={'Accept':'application/vnd.github+json','User-Agent':'netbird-dsm-upstream-sync'}
 if os.environ.get('GH_TOKEN'):headers['Authorization']='Bearer '+os.environ['GH_TOKEN']
 request=urllib.request.Request('https://api.github.com/repos/netbirdio/netbird/releases/latest',headers=headers)
 with urllib.request.urlopen(request,timeout=30) as response:
  raw=response.read(1024*1024+1)
  if len(raw)>1024*1024:raise ValueError('release metadata too large')
 release=json.loads(raw);selected=candidate(release,(root/'VERSION').read_text().strip())
 if selected:
  (root/'VERSION').write_text(selected+'\n');(root/'REVISION').write_text('1\n')
  print(selected)
if __name__=='__main__':main()
