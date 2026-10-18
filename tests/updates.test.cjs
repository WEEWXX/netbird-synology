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
test('automatic checks wait a full 24 hours but recover from invalid or future timestamps',()=>{
 const {nextDelay,DAY}=require('../spk/package/ui/updates.js'),now=1000000000;
 assert.equal(DAY,86400000);
 assert.equal(nextDelay(now-1000,now),DAY-1000);
 assert.equal(nextDelay(now-DAY,now),0);
 assert.equal(nextDelay(null,now),0);
 assert.equal(nextDelay(now+1,now),0);
 assert.equal(nextDelay('broken',now),0);
});
test('automatic checks persist across reloads, repeat after a day, and manual checks bypass the interval',async()=>{
 const vm=require('node:vm'),fs=require('node:fs'),storage=new Map();
 let now=Date.now(),requests=0;
 const config={repository:'example/client',arch:'amd64',version:'0.81.2-1'};
 const base='https://github.com/example/client/releases/';
 const release={tag_name:'v0.81.2-2',draft:false,prerelease:false,html_url:base+'tag/v0.81.2-2',assets:[{name:'netbird_0.81.2-2_synology_amd64.spk',browser_download_url:base+'download/v0.81.2-2/netbird_0.81.2-2_synology_amd64.spk'}]};
 async function open(){
  const nodes={},handlers={};const document={hidden:false,addEventListener:(event,fn)=>{handlers[event]=fn;},getElementById:id=>nodes[id]||(nodes[id]={disabled:false,addEventListener(event,fn){this[event]=fn;}})};
  const context={document,window:{NetBirdUI:{t:key=>key,locale:()=> 'en',number:String,onChange:()=>{}}},localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},Date:class extends Date{static now(){return now;}},Intl,AbortController,setTimeout:()=>1,clearTimeout:()=>{},fetch:async url=>{if(url==='release.json')return {ok:true,json:async()=>config};requests++;return {ok:true,text:async()=>JSON.stringify(release)};}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../spk/package/ui/updates.js'),'utf8'),context);
  handlers.DOMContentLoaded();await new Promise(setImmediate);return nodes;
 }
 let nodes=await open();assert.equal(requests,1);assert.equal(nodes['update-result'].textContent,'updates.available');
 nodes=await open();assert.equal(requests,1);assert.equal(nodes['update-result'].textContent,'updates.available');
 now+=86400000;nodes=await open();assert.equal(requests,2);
 await nodes['update-check'].click();assert.equal(requests,3);
});
