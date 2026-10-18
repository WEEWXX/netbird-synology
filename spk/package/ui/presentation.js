/* Presentation preferences are browser-local; never alter DSM or VPN settings. */
(function(root) {
 'use strict';
 const catalogs = typeof module !== 'undefined' && module.exports ? require('./locales.js') : root.NetBirdLocales;
 const supported = Object.keys(catalogs);
 function resolveLocale(languages) {
  for(const raw of languages || []) {
   const value = String(raw).toLowerCase();
   if(/^zh(?:-|$)/.test(value)) return /(?:tw|hk|mo|hant)/.test(value) ? 'zh-TW' : 'zh-CN';
   const base = value.split('-')[0];
   if(supported.includes(base)) return base;
  }
  return 'en';
 }
 function translate(locale,key,values={}) {
  const catalog=catalogs[locale]||catalogs.en;
  const field={'health.available':'available','summary.unknownCount':'count','peers.partial':'shown'}[key];
  const form=field ? new Intl.PluralRules(locale).select(Number(values[field])) : '';
  const text = catalog[key+'.'+form] || catalog[key] || catalogs.en[key] || key;
  return text.replace(/\{(\w+)\}/g, (match,name) => Object.prototype.hasOwnProperty.call(values,name) ? String(values[name]) : match);
 }
 const legacy = new Map(Object.entries(catalogs.en).map(([key,value])=>[value,key]));
 function translateMessage(locale,text) {
  if(legacy.has(text)) return translate(locale,legacy.get(text));
  const types=/^(\d+) P2P · (\d+) relayed(?: · (\d+) unknown)?$/.exec(text);
  if(types) return translate(locale,'summary.typesCount',{p2p:types[1],relayed:types[2]})+(types[3]?translate(locale,'summary.unknownCount',{count:types[3]}):'');
  const unknown=/^Unrecognized NetBird state: (.*)$/.exec(text);
  if(unknown)return translate(locale,'status.unknownState',{state:unknown[1]});
  return text;
 }
 function theme(mode,dark) {return mode==='dark'||(mode==='system'&&dark)?'dark':'light';}
 function bundleCopy(locale,destination) {
  const support=destination==='support';
  return {button:translate(locale,support?'bundle.createUpload':'bundle.create'),note:translate(locale,support?'bundle.uploadNote':'bundle.localNote')};
 }
 const api = {catalogs,resolveLocale,translate,translateMessage,theme,bundleCopy};
 if(typeof module!=='undefined' && module.exports) {module.exports=api;return;}
 function read(key,fallback) {try{return localStorage.getItem(key)||fallback;}catch(_){return fallback;}}
 function save(key,value) {try{localStorage.setItem(key,value);}catch(_) { /* Preferences remain valid for this page. */ }}
 let choice=read('netbird.language','auto'),mode=read('netbird.theme','system');
 if(choice!=='auto'&&!supported.includes(choice)) choice='auto';
 if(!['system','light','dark'].includes(mode))mode='system';
 let locale=choice==='auto'?resolveLocale(navigator.languages):choice;
 const media=matchMedia('(prefers-color-scheme: dark)');
 const listeners=[];
 api.locale=()=>locale;
 api.t=(key,values)=>translate(locale,key,values);
 api.message=text=>translateMessage(locale,text);
 api.time=value=>new Intl.DateTimeFormat(locale,{hour:'numeric',minute:'2-digit',second:'2-digit'}).format(value);
 api.relative=(count,unit)=>new Intl.RelativeTimeFormat(locale,{numeric:'auto'}).format(count,unit);
 api.number=value=>new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(value);
 api.onChange=callback=>listeners.push(callback);
 function applyTheme(){document.documentElement.dataset.theme=theme(mode,media.matches);}
 api.apply=function(scope=document){
  document.documentElement.lang=locale;
  for(const node of scope.querySelectorAll('[data-i18n]')) {
   const text=api.t(node.dataset.i18n);
   // Translate the labelled text node while keeping SVGs and nested controls.
   const child=[...node.childNodes].find(n=>n.nodeType===3 && n.textContent.trim());
   if(child) child.textContent=text; else node.textContent=text;
  }
  for(const node of scope.querySelectorAll('[data-i18n-message]')) {
   const english=node.dataset.originalMessage || node.textContent;
   node.dataset.originalMessage=english; node.textContent=api.message(english);
  }
  for(const attr of ['placeholder','title','aria-label'])for(const node of scope.querySelectorAll('[data-i18n-'+attr+']'))node.setAttribute(attr,api.t(node.getAttribute('data-i18n-'+attr)));
 };
 root.NetBirdUI=api;
 applyTheme();
 media.addEventListener('change',applyTheme);
 document.addEventListener('DOMContentLoaded',()=>{
  const language=document.getElementById('ui-language'),appearance=document.getElementById('ui-theme');
  if(language){language.value=choice;language.addEventListener('change',()=>{choice=language.value;locale=choice==='auto'?resolveLocale(navigator.languages):choice;save('netbird.language',choice);api.apply();listeners.forEach(f=>f());});}
  if(appearance){appearance.value=mode;appearance.addEventListener('change',()=>{mode=appearance.value;save('netbird.theme',mode);applyTheme();});}
  api.apply();
 });
})(typeof window!=='undefined'?window:globalThis);
