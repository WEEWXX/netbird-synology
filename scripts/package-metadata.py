#!/usr/bin/env python3
import json,re,sys
from pathlib import Path
version,core,arch,repo=sys.argv[1:]
if not re.fullmatch(r'\d+\.\d+\.\d+-[1-9]\d*',version):raise SystemExit('Numeric SPK revision required')
if not re.fullmatch(r'\d+\.\d+\.\d+',core) or version.split('-')[0]!=core:raise SystemExit('Core and package versions must match')
if arch not in ['amd64','arm64']:raise SystemExit('Unsupported architecture')
if repo and not re.fullmatch(r'[A-Za-z0-9_-]+/[A-Za-z0-9_.-]+',repo):raise SystemExit('Invalid update repository')
Path('spk/package/ui/release.json').write_text(json.dumps({'version':version,'core':core,'arch':arch,'repository':repo})+'\n')
