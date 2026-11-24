import {mkdir,copyFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {properties,articles} from './src/data.js';
const root=fileURLToPath(new URL('.',import.meta.url));
const dist=root+'dist/';
await mkdir(dist,{recursive:true});
for(const name of ['app.js','data.js','i18n.js','styles.css']) await copyFile(root+'src/'+name,dist+name);
const routes=['','properties','portfolio','insights','about','contact',...properties.map(p=>'properties/'+p.slug),...articles.map(a=>'insights/'+a.slug)];
for(const route of routes){
  await mkdir(dist+route,{recursive:true});
  await writeFile(dist+(route?route+'/':'')+'index.html',`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Explore Cosmos Real Estate's international property demonstration. All listings, prices and imagery are illustrative."><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#173a32"><title>Cosmos Real Estate | A world of possibility</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.js"></script></head><body><div id="app"><p class="initial-message">COSMOS REAL ESTATE — Interactive demonstration. Sample properties and prices. Please enable JavaScript to explore.</p></div><noscript><p>This demonstration needs JavaScript for filters, galleries and languages. No property enquiry can be sent from this demo.</p></noscript></body></html>`);
}
await writeFile(dist+'favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>Cosmos Real Estate</title><rect width="64" height="64" rx="12" fill="#173A32"/><path d="M48 13a24 24 0 1 0 0 38" fill="none" stroke="#D6B879" stroke-width="2.5"/><path d="M22 46V29l9-5v22M31 46V18l10-5v33M18 46h29" fill="none" stroke="#F7F7EF" stroke-width="2"/><path d="m51 27 1.5 3.5L56 32l-3.5 1.5L51 37l-1.5-3.5L46 32l3.5-1.5Z" fill="#D6B879"/></svg>');
await writeFile(dist+'404.html','<!doctype html><html lang="en"><meta charset="utf-8"><title>Page not found | Cosmos</title><style>body{font:20px system-ui;padding:10vw;background:#173a32;color:white}a{color:#e7d4aa}</style><h1>This place is yet to be discovered.</h1><p>The page could not be found.</p><a href="/">Return to Cosmos</a></html>');
console.log(`Built ${routes.length} direct routes. Existing dist/assets retained.`);
