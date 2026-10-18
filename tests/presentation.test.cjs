const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const file = '../spk/package/ui/presentation.js';
test('locale fallback and whole sentence formatting preserve values', () => {
 const ui = require(file);
 assert.equal(ui.resolveLocale(['zh-HK']), 'zh-TW');
 assert.equal(ui.resolveLocale(['de-AT']), 'de');
 assert.equal(ui.resolveLocale(['pt-BR']), 'en');
 assert.equal(ui.translate('de', 'status.updated', {time:'12:34'}), 'Aktualisiert um 12:34');
 assert.equal(ui.translate('ja', 'peers.partial', {shown:2,total:8}), '8 台中 2 台を表示');
});
test('every locale keeps the same placeholders and supports local formatting', () => {
 const ui = require(file);
 for(const locale of ['en','zh-CN','zh-TW','de','fr','ja']) {
  for(const [key, value] of Object.entries(ui.catalogs.en)) {
   assert.ok(ui.catalogs[locale][key], `${locale}:${key}`);
   assert.deepEqual([...ui.catalogs[locale][key].matchAll(/\{(\w+)\}/g)].map(x=>x[1]).sort(), [...value.matchAll(/\{(\w+)\}/g)].map(x=>x[1]).sort(), `${locale}:${key}`);
  }
 }
 assert.equal(ui.theme('system', true), 'dark');
 assert.equal(ui.theme('light', true), 'light');
 assert.equal(ui.theme('injected', false), 'light');
});
test('unknown user content is never translated as interface copy', () => {
 const ui = require(file);
 assert.equal(ui.translateMessage('de', 'NAS-company-Connected'), 'NAS-company-Connected');
 assert.equal(ui.translate('fr', 'missing.key'), 'missing.key');
});
test('connection summaries localize whole sentences without changing counts',()=>{
 const ui=require(file);
 assert.equal(ui.translateMessage('zh-TW','2 P2P · 1 relayed · 3 unknown'),'2 個直連 · 1 個中繼 · 3 個未知');
 assert.equal(ui.translateMessage('ja','Unrecognized NetBird state: FutureState'),'不明な NetBird の状態：FutureState');
});
test('French availability and peer counts use local singular/plural forms',()=>{
 const ui=require(file);
 assert.equal(ui.translate('fr','health.available',{available:1,total:2}),'1 / 2 disponible');
 assert.equal(ui.translate('fr','health.available',{available:2,total:2}),'2 / 2 disponibles');
 assert.equal(ui.translate('fr','peers.partial',{shown:1,total:3}),'Affichage de 1 pair sur 3');
});
test('local diagnostics never show an upload instruction after changing language',()=>{
 const ui=require(file),copy=ui.bundleCopy('de','local');
 assert.equal(copy.button,'Diagnosepaket erstellen');
 assert.match(copy.note,/bleibt.*NAS/);
 assert.equal(ui.bundleCopy('ja','support').button,'バンドルを作成してアップロード');
});
