const fs=require('fs'),path=require('path');
const src=require('./engine').source();
const N=+process.argv[2]||12;const ONLY=process.env.ONLY;
new Function('N','fm','sg','ONLY',src+`
if(ONLY!==undefined){const keep=ONLY.split(',');['exc','motosserra','dolar','anticorr','referendo','parl','planej','nacbanco'].forEach(id=>{if(!keep.includes(id)){LAWS.splice(LAWS.findIndex(l=>l.id===id),1);delete LAW[id]}})}
const pol={PT:-1.6,PSB:-.9,PDT:-.6,MDB:0,PSD:.1,UB:.5,PSDB:.4,REP:1,PLB:1.7};
function evScore(e){const f=e.e||{};return (f.mood?(f.mood.all||0):0)+(f.rat||0)*.5+(f.gn||0)*300+(f.inv||0)-(f.cost||0)*.08+(f.idx?Object.values(f.idx).reduce((a,v)=>a+v,0):0)+(f.infl||0)*-2}
function play(party,mode,seed){const S=newGame(pol[party],1,party,seed);S.ano=2027;S.q=1;startTurn(S);const st={imp:0,lost:0,leaves:0,passed:0,sent:0,ret:0,fail:0};let ended=null;
 for(let n=0;n<112;n++){
  S.queue.forEach(e0=>{const e=typeof e0==='string'?EVm[e0]:e0;let i=0;if(mode==='rand')i=Math.floor(Math.random()*e.o.length);else if(mode==='smart'){i=e.o.map((o,j)=>[evScore(o),j]).sort((a,b)=>b[0]-a[0])[0][1]}applyFx(S,e.o[i].e)});S.queue=[];
  if(mode==='smart'){UF.forEach(u=>{['edu','infra','tech','saude'].forEach(k=>S.st[u.uf].m[k]=Math.min(1.15,lawSum(S).cap))});
   // coalizão
   const cs=S.coal;BL.forEach(b=>{if(cs.includes(b.id)&&b.id!==S.party&&S.sat[b.id]<48&&freeMin(S)>0&&S.mins[b.id]<5){S.mins[b.id]++;S.sat[b.id]=Math.min(100,S.sat[b.id]+6)}});
   if(S.ap>0&&freeMin(S)>0){const out=BL.filter(b=>!cs.includes(b.id)).sort((a,b)=>Math.abs(a.pos-S.x)-Math.abs(b.pos-S.x))[0];if(out&&Math.abs(out.pos-S.x)<1.8&&S.ap>0){S.ap--;S.mins[out.id]=1;joinCoal(S,out.id)}}
   const cand=S.pauta.concat(LAWS.filter(l=>l.bold&&!S.laws.includes(l.id)&&(!l.only||(S.x>=l.only[0]&&S.x<=l.only[1]))&&popSup(S,l)>=50).map(l=>l.id)).map(id=>LAW[id]).filter(l=>{const p=proj(S,l);return p.c>=p.n.c*1.02&&p.s>=p.n.s*1.02}).slice(0,2);S.sent=cand.map(l=>l.id);
   if(S.ap>0)act(S,'discurso')}
  S.sent.forEach(id=>{st.sent++;const l=LAW[id],v=vote(S,l);if(v.pass){st.passed++;lawAftermath(S,l);passLaw(S,id)}else{S.fails++}});S.sent=[];
  const lv=S.coal.length;const rep=simQuarter(S);
  if(rep.imp){st.imp=1;succession(S,'imp');ended='imp';break}
  if(S.q===4&&MUN.includes(S.ano))munElection(S);
  const last=S.ano===END&&S.q===4;
  if(S.q===4&&ELECT.includes(S.ano)){
    if(termLimited(S)){interregnum(S);SIDE[S.int.side]++;if(S.ano>=END){break}const r=returnElection(S,'mod');if(r.win){st.ret++;S.x=S.int.x0;S.int=null;S.consec=1;initCoal(S);pickRival(S);S.stage=null}else{st.lost=S.ano;succession(S,'lose');ended='ret-lost';break}}
    else{const strat=natShare(S)<52?'ent':'mod';const r=election(S,strat);reelect(S);if(!r.win){st.lost=S.ano;succession(S,'lose');ended='lost';break}S.consec=(S.consec||1)+1}
  }
  if(last)break;
  S.q++;if(S.q>4){S.q=1;S.ano++}startTurn(S)}
 CRN.n+=S.log.filter(l=>l.k==='reg'&&/Pandemia|hídrica|tarifária|cambial|petróleo|Acordo comercial/.test(l.t)).length;CRN.g++;st.leaves=S.log.filter(l=>l.k==='coal'&&/deixa/.test(l.t)).length;const L=legacy(S);const sc0=finalScore(S);const L0=legacy(S);return{pcg:L0.pcg,povm:Math.max(...UF.map(u=>indOf(S,u.uf).pov)),pec:S.laws.filter(id=>LAW[id].tipo==='PEC').length,dr:S.debt/gdp(S)*100,rt:S.rt,idhm:Math.max(...S.hist.map(h=>h.idh||0)),sc:sc0,ach:achEval(S,sc0),st,ended,mand:S.mandato}}
const SIDE={own:0,opp:0},CRN={n:0,g:0};const parties=Object.keys(pol),modes=['smart','rand'];
const out={};
for(const m of modes){for(const p of parties){const rs=[];for(let i=0;i<N;i++)rs.push(play(p,m,1000+i));out[m+' '+p]=rs}}
console.log("SUC",JSON.stringify(SIDE),"fases de crise/jogo",(CRN.n/CRN.g).toFixed(1));const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
for(const k in out){const rs=out[k];console.log(k.padEnd(10),'nota',avg(rs.map(r=>r.sc)).toFixed(0).padStart(3),'min',Math.min(...rs.map(r=>r.sc)),'max',Math.max(...rs.map(r=>r.sc)),'| imp',rs.filter(r=>r.st.imp).length,'perdeu',rs.filter(r=>r.st.lost).length,'retornos',rs.reduce((a,r)=>a+r.st.ret,0),'saídas coalizão/jogo',avg(rs.map(r=>r.st.leaves)).toFixed(1),'leis ap/enviadas',rs.reduce((a,r)=>a+r.st.passed,0)+'/'+rs.reduce((a,r)=>a+r.st.sent,0))}
{const q=(m,k)=>{const v=Object.entries(out).filter(([x])=>x.startsWith(m)).flatMap(([,r])=>r.map(z=>z[k])).sort((a,b)=>a-b);return [v[0],v[Math.floor(v.length/2)],v[v.length-1]].map(x=>+x.toFixed(2))};if(process.env.DIST)['pcg','povm','pec','dr','rt','idhm'].forEach(k=>console.log(k,'smart',q('smart',k),'rand',q('rand',k)))}console.log('JSON '+JSON.stringify({crise:CRN.n/CRN.g,ach:(()=>{const c={};['smart','rand'].forEach(m=>{const rs=Object.entries(out).filter(([k])=>k.startsWith(m)).flatMap(([,v])=>v);ACH.forEach(a=>{c[m+':'+a.id]=rs.filter(r=>r.ach.includes(a.id)).length/rs.length})});return c})(),rows:Object.fromEntries(Object.entries(out).map(([k,rs])=>[k,{sc:avg(rs.map(r=>r.sc)),n:rs.length,imp:rs.filter(r=>r.st.imp).length,lost:rs.filter(r=>r.st.lost).length,pass:rs.reduce((a,r)=>a+r.st.passed,0),sent:rs.reduce((a,r)=>a+r.st.sent,0)}]))}));
`)(N,(n,d=1)=>n.toFixed(d),(n,d=1)=>(n>=0?"+":"-")+Math.abs(n).toFixed(d),ONLY);
