import importlib.util
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class SyncTests(unittest.TestCase):
 def module(self):
  spec=importlib.util.spec_from_file_location('sync',ROOT/'scripts/sync-upstream.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
 def test_new_stable_release_and_rollback_rejected(self):
  m=self.module()
  self.assertEqual(m.candidate({'tag_name':'v0.81.2','draft':False,'prerelease':False},'0.80.0'),'0.81.2')
  self.assertIsNone(m.candidate({'tag_name':'v0.79.0','draft':False,'prerelease':False},'0.80.0'))
 def test_drafts_prereleases_and_injected_versions_rejected(self):
  m=self.module()
  for tag,draft,pre in [('v0.82.0-rc.1',False,True),('v0.82.0',True,False),('v0.82.0$(id)',False,False)]:
   self.assertIsNone(m.candidate({'tag_name':tag,'draft':draft,'prerelease':pre},'0.80.0'))
if __name__=='__main__':unittest.main()
