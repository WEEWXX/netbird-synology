(function(){
 const supported=['en','zh-CN','zh-TW','de','fr','ja'];
 function read(k){try{return localStorage.getItem(k);}catch(_){return null;}}
 function save(k,v){try{localStorage.setItem(k,v);}catch(_){}}
 const current=document.documentElement.lang;
 const select=document.getElementById('language');
 if(!select){
  let lang=read('docs.language');
  if(!supported.includes(lang)){lang='en';for(const raw of navigator.languages||[]){if(/^zh/i.test(raw)){lang=/TW|HK|Hant/i.test(raw)?'zh-TW':'zh-CN';break;}const base=raw.split('-')[0];if(supported.includes(base)){lang=base;break;}}}
  location.replace('./'+lang+'/'+location.hash);return;
 }
 select.addEventListener('change',()=>{save('docs.language',select.value);location.assign('../'+select.value+'/'+location.hash);});
 const theme=document.getElementById('theme'),media=matchMedia('(prefers-color-scheme: dark)');
 let mode=read('docs.theme')||'system';if(!['system','light','dark'].includes(mode))mode='system';theme.value=mode;
 function apply(){document.documentElement.dataset.theme=mode==='system'?(media.matches?'dark':'light'):mode;}
 theme.addEventListener('change',()=>{mode=theme.value;save('docs.theme',mode);apply();});media.addEventListener('change',apply);apply();
 document.querySelectorAll('.source input').forEach(input=>input.addEventListener('click',()=>input.select()));
})();
