// UI-3
let indK='idh',indSort='idh';
const SS=(k,v)=>{try{if(v==null)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
// ---- gráfico genérico de linhas ----
function lineChart(id,H,keys,cols,labels,d,u){const W=520,Ht=210,L=40,R=12,T=12,B=26,n=H.length;if(n<2)return '';
 const all=keys.flatMap(k=>H.map(h=>h[k]));let lo=Math.min(...all),hi=Math.max(...all);if(hi-lo<1e-9){lo-=1;hi+=1}const p=(hi-lo)*.12;lo-=p;hi+=p;
 const X=i=>L+i*(W-L-R)/(n-1),Y=v=>T+(1-(v-lo)/(hi-lo))*(Ht-T-B);let g='';
 for(let k=0;k<5;k++){const v=lo+(hi-lo)*k/4,y=Y(v);g+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text x="${L-5}" y="${(y+3).toFixed(1)}" text-anchor="end">${fm(v,d)}</text>`}
 [0,Math.floor((n-1)/2),n-1].forEach((i,k)=>{g+=`<text x="${X(i).toFixed(1)}" y="${Ht-8}" text-anchor="${k===0?'start':k===2?'end':'middle'}">${H[i].lbl}</text>`});
 keys.forEach((k,j)=>{g+=`<polyline points="${H.map((h,i)=>X(i).toFixed(1)+','+Y(h[k]).toFixed(1)).join(' ')}" fill="none" stroke="${cols[j]}" stroke-width="2.2" stroke-linejoin="round"${j>0?' stroke-dasharray="5 3"':''}/><circle cx="${X(n-1).toFixed(1)}" cy="${Y(H[n-1][k]).toFixed(1)}" r="3.5" fill="${cols[j]}"/>`});
 return `<svg class="lc" id="${id}" viewBox="0 0 ${W} ${Ht}" data-keys="${keys.join(',')}" data-d="${d}" data-u="${u||''}" data-lab="${labels.join('|')}" role="img" aria-label="${labels.join(' e ')}">${g}</svg>`}
function lcMove(e){const svg=e.target.closest&&e.target.closest('svg.lc');if(!svg){hideTip();return}const H=svg.id==='tlsvg'?S.hist:S.hist,n=H.length,rc=svg.getBoundingClientRect(),x=(e.clientX-rc.left)/rc.width*520,i=cl(Math.round((x-40)/((520-52)/Math.max(1,n-1))),0,n-1),ks=svg.dataset.keys.split(','),lb=svg.dataset.lab.split('|'),d=+svg.dataset.d;
 let extra='';if(svg.id==='tlsvg'){const ev=(S.log||[]).filter(l=>Math.abs(l.i-i)<=1).map(l=>l.t);if(ev.length)extra='<br>'+ev.slice(0,4).join('<br>')}
 showTip(`<b>${H[i].lbl}</b><br>`+ks.map((k,j)=>`${lb[j]}: ${fm(H[i][k],d)}${svg.dataset.u}`).join('<br>')+extra,e.clientX,e.clientY)}
document.addEventListener('pointermove',lcMove);
// ---- aba Indicadores ----
function indColor(m,v){return `color-mix(in srgb, var(--map-hi) ${cl(m.sc(v)).toFixed(0)}%, var(--map-lo))`}
function indCard(m,now,h0){const v=now[m.k],d=v-h0[m.k],good=m.hi*d>=0,col=good?'var(--good)':'var(--bad)';
 const Hs=S.hist.slice(-24),vals=Hs.map(h=>h[m.k]),lo=Math.min(...vals),hi=Math.max(...vals),r=hi-lo||1;
 const sp=Hs.length>1?`<svg viewBox="0 0 100 20" preserveAspectRatio="none"><polyline fill="none" stroke="${col}" stroke-width="1.5" vector-effect="non-scaling-stroke" points="${vals.map((x,i)=>(i/(vals.length-1)*100).toFixed(1)+','+(18-(x-lo)/r*16).toFixed(1)).join(' ')}"/></svg>`:'';
 return `<button class="k ind ${m.k===indK?'sel':''}" data-act="ind" data-k="${m.k}" aria-pressed="${m.k===indK}"><span>${m.n}</span><b>${m.fmt(v)}</b><small class="${Math.abs(d)<.0005?'':good?'up':'dn'}">${Math.abs(d)<.0005?'estável':(d>=0?'▲ ':'▼ ')+m.fmt(Math.abs(d)).replace(/ .*/,'')} desde 2027</small>${sp}</button>`}
function renderInd(){if(!S.hist.length)return;const now=indNat(S),h0=S.hist[0],m=INDM[indK];
 $('#indCards').innerHTML=IND.map(x=>indCard(x,now,h0)).join('');
 const st=UF.map(u=>({u,r:indOf(S,u.uf)}));
 $('#imap').setAttribute('viewBox',`0 0 ${GEOW} ${GEOH}`);
 $('#imap').innerHTML=UF.map(u=>{const r=st.find(x=>x.u.uf===u.uf).r;return `<path class="tl" data-act="isel" data-r="${u.uf}" data-iv="${u.uf}" d="${GEO[u.uf].d}" style="fill:${indColor(m,r[m.k])}" tabindex="0" role="button" aria-label="${u.nome}: ${m.n} ${m.fmt(r[m.k])}"/>`}).join('')+`<path id="ihl" fill="none" d="${GEO[sel].d}"/>`+UF.filter(u=>GEO[u.uf].a>650).map(u=>`<text class="ml" x="${GEO[u.uf].c[0]}" y="${GEO[u.uf].c[1]+3}">${u.uf}</text>`).join('');
 $('#iSub').textContent=m.t;$('#iDesc').innerHTML=`${m.d0} <b>Como funciona:</b> ${m.how}`;
 $('#iLg').textContent=m.hi>0?'pior → melhor':'melhor → pior (escala invertida: escuro é pior)';
 $('#iHist').innerHTML=lineChart('ihs',S.hist,[m.k],['var(--accent)'],[m.n],m.d,'');
 const cols=['idh','le','im','pov','hom','mys'],cm=cols.map(k=>INDM[k]);
 const rows=[...st].sort((a,b)=>{const m2=INDM[indSort];return m2.hi*(b.r[indSort]-a.r[indSort])});
 $('#iTable').innerHTML=`<thead><tr><th>UF</th>${cm.map(c=>`<th><button class="th ${c.k===indSort?'on':''}" data-act="isort" data-k="${c.k}">${c.n}</button></th>`).join('')}</tr></thead><tbody>${rows.map(({u,r})=>`<tr class="${u.uf===sel?'on':''}" data-act="isel" data-r="${u.uf}"><td><b>${u.uf}</b></td>${cm.map(c=>`<td style="background:${indColor(c,r[c.k])}33;${c.k==='pov'&&r.pov>35?'color:var(--bad);font-weight:600':''}">${c.fmt(r[c.k]).replace(' anos','').replace('/100 mil','').replace(' ‰','')}</td>`).join('')}</tr>`).join('')}</tbody>`;
 const rg=Object.keys(RG).map(k=>{const us=UF.filter(u=>u.reg===k),pt=us.reduce((a,u)=>a+S.st[u.uf].pop,0),avg=f=>us.reduce((a,u)=>a+indOf(S,u.uf)[f]*S.st[u.uf].pop,0)/pt;return `<tr><td><b>${RG[k]}</b></td><td>${fm(avg('idh'),3)}</td><td>${fm(avg('le'),1)}</td><td>${fm(avg('im'),1)}</td><td>${fm(avg('pov'),1)}%</td></tr>`}).join('');
 $('#iReg').innerHTML=`<thead><tr><th>Região</th><th>IDH</th><th>Vida</th><th>Mort. inf.</th><th>Pobreza</th></tr></thead><tbody>${rg}</tbody>`;
 const r=indOf(S,sel),u=UFI[sel],pk=UF.filter(x=>indOf(S,x.uf).pov>35).map(x=>x.uf);
 $('#iState').innerHTML=`<h3>${u.nome}</h3><p class="sub">${RG[u.reg]} · vocação: ${vocMain(sel)}</p><div class="stats">`+IND.map(c=>`<div><span>${c.n}</span><b>${c.fmt(r[c.k])}</b><small>Brasil: ${c.fmt(now[c.k])}</small></div>`).join('')+`</div>${r.pov>35?'<p class="warnbox">Bolsão de pobreza: mais de 35% da população abaixo da linha de pobreza.</p>':''}${pk.length?`<p class="sub">Estados com bolsões de pobreza: ${pk.join(', ')}.</p>`:'<p class="sub">Nenhum estado acima de 35% de pobreza.</p>'}`}
// ---- vocação econômica no cartão do estado ----
function vocHTML(uf){const v=VOC[uf],L=lawSum(S),R=S.reg&&S.reg.vs?S.reg.vs:null,dm=[.6,1,1.4][S.diff==null?1:S.diff],sh=vocG(uf,R)*dm+vocG(uf,L.vs);
 return `<div class="voc"><span class="sub">Vocação econômica</span><div class="vbar">${VK.map((k,i)=>`<i style="flex:${Math.max(v[i],.5)}" class="v${k}" title="${VN[k]} ${v[i]}%"></i>`).join('')}</div><div class="vleg">${VK.map((k,i)=>`<span><i class="v${k}"></i>${VN[k]} ${v[i]}%</span>`).join('')}</div>${Math.abs(sh)>=.0005?`<p class="sub">Choques e leis em vigor afetam este estado em <b class="${sh>=0?'up':'dn'}">${sg(sh*100,2)} p.p.</b> de crescimento ao ano por causa da vocação.</p>`:''}</div>`}
function indMini(uf){const r=indOf(S,uf);return `<div class="stats">${['idh','le','im','pov'].map(k=>`<div><span>${INDM[k].n}</span><b>${INDM[k].fmt(r[k])}</b></div>`).join('')}</div>${r.pov>35?'<p class="warnbox">Bolsão de pobreza neste estado.</p>':''}`}
// ---- aba Coalizão ----
function renderCoal(){if(!S.coal)return;const cs=S.coal,seats=cs.reduce((a,id)=>a+S.seats[id].cd,0),sn=cs.reduce((a,id)=>a+S.seats[id].sn,0),fm0=freeMin(S);
 const risk=scandalP(S),rl=risk<.04?['good','baixo']:risk<.07?['warn','médio']:['bad','alto'];
 $('#coalSub').innerHTML=`Base: <b>${seats}</b> de 513 deputados (${fm(seats/513*100,0)}%) e <b>${sn}</b> de 81 senadores · ministérios livres: <b>${fm0}</b> de ${NMIN} · risco de escândalo <span class="pill ${rl[0]}">${rl[1]}</span>`;
 const rows=[...BL].sort((a,b)=>S.seats[b.id].cd-S.seats[a.id].cd).map(b=>{const id=b.id,inn=cs.includes(id),own=id===S.party,sat=S.sat[id],mn=S.mins[id]||0,i=BL.indexOf(b),f=fid(S,i),d=S.ap<1?'disabled':'';
  const fair=inn?NMIN*S.seats[id].cd/(seats||1):0;
  return `<div class="crow ${inn?'in':''}"><div class="cn"><i style="background:${b.col}"></i><b>${b.sig}</b><span class="sub">${S.seats[id].cd} dep. · ${S.seats[id].sn} sen. · ${ideoName(b.pos).toLowerCase()}</span>${own?'<span class="pill good">seu partido</span>':inn?'<span class="pill good">base</span>':'<span class="pill">fora da base</span>'}</div>
  ${inn?`<div class="cs"><div class="bar"><div class="track"><i style="width:${sat.toFixed(0)}%;background:${sat<35?'var(--bad)':sat<50?'var(--warn)':''}"></i></div><span>${own?'líder':fm(sat,0)}</span></div><small class="sub">${own?'':`fidelidade ${f>=0?'+':'−'}${fm(Math.abs(f)*100,0)} p.p. de votos · cota justa ${fm(fair,1)} min.`}</small></div>
  <div class="ctl"><button data-act="minadj" data-id="${id}" data-d="-1" aria-label="Tirar ministério de ${b.sig}" ${mn<1?'disabled':''}>−</button><output>${mn} min.</output><button data-act="minadj" data-id="${id}" data-d="1" aria-label="Dar ministério a ${b.sig}" ${fm0<1||mn>=6?'disabled':''}>+</button></div>
  ${own?'':`<button class="btn" data-act="coalout" data-id="${id}">Expulsar da base</button>`}`
  :`<div class="cs"><small class="sub">Distância ideológica: ${fm(Math.abs(S.x-b.pos),1)}. Entra com 1 ministério.</small></div><div></div><button class="btn" data-act="coalin" data-id="${id}" ${d}${fm0<1?' disabled':''}>Convidar (1 ponto)</button>`}</div>`}).join('');
 $('#coalList').innerHTML=rows;
 const rv=S.rv,rp=rvPoll(S),me=100-rp;
 $('#rivalBox').innerHTML=rv?`<p><b>${rv.n}</b> (${BLI[rv.p].sig}, ${ideoName(BLI[rv.p].pos).toLowerCase()}) lidera a oposição. Ele cresce quando o governo vai mal e tem seus próprios altos e baixos.</p><div class="vrow" style="grid-template-columns:70px 1fr 46px"><span>Você</span><div class="vtrack"><i style="width:${me.toFixed(0)}%"></i><u></u></div><b>${fm(me,0)}%</b></div><div class="vrow" style="grid-template-columns:70px 1fr 46px"><span>${rv.n.split(' ')[0]}</span><div class="vtrack"><i style="width:${rp.toFixed(0)}%;background:var(--bad)"></i><u></u></div><b>${fm(rp,0)}%</b></div>`+(S.hist.length>2?lineChart('rvs',S.hist.map(h=>({lbl:h.lbl,me:100-h.rv,rv:h.rv})),['me','rv'],['var(--accent)','var(--bad)'],['Você','Rival'],0,'%'):''):''}
function coalAct(a,id,d){if(a==='minadj'){if(d>0){if(freeMin(S)<1||(S.mins[id]||0)>=6)return '';S.mins[id]++;S.sat[id]=cl(S.sat[id]+6)}else{if((S.mins[id]||0)<1)return '';S.mins[id]--;S.sat[id]=cl(S.sat[id]-8)}return d>0?`Ministério entregue ao ${BLI[id].sig}.`:`Ministério retirado do ${BLI[id].sig}: o partido fica insatisfeito.`}
 if(a==='coalin'){if(S.ap<1||freeMin(S)<1)return 'Sem pontos de articulação ou sem ministérios livres.';S.ap--;S.mins[id]=1;joinCoal(S,id);return `${BLI[id].sig} entrou na base com 1 ministério.`}
 if(a==='coalout'){leaveCoal(S,id,'expulso por você');S.news=[];return `${BLI[id].sig} saiu da base.`}return ''}
// ---- tela final: linha do tempo ----
const KIND={law:['Lei aprovada','circle','var(--accent)'],reg:['Choque externo','diamond','var(--cyan)'],crise:['Crise','tri','var(--bad)'],pos:['Boa notícia','plus','var(--good)'],elec:['Eleição','sq','#fff'],coal:['Coalizão','ring','#b58cff']};
function mark(sh,x,y,c){const s=5;return sh==='circle'?`<circle cx="${x}" cy="${y}" r="3.4" fill="${c}"/>`:sh==='diamond'?`<path d="M${x} ${y-s}L${x+s} ${y}L${x} ${y+s}L${x-s} ${y}Z" fill="${c}"/>`:sh==='tri'?`<path d="M${x} ${y-s}L${x+s} ${y+s-1}L${x-s} ${y+s-1}Z" fill="${c}"/>`:sh==='plus'?`<path d="M${x-s} ${y}H${x+s}M${x} ${y-s}V${y+s}" stroke="${c}" stroke-width="2.4"/>`:sh==='sq'?`<rect x="${x-3.5}" y="${y-3.5}" width="7" height="7" fill="${c}"/>`:`<circle cx="${x}" cy="${y}" r="3.6" fill="none" stroke="${c}" stroke-width="2"/>`}
function timelineSVG(){const H=S.hist,n=H.length,W=520,Ht=300,L=44,R=12,T=12,lane=[...Object.keys(KIND)],LB=lane.length*13+22;if(n<2)return '';
 const v=H.map(h=>h.pc),lo0=Math.min(...v),hi0=Math.max(...v),p=(hi0-lo0)*.1||1,lo=lo0-p,hi=hi0+p,cb=Ht-LB;
 const X=i=>L+i*(W-L-R)/(n-1),Y=q=>T+(1-(q-lo)/(hi-lo))*(cb-T);let g='';
 for(let k=0;k<5;k++){const q=lo+(hi-lo)*k/4,y=Y(q);g+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text x="${L-5}" y="${(y+3).toFixed(1)}" text-anchor="end">${fm(q,0)}</text>`}
 g+=`<polyline points="${H.map((h,i)=>X(i).toFixed(1)+','+Y(h.pc).toFixed(1)).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linejoin="round"/>`;
 let i=0;while(i<n){if(H[i].suc||H[i].int){let j=i;while(j+1<n&&(H[j+1].suc||H[j+1].int))j++;const a0=Math.max(0,i-1),lab=H[i].suc?'depois de você':'interregno';g+=`<polyline points="${H.slice(a0,j+1).map((h,k)=>X(a0+k).toFixed(1)+','+Y(h.pc).toFixed(1)).join(' ')}" fill="none" stroke="var(--warn)" stroke-width="2.6" stroke-dasharray="6 4"/><line x1="${X(a0)}" x2="${X(a0)}" y1="${T}" y2="${cb}" stroke="var(--warn)" stroke-dasharray="2 3" opacity=".7"/><text x="${X(a0)+4}" y="${T+9}" style="fill:var(--warn)">${lab}</text>`;i=j+1}else i++}
 ELECT.concat(MUN).forEach(y=>{const i=H.findIndex(h=>h.lbl==='T4/'+y);if(i>0)g+=`<line x1="${X(i)}" x2="${X(i)}" y1="${T}" y2="${cb}" stroke="var(--line)" stroke-dasharray="1 4"/>`});
 [0,Math.floor((n-1)/2),n-1].forEach((i,k)=>{g+=`<text x="${X(i).toFixed(1)}" y="${cb+11}" text-anchor="${k===0?'start':k===2?'end':'middle'}">${H[i].lbl}</text>`});
 lane.forEach((k,j)=>{const y=cb+22+j*13;g+=`<text x="${L-5}" y="${y+3}" text-anchor="end" style="font-size:8.5px">${KIND[k][0].split(' ')[0]}</text><line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="var(--line)" opacity=".5"/>`;(S.log||[]).filter(l=>l.k===k).forEach(l=>{g+=mark(KIND[k][1],X(cl(l.i,0,n-1)).toFixed(1),y,KIND[k][2])})});
 return `<svg class="lc" id="tlsvg" viewBox="0 0 ${W} ${Ht}" data-keys="pc" data-d="1" data-u=" mil" data-lab="PIB per capita (R$ mil)" role="img" aria-label="Linha do tempo do PIB per capita com eleições, choques, crises e leis">${g}</svg>`}
function weighHTML(){const L=legacy(S),nm=['Crescimento per capita','Capital humano, saúde e infraestrutura','Solidez fiscal','Equilíbrio regional','Inflação e desemprego','Nota de crédito'],wt=[40,15,15,10,10,10];
 const items=L.s.map((v,i)=>({n:nm[i],v,w:wt[i],pts:v*wt[i]/100,lost:(100-v)*wt[i]/100}));
 const up=[...items].sort((a,b)=>b.pts-a.pts).slice(0,2),dn=[...items].sort((a,b)=>b.lost-a.lost).slice(0,2);
 const lg=(S.log||[]).filter(l=>l.k==='reg').map(l=>l.t),cr=(S.log||[]).filter(l=>l.k==='crise').length,H=S.hist.slice(1),w=H.reduce((a,h,i)=>h.g<H[a].g?i:a,0),bq=H.reduce((a,h,i)=>h.g>H[a].g?i:a,0);
 const i0=S.hist[0],i1=S.hist[S.hist.length-1];
 const dl=(k)=>{const m=INDM[k],a=i0[k],b=i1[k];return `<div><span>${m.n}</span><b>${m.fmt(b)}</b><small class="${m.hi*(b-a)>=0?'up':'dn'}">de ${m.fmt(a)}</small></div>`};
 return `<h3 style="margin-top:14px">O que mais pesou</h3><div class="weigh"><div><p class="sub">Mais ajudou na nota</p>${up.map(x=>`<p><b>${x.n}</b>: ${fm(x.v,0)}/100 (${fm(x.pts,0)} de ${x.w} pontos)</p>`).join('')}</div><div><p class="sub">Mais custou</p>${dn.map(x=>`<p><b>${x.n}</b>: ${fm(x.v,0)}/100 (perdeu ${fm(x.lost,0)} de ${x.w} pontos)</p>`).join('')}</div></div>
 <p class="sub">Pior trimestre de crescimento: ${H[w].lbl} (${sg(H[w].g)}%). Melhor: ${H[bq].lbl} (${sg(H[bq].g)}%). Crises enfrentadas: ${cr}. Choques externos: ${lg.length?lg.join(', '):'nenhum'}. Leis aprovadas: ${S.laws.length}.</p>
 <div class="stats">${['idh','le','im','pov','hom','gini'].map(dl).join('')}</div>`}
function shareText(sc){return `Simulador de Política · ${S.name?S.name+' · ':''}Dura · ${BLI[S.party].sig} · nota ${sc}/100 · PIB per capita ${sg(legacy(S).pcg,0)}% · código ${mkCode(S)}`}
function timelineHTML(){const leg=Object.keys(KIND).map(k=>`<span><svg width="14" height="14" viewBox="-7 -7 14 14">${mark(KIND[k][1],0,0,KIND[k][2])}</svg>${KIND[k][0]}</span>`).join('');
 return `<h3 style="margin-top:14px">Linha do tempo · PIB per capita (R$ mil)</h3>${timelineSVG()}<div class="hleg" style="margin-bottom:6px">${leg}</div>`}
function succHTML(){const s=S.succ;if(!s)return '';const L=legacy(S);
 return `<div class="tipbox"><b>Depois de você</b>: ${s.mode==='lose'?'você perdeu a eleição e':'você deixou o cargo e'} assumiu <b>${s.who}</b> (${s.from} até ${s.lbl}). Seu governo vale 65% da nota final (${s.s0}) e o que aconteceu depois, 35% (${L.score}).${s.note.length?'<br>'+s.note.join(' '):''}</div>`}
// ---- tutorial ----
const TUT=[
['Seu objetivo','Enriquecer o país em 28 anos (2027 a 2054). A nota final de 0 a 100 mede o crescimento do PIB per capita, o capital humano, a saúde das contas, o equilíbrio entre regiões, a estabilidade e a nota de crédito. Popularidade é só o meio: sem ela você perde a eleição.'],
['Cada trimestre','Ajuste os aportes por área (nacionais ou por estado) e os impostos, escolha até 2 projetos de lei para votação e use até 3 pontos de articulação. Depois clique em Encerrar trimestre.'],
['Congresso e coalizão','Na aba Coalizão você negocia ministérios com os partidos da base. Partidos insatisfeitos votam contra e podem deixar o governo. Ministérios demais para o Centrão aumentam o risco de escândalo.'],
['Eleições e sucessão','Há eleições gerais a cada 4 anos e municipais no meio do mandato, e o limite é de dois mandatos seguidos (leis podem mudar isso): depois dele, outro governa por 4 anos e você tenta voltar. Se perder ou desistir, o país continua com seu sucessor e a nota final também conta o que acontece depois.'],
['Indicadores e regiões','A aba Indicadores mostra IDH, mortalidade infantil, saúde, pobreza e outros por estado. Cada estado tem uma vocação (agro, indústria, mineração, serviços) e reage de forma diferente a choques e leis.'],
['Atalhos','E encerra o trimestre · 1 a 4 troca de aba · M abre o menu · ? mostra esta ajuda. Em Menu você ativa o modo para daltônicos.']];
let tutI=0;
function showTut(i){tutI=i;const t=TUT[i];modal(`<p class="eyebrow">Como jogar · ${i+1} de ${TUT.length}</p><h2>${t[0]}</h2><p>${t[1]}</p><div style="display:flex;gap:8px;margin-top:12px">${i>0?'<button class="btn" data-act="tut" data-i="'+(i-1)+'">Voltar</button>':''}<button class="btn primary" data-act="${i<TUT.length-1?'tut':'tutend'}" data-i="${i+1}" style="flex:1">${i<TUT.length-1?'Próximo':'Entendi'}</button></div>`)}
// ---- daltonismo, atalhos ----
function setCB(on){document.documentElement.dataset.cb=on?'1':'';SS('simpol-cb',on?'1':'0')}
document.addEventListener('keydown',e=>{if(e.target.matches&&e.target.matches('input,textarea,select'))return;if(e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase(),open=!$('#modal').hidden;
 if(open){if(k==='escape'&&$('#sheet [data-act=close]'))$('#sheet [data-act=close]').click();return}
 if(k==='e'){const b=$('#btnEnd');if(b&&!b.disabled)b.click()}
 else if(k==='m')menu();else if(k==='?')showTut(0);
 else if(['1','2','3','4'].includes(k))setTab(['gov','leis','coal','ind'][+k-1]||'gov')});
