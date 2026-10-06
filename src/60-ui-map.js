// UI-1
const $=q=>document.querySelector(q);
const fm=(n,d=1)=>n.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
const sg=(n,d=1)=>(n>=0?'+':'−')+fm(Math.abs(n),d);
const SHORT={edu:'Educação',saude:'Saúde',infra:'Infra',seg:'Segurança',tech:'C&T',social:'Social',amb:'Ambiente'};
let S=newState(0),sel='SP',metric='appr',histK='ar';
const MET=[
 {k:'appr',n:'Aprovação',f:(u,g)=>g.appr,fmt:v=>fm(v,0)+'%',sc:v=>v,lo:'menor',hi:'maior'},
 {k:'rej',n:'Rejeição',f:(u,g)=>rejOf(S,u,g.appr),fmt:v=>fm(v,0)+'%',sc:v=>v*1.4,lo:'menor',hi:'maior'},
 {k:'share',n:'Voto projetado',f:(u,g)=>shareOf(S,u,g.appr),fmt:v=>fm(v,0)+'%',div:1,lo:'rejeita',hi:'aprova'},
 {k:'pc',n:'PIB per capita',f:(u,g)=>g.pib/g.pop,fmt:v=>fm(v,0)+' mil',sc:v=>v/120*100,lo:'menor',hi:'maior'},
 {k:'g',n:'Crescimento',f:(u,g)=>g.g*100,fmt:v=>sg(v)+'%',sc:v=>(v+1)/6*100,lo:'menor',hi:'maior'},
 {k:'rel',n:'Governador',f:(u,g)=>g.rel,fmt:v=>fm(v,0),sc:v=>v,lo:'relação ruim',hi:'relação boa'},
 ...SEC.map(s=>({k:s.id,n:SHORT[s.id],f:(u,g)=>g.idx[s.id],fmt:v=>fm(v,0),sc:v=>v,lo:'índice baixo',hi:'índice alto'}))];
const curM=()=>MET.find(x=>x.k===metric);
const tip=$('#tip');
function showTip(html,x,y){tip.innerHTML=html;tip.hidden=false;const w=tip.offsetWidth;tip.style.left=Math.max(8,Math.min(innerWidth-w-8,x+12))+'px';tip.style.top=(y+14)+'px'}
function hideTip(){tip.hidden=true}
function buildMap(){
 $('#map').setAttribute('viewBox',`0 0 ${GEOW} ${GEOH}`);
 $('#map').innerHTML=UF.map(u=>`<path class="tl" id="tl-${u.uf}" data-act="sel" data-r="${u.uf}" d="${GEO[u.uf].d}" tabindex="0" role="button" aria-label="${u.nome}"/>`).join('')+`<path id="hl" fill="none" d=""/>`+UF.filter(u=>GEO[u.uf].a>650).map(u=>`<text class="ml" x="${GEO[u.uf].c[0]}" y="${GEO[u.uf].c[1]+3}">${u.uf}</text>`).join('');
 $('#chips').innerHTML=MET.map(m=>`<button class="chip" data-act="metric" data-k="${m.k}" aria-pressed="false">${m.n}</button>`).join('')}
function fillFor(m,v){if(m.div){const p=cl((v-50)/25,-1,1);return p>=0?`color-mix(in srgb, var(--good) ${(p*100).toFixed(0)}%, var(--map-lo))`:`color-mix(in srgb, var(--bad) ${(-p*100).toFixed(0)}%, var(--map-lo))`}
 return `color-mix(in srgb, var(--map-hi) ${cl(m.sc(v)).toFixed(0)}%, var(--map-lo))`}
function renderMap(){const m=curM();
 UF.forEach(u=>{const v=m.f(u,S.st[u.uf]);$('#tl-'+u.uf).style.fill=fillFor(m,v)});
 const h=$('#hl'),p=$('#tl-'+sel);h.setAttribute('d',GEO[sel].d);p.parentNode.appendChild(h);
 document.querySelectorAll('.chip[data-k]').forEach(c=>{if(c.closest('#chips'))c.setAttribute('aria-pressed',c.dataset.k===metric)});
 $('#ramp').style.background=m.div?'linear-gradient(90deg,var(--bad),var(--map-lo),var(--good))':'';
 $('#lgLo').textContent=m.lo;$('#lgHi').textContent=m.hi+' · '+m.n}
function renderRank(){const m=curM();
 const rows=UF.map(u=>({u,v:m.f(u,S.st[u.uf])})).sort((a,b)=>b.v-a.v);
 $('#rkSub').textContent=m.n;
 $('#rank').innerHTML=rows.map((r,i)=>`<button class="rk ${r.u.uf===sel?'on':''}" data-act="sel" data-r="${r.u.uf}" data-hv="${r.u.uf}"><span>${r.u.uf}</span><div class="tr"><i style="width:${(m.div?cl(r.v):cl(m.sc(r.v))).toFixed(0)}%"></i></div><b>${m.fmt(r.v)}</b></button>`).join('')}
const HC={W:520,H:230,L:38,R:14,T:14,B:28};
const HM=[
 {k:'ar',n:'Aprovação',s:['appr','rej'],c:['var(--accent)','var(--bad)'],l:['Aprova','Rejeita'],d:0,u:'%'},
 {k:'pib',n:'PIB (R$ bi)',s:['pib'],c:['var(--accent)'],l:['PIB'],d:0,u:''},
 {k:'pc',n:'PIB per capita',s:['pc'],c:['var(--accent)'],l:['R$ mil/hab.'],d:1,u:''},
 {k:'g',n:'Crescimento',s:['g'],c:['var(--cyan)'],l:['PIB (anualizado)'],d:1,ref:0,u:'%'},
 {k:'infl',n:'Inflação',s:['infl'],c:['var(--warn)'],l:['Inflação'],d:1,u:'%'},
 {k:'unem',n:'Desemprego',s:['unem'],c:['var(--b2)'],l:['Desemprego'],d:1,u:'%'},
 {k:'dr',n:'Dívida/PIB',s:['dr'],c:['var(--bad)'],l:['Dívida/PIB'],d:0,u:'%'},
 {k:'rate',n:'Juros',s:['rate'],c:['var(--warn)'],l:['Selic real'],d:1,u:'%'},
 {k:'I',n:'Investimento privado',s:['I'],c:['var(--cyan)'],l:['% do PIB'],d:1,u:'%'},
 {k:'rt',n:'Nota de crédito',s:['rt'],c:['var(--accent)'],l:['Índice'],d:0,u:''}];
function histScale(){const H=S.hist,m=HM.find(x=>x.k===histK),n=H.length;const all=m.s.flatMap(k=>H.map(h=>h[k]));if(m.ref!=null)all.push(m.ref);
 let lo=Math.min(...all),hi=Math.max(...all);if(hi-lo<2){lo-=1;hi+=1}const p=(hi-lo)*.12;lo-=p;hi+=p;
 return{H,m,n,lo,hi,X:i=>n>1?HC.L+i*(HC.W-HC.L-HC.R)/(n-1):(HC.L+HC.W-HC.R)/2,Y:v=>HC.T+(1-(v-lo)/(hi-lo))*(HC.H-HC.T-HC.B)}}
function drawHist(){const{H,m,n,lo,hi,X,Y}=histScale();let g='';
 for(let k=0;k<5;k++){const v=lo+(hi-lo)*k/4,y=Y(v);g+=`<line class="gl" x1="${HC.L}" x2="${HC.W-HC.R}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text x="${HC.L-6}" y="${(y+3).toFixed(1)}" text-anchor="end">${fm(v,m.d)}</text>`}
 if(m.ref!=null){const y=Y(m.ref);g+=`<line x1="${HC.L}" x2="${HC.W-HC.R}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--accent)" stroke-dasharray="4 3" opacity=".7"/>`}
 [0,Math.floor((n-1)/2),n-1].filter((v,i,a)=>a.indexOf(v)===i).forEach((i,k,a)=>{g+=`<text x="${X(i).toFixed(1)}" y="${HC.H-8}" text-anchor="${i===0&&n>1?'start':i===n-1&&n>1?'end':'middle'}">${H[i].lbl}</text>`});
 m.s.forEach((sk,j)=>{const pts=H.map((h,i)=>X(i).toFixed(1)+','+Y(h[sk]).toFixed(1)).join(' ');g+=`<polyline points="${pts}" fill="none" stroke="${m.c[j]}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="${X(n-1).toFixed(1)}" cy="${Y(H[n-1][sk]).toFixed(1)}" r="3.5" fill="${m.c[j]}"/>`});
 g+=`<line id="hx" y1="${HC.T}" y2="${HC.H-HC.B}" stroke="var(--ink)" opacity=".35" visibility="hidden"/>`+m.s.map((s,j)=>`<circle id="hd${j}" r="4.5" fill="${m.c[j]}" stroke="var(--surface)" stroke-width="2" visibility="hidden"/>`).join('')+`<rect id="hov" x="0" y="0" width="${HC.W}" height="${HC.H}" fill="transparent"/>`;
 $('#hist').innerHTML=g;
 $('#htabs').innerHTML=HM.map(x=>`<button class="chip" data-act="htab" data-k="${x.k}" aria-pressed="${x.k===histK}">${x.n}</button>`).join('')}
function histMove(e){const{H,m,n,X,Y}=histScale(),svg=$('#hist'),rc=svg.getBoundingClientRect();
 const x=(e.clientX-rc.left)/rc.width*HC.W,i=cl(Math.round((x-HC.L)/((HC.W-HC.L-HC.R)/Math.max(1,n-1))),0,n-1);
 const hx=$('#hx');hx.setAttribute('x1',X(i));hx.setAttribute('x2',X(i));hx.setAttribute('visibility','visible');
 m.s.forEach((s,j)=>{const d=$('#hd'+j);d.setAttribute('cx',X(i));d.setAttribute('cy',Y(H[i][s]));d.setAttribute('visibility','visible')});
 showTip(`<b>${H[i].lbl}</b><br>`+m.s.map((s,j)=>`${m.l[j]}: ${fm(H[i][s],m.d)}${m.u}`).join('<br>'),e.clientX,e.clientY)}
function histOut(){hideTip();const hx=$('#hx');if(hx){hx.setAttribute('visibility','hidden');for(let j=0;j<2;j++){const d=$('#hd'+j);if(d)d.setAttribute('visibility','hidden')}}}
function seatsPos(total,rows,rIn,rOut,cx,cy){const rs=[];for(let j=0;j<rows;j++)rs.push(rIn+(rOut-rIn)*(rows===1?0:j/(rows-1)));
 const sr=rs.reduce((a,v)=>a+v,0),ns=rs.map(r=>Math.round(total*r/sr));ns[rows-1]+=total-ns.reduce((a,v)=>a+v,0);const pts=[];
 rs.forEach((r,j)=>{for(let i=0;i<ns[j];i++){const th=Math.PI*(1-(ns[j]===1?.5:i/(ns[j]-1)));pts.push({th,r,x:cx+r*Math.cos(th),y:cy-r*Math.sin(th)})}});
 pts.sort((a,b)=>b.th-a.th||a.r-b.r);return pts}
function hemiSvg(key,total,rows,rIn,rOut,cx,cy,rad,vw,vh,label){
 const law=S.selLaw?LAW[S.selLaw]:null,P=law?BL.map((b,i)=>pYes(S,law,i)):null,pts=seatsPos(total,rows,rIn,rOut,cx,cy);let k=0,out='';
 BL.forEach((b,i)=>{const nseat=S.seats[b.id][key];for(let a=0;a<nseat&&k<pts.length;a++,k++){const p=pts[k];out+=`<circle data-b="${b.id}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${rad}" fill="${b.col}" opacity="${P?(.22+.78*P[i]).toFixed(2):.92}"/>`}});
 let ctr='';if(law){const pr=proj(S,law),y=key==='cd'?pr.c:pr.s,nd=key==='cd'?pr.n.c:pr.n.s;ctr=`<text x="${cx}" y="${cy-8}" text-anchor="middle" style="font:500 15px var(--mono);fill:var(--ink)">${Math.round(y)}</text><text x="${cx}" y="${cy+6}" text-anchor="middle" style="font:500 10px var(--mono);fill:var(--muted)">de ${nd} necessários</text>`}
 return `<p class="sub" style="margin-top:4px">${label}</p><svg class="hemi" viewBox="0 0 ${vw} ${vh}" role="img" aria-label="${label}">${out}${ctr}</svg>`}
function renderHemi(){const law=S.selLaw?LAW[S.selLaw]:null;
 $('#hemiSub').textContent=law?`projeção: ${law.t}`:'composição atual';
 $('#hemis').innerHTML=hemiSvg('cd',513,9,62,142,150,152,3.5,300,160,'Câmara dos Deputados (513)')+hemiSvg('sn',81,3,44,92,100,102,5.2,200,108,'Senado Federal (81)');
 $('#hleg').innerHTML=BL.map((b,i)=>`<span><i style="background:${b.col}"></i>${b.sig} ${S.seats[b.id].cd} · ${S.seats[b.id].sn}</span>`).join('')}
function hemiHover(e){const c=e.target.closest&&e.target.closest('circle[data-b]');if(!c){hideTip();return}
 const i=BL.findIndex(b=>b.id===c.dataset.b),b=BL[i],law=S.selLaw?LAW[S.selLaw]:null;
 showTip(`<b>${b.n}${b.id===S.party?' (seu partido)':''}</b><br>Câmara ${S.seats[b.id].cd} · Senado ${S.seats[b.id].sn}<br>Apoio ao governo: ${fm(blocS(S,i),0)}%`+(law?`<br>Votaria sim: ${fm(pYes(S,law,i)*100,0)}%`:''),e.clientX,e.clientY)}
function mapHover(e){const g=e.target.closest&&e.target.closest('[data-hv],.tl');if(!g){hideTip();return}
 const uf=g.dataset.hv||g.dataset.r,u=UFI[uf],st=S.st[uf],m=curM(),a=st.appr,r=rejOf(S,u,a);
 showTip(`<b>${u.nome}</b><br>${m.n}: ${m.fmt(m.f(u,st))}<br>Aprova ${fm(a,0)}% · Rejeita ${fm(r,0)}%`,e.clientX,e.clientY)}
// UI-1-END
