import importlib.util,unittest,tempfile,tarfile,io,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class SiteTests(unittest.TestCase):
 def test_six_languages_and_catalog_integrity(self):
  spec=importlib.util.spec_from_file_location('docsite',ROOT/'scripts/build-docsite.py')
  module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
  with tempfile.TemporaryDirectory() as tmp:
   tmp=Path(tmp);assets=tmp/'assets';assets.mkdir()
   for arch in ['amd64','arm64']:
    with tarfile.open(assets/f'netbird_0.81.2-2_synology_{arch}.spk','w') as t:
     raw=b'version="0.81.2-2"\n';info=tarfile.TarInfo('INFO');info.size=len(raw);t.addfile(info,io.BytesIO(raw))
   out=tmp/'site';module.build(ROOT,assets,out,'WEEWXX/netbird-synology','https://weewxx.github.io/netbird-synology')
   for lang in ['en','zh-CN','zh-TW','de','fr','ja']:
    html=(out/lang/'index.html').read_text()
    for section in ['overview','install','connect','help']:self.assertIn('id="'+section+'"',html)
    self.assertIn('aria-label=',html)
   for family in ['x86_64','aarch64']:
    data=json.loads((out/family/'index.json').read_text())['packages'][0]
    self.assertEqual(data['version'],'0.81.2-2')
    self.assertEqual(len(data['sha256']),64)
