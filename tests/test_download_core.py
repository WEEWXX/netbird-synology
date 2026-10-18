import importlib.util,unittest
from pathlib import Path
class CoreDownloadTests(unittest.TestCase):
 def test_checksum_requires_the_exact_asset(self):
  spec=importlib.util.spec_from_file_location('download',Path(__file__).resolve().parents[1]/'scripts/download-core.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
  digest='a'*64
  self.assertEqual(m.expected_digest(digest+'  netbird_0.81.2_linux_arm64.tar.gz\n','netbird_0.81.2_linux_arm64.tar.gz'),digest)
  with self.assertRaises(ValueError):m.expected_digest(digest+'  netbird_0.81.2_linux_amd64.tar.gz\n','netbird_0.81.2_linux_arm64.tar.gz')
if __name__=='__main__':unittest.main()
