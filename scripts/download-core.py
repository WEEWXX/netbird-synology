#!/usr/bin/env python3
"""Download an exact official client asset and verify its published checksum."""
import hashlib,io,os,re,sys,tarfile,tempfile,urllib.request
from pathlib import Path

def expected_digest(text,filename):
 matches=[]
 for line in text.splitlines():
  fields=line.split()
  if len(fields)==2 and fields[1].lstrip('*')==filename and re.fullmatch('[0-9a-fA-F]{64}',fields[0]):matches.append(fields[0].lower())
 if len(matches)!=1:raise ValueError('Exact asset checksum missing or ambiguous')
 return matches[0]

def fetch(url,limit):
 with urllib.request.urlopen(url,timeout=60) as response:
  chunks=[];size=0
  while True:
   block=response.read(1024*1024)
   if not block:break
   size+=len(block)
   if size>limit:raise ValueError('Download exceeds limit')
   chunks.append(block)
  return b''.join(chunks)

def main():
 version,arch,dest=sys.argv[1:]
 if not re.fullmatch(r'\d+\.\d+\.\d+',version) or arch not in ['amd64','arm64']:raise ValueError('Unsupported version or architecture')
 filename=f'netbird_{version}_linux_{arch}.tar.gz';base=f'https://github.com/netbirdio/netbird/releases/download/v{version}/'
 checksum=fetch(base+f'netbird_{version}_checksums.txt',1024*1024).decode('utf-8')
 payload=fetch(base+filename,256*1024*1024)
 if hashlib.sha256(payload).hexdigest()!=expected_digest(checksum,filename):raise ValueError('Official client checksum mismatch')
 with tarfile.open(fileobj=io.BytesIO(payload),mode='r:gz') as archive:
  members=[m for m in archive.getmembers() if m.name=='netbird' and m.isfile()]
  if len(members)!=1 or members[0].size>256*1024*1024:raise ValueError('Invalid client archive')
  binary=archive.extractfile(members[0]).read()
 output=Path(dest);output.parent.mkdir(parents=True,exist_ok=True)
 fd,name=tempfile.mkstemp(dir=output.parent,prefix='.verified-core-')
 try:
  with os.fdopen(fd,'wb') as stream:stream.write(binary);stream.flush();os.fsync(stream.fileno())
  os.chmod(name,0o755);os.replace(name,output)
 finally:
  if os.path.exists(name):os.unlink(name)
 print(f'Verified official NetBird {version} ({arch})')
if __name__=='__main__':main()
