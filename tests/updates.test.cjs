const test=require('node:test'),assert=require('node:assert/strict');
test('update comparison uses numeric core versions and package revisions',()=>{
 const m=require('../spk/package/ui/updates.js');
 assert.equal(m.compare('0.81.2-10','0.81.2-2'),1);
 assert.equal(m.compare('0.81.3-1','0.81.2-10'),1);
 assert.throws(()=>m.compare('0.81.2-fix-1','0.81.2-2'));
});
test('only stable assets in the configured repository and matching architecture are offered',()=>{
 const m=require('../spk/package/ui/updates.js');
 const release={tag_name:'v0.81.2-2',draft:false,prerelease:false,html_url:'https://github.com/WEEWXX/netbird-dsm/releases/tag/v0.81.2-2',assets:[{name:'netbird_0.81.2-2_synology_arm64.spk',browser_download_url:'https://github.com/WEEWXX/netbird-dsm/releases/download/v0.81.2-2/netbird_0.81.2-2_synology_arm64.spk'}]};
 assert.equal(m.offer(release,{repository:'WEEWXX/netbird-dsm',arch:'arm64',version:'0.81.2-1'}).version,'0.81.2-2');
 assert.throws(()=>m.offer(release,{repository:'WEEWXX/netbird-dsm',arch:'amd64',version:'0.81.2-1'}));
 assert.throws(()=>m.offer({...release,prerelease:true},{repository:'WEEWXX/netbird-dsm',arch:'arm64',version:'0.81.2-1'}));
});
test('update details preserve release text as data and expose the exact compatible download',()=>{
 const {offer}=require('../spk/package/ui/updates.js');
 const base='https://github.com/example/client/releases/';
 const release={tag_name:'v0.81.2-2',draft:false,prerelease:false,html_url:base+'tag/v0.81.2-2',name:'Maintenance release',body:'Fix connection recovery\n<script>alert(1)</script>',published_at:'2026-10-19T00:00:00Z',assets:[{name:'netbird_0.81.2-2_synology_amd64.spk',size:15728640,browser_download_url:base+'download/v0.81.2-2/netbird_0.81.2-2_synology_amd64.spk'}]};
 const result=offer(release,{repository:'example/client',arch:'amd64',version:'0.81.2-1'});
 assert.equal(result.title,'Maintenance release');
 assert.equal(result.notes,release.body);
 assert.equal(result.published,'2026-10-19T00:00:00.000Z');
 assert.equal(result.size,15728640);
 assert.throws(()=>offer({...release,assets:[{...release.assets[0],browser_download_url:'https://evil.example/a.spk'}]},{repository:'example/client',arch:'amd64',version:'0.81.2-1'}));
});
