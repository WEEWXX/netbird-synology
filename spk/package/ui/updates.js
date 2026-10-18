/* Public release metadata only; DSM Package Center owns installation. */
(function(root){
 'use strict';
 function parts(version){
  const match=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)-(0|[1-9]\d*)$/.exec(version);
  if(!match)throw Error('Invalid package version');
  const values=match.slice(1).map(Number);if(values.some(x=>!Number.isSafeInteger(x)))throw Error('Invalid version');return values;
 }
 function compare(a,b){const x=parts(a),y=parts(b);for(let i=0;i<4;i++)if(x[i]!==y[i])return x[i]>y[i]?1:-1;return 0;}
 function offer(release,config){
  if(!/^[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+$/.test(config.repository)||!['amd64','arm64'].includes(config.arch))throw Error('Invalid source');
  if(release.draft!==false||release.prerelease!==false||typeof release.tag_name!=='string'||!release.tag_name.startsWith('v'))throw Error('Not stable');
  const version=release.tag_name.slice(1);parts(version);
  const origin='https://github.com/'+config.repository+'/releases/';
  if(release.html_url!==origin+'tag/v'+version)throw Error('Invalid release URL');
  const filename='netbird_'+version+'_synology_'+config.arch+'.spk';
  const asset=(release.assets||[]).find(a=>a.name===filename);
  if(!asset||asset.browser_download_url!==origin+'download/v'+version+'/'+filename)throw Error('Missing compatible package');
  const date=typeof release.published_at==='string'?new Date(release.published_at):null;
  return {version,available:compare(version,config.version)>0,url:release.html_url,download:asset.browser_download_url,
   title:typeof release.name==='string'?release.name.slice(0,200):version,
   notes:typeof release.body==='string'?release.body.slice(0,12000):'',
   published:date&&Number.isFinite(date.getTime())?date.toISOString():'',
   size:Number.isSafeInteger(asset.size)&&asset.size>0?asset.size:0};
 }
 const api={compare,offer};if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
 document.addEventListener('DOMContentLoaded',()=>{
  const ui=root.NetBirdUI,button=document.getElementById('update-check'),status=document.getElementById('update-result'),notes=document.getElementById('update-release');
  if(!button)return;
  let config=null,state='loading',result=null;
  function draw(){
   document.getElementById('package-version').textContent=ui.t('updates.current',{version:config?config.version:'—'});
   status.textContent=state==='available'?ui.t('updates.available',{version:result.version}):state==='latest'?ui.t('updates.latest'):state==='unconfigured'?ui.t('updates.unconfigured'):state==='failed'?ui.t('updates.failed'):state==='ready'?'':ui.t('health.checking');
   const available=state==='available';
   notes.hidden=!available;document.getElementById('update-details').hidden=!available;
   if(available){
    notes.href=result.url;
    document.getElementById('update-name').textContent=result.title||result.version;
    const metadata=[];
    if(result.published)metadata.push(ui.t('updates.published',{date:new Intl.DateTimeFormat(ui.locale(),{dateStyle:'medium'}).format(new Date(result.published))}));
    if(result.size)metadata.push(ui.t('updates.size',{size:ui.number(result.size/1048576)}));
    document.getElementById('update-meta').textContent=metadata.join(' · ');
    document.getElementById('update-notes').textContent=result.notes||ui.t('updates.noNotes');
    document.getElementById('update-download').href=result.download;
   }
  }
  ui.onChange(draw);
  fetch('release.json',{cache:'no-store',credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('Metadata unavailable');return r.json();}).then(value=>{
   parts(value.version);config=value;
   state=value.repository?'ready':'unconfigured';button.disabled=!value.repository;draw();
   if(state==='ready')status.textContent='';
  }).catch(()=>{state='failed';button.disabled=true;draw();});
  button.addEventListener('click',async()=>{
   if(!config||button.disabled)return;
   state='loading';result=null;notes.hidden=true;button.disabled=true;draw();
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
   try{
    if(!/^[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+$/.test(config.repository))throw Error('Invalid source');
    const response=await fetch('https://api.github.com/repos/'+config.repository+'/releases/latest',{credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store',headers:{Accept:'application/vnd.github+json'},signal:controller.signal});
    if(!response.ok)throw Error('Release check failed');
    const raw=await response.text();if(raw.length>1024*1024)throw Error('Metadata too large');
    result=offer(JSON.parse(raw),config);state=result.available?'available':'latest';
   }catch(_){state='failed';result=null;}finally{clearTimeout(timer);button.disabled=false;draw();}
  });
 });
})(typeof window!=='undefined'?window:globalThis);
