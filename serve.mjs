import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');let p=path.resolve(root,'.'+decodeURIComponent(u.pathname));if(p!==root.slice(0,-1)&&!p.startsWith(root)){res.writeHead(403);res.end();return;}if((await stat(p)).isDirectory())p=path.join(p,'index.html');res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(await readFile(p));}catch{const route=new URL(req.url,'http://localhost').pathname;if(/^\/properties\/[a-z0-9-]+\/?$/.test(route)){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});res.end(await readFile(path.join(root,'index.html')));}else{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')));}}}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Cosmos demo: http://127.0.0.1:4173'));
