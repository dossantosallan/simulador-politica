// Regressão de calibração: roda bots (esperto/aleatório × 9 partidos) e confere faixas esperadas.
const {spawnSync}=require('child_process'),path=require('path');
const N=process.env.N||'8';
const r=spawnSync('node',[path.join(__dirname,'_calib_core.js'),N],{encoding:'utf8',maxBuffer:1<<26});
const line=(r.stdout||'').split('\n').find(l=>l.startsWith('JSON '));
if(!line){console.log(r.stdout,r.stderr);process.exit(1)}
const J=JSON.parse(line.slice(5)),errs=[];
const rows=Object.entries(J.rows),sm=rows.filter(([k])=>k.startsWith('smart')),rd=rows.filter(([k])=>k.startsWith('rand'));
const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
const sa=avg(sm.map(([,v])=>v.sc)),ra=avg(rd.map(([,v])=>v.sc));
const chk=(c,m)=>{if(!c)errs.push(m)};
chk(sa>=70&&sa<=84,`nota média do bot esperto fora de 70–84: ${sa.toFixed(1)}`);
chk(ra<=60,`nota média do bot aleatório > 60: ${ra.toFixed(1)}`);
chk(sa-ra>=20,`separação esperto-aleatório < 20: ${(sa-ra).toFixed(1)}`);
const sc=sm.map(([,v])=>v.sc);chk(Math.max(...sc)-Math.min(...sc)<=10,`paridade entre partidos > 10 pts: ${Math.min(...sc).toFixed(0)}–${Math.max(...sc).toFixed(0)}`);
const pr=sm.reduce((a,[,v])=>a+v.pass,0)/sm.reduce((a,[,v])=>a+v.sent,0);chk(pr>=.8&&pr<=.995,`taxa de aprovação de leis do bot esperto fora de 80–99,5%: ${(pr*100).toFixed(1)}%`);
const imp=sm.reduce((a,[,v])=>a+v.imp,0)/sm.reduce((a,[,v])=>a+v.n,0);chk(imp<=.1,`impeachment do bot esperto > 10%: ${(imp*100).toFixed(1)}%`);
const lost=rd.reduce((a,[,v])=>a+v.lost,0)/rd.reduce((a,[,v])=>a+v.n,0);chk(lost>=.2,`bot aleatório perde eleições em < 20% dos jogos: ${(lost*100).toFixed(0)}%`);
chk(J.crise>=1&&J.crise<=6,`fases de crise por jogo fora de 1–6: ${J.crise.toFixed(1)}`);
console.log(`calibração (N=${N}): esperto ${sa.toFixed(1)} | aleatório ${ra.toFixed(1)} | leis ${(pr*100).toFixed(1)}% | impeach ${(imp*100).toFixed(1)}% | crises ${J.crise.toFixed(1)} fases/jogo`);
if(errs.length){console.log('FALHAS:\n - '+errs.join('\n - '));process.exit(1)}console.log('OK');
