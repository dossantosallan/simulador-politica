// UI-2
const KEY='simpol-v5',BEST='simpol-v3-best',NQ=(END-2027+1)*4;
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const loadSave=()=>{try{const t=localStorage.getItem(KEY);return t?JSON.parse(t):null}catch(e){return null}};
const wipe=()=>{try{localStorage.removeItem(KEY)}catch(e){}};
const getBest=()=>{try{return +localStorage.getItem(BEST)||0}catch(e){return 0}};
const setBest=v=>{try{if(v>getBest())localStorage.setItem(BEST,v)}catch(e){}};
let startDiff=2,startSeed=null,playerName=(()=>{try{return localStorage.getItem('simpol-name')||''}catch(e){return ''}})();
const lbl=()=>`T${S.q}/${S.ano}`;
const cls=(v,a,b)=>v>=a?'good':v>=b?'warn':'bad';
const isElectionQ=()=>ELECT.includes(S.ano)&&S.q===4;
function spark(key,c){const H=S.hist.slice(-24);if(H.length<2)return '';const v=H.map(h=>h[key]),lo=Math.min(...v),hi=Math.max(...v),r=hi-lo||1;
 return `<svg viewBox="0 0 100 20" preserveAspectRatio="none"><polyline fill="none" stroke="${c}" stroke-width="1.5" vector-effect="non-scaling-stroke" points="${v.map((x,i)=>(i/(v.length-1)*100).toFixed(1)+','+(18-(x-lo)/r*16).toFixed(1)).join(' ')}"/></svg>`}
function kpi(k,label,val,small,c,key){const col=c==='good'?'var(--good)':c==='bad'?'var(--bad)':c==='warn'?'var(--warn)':'var(--cyan)';
 return `<button class="k ${c}" data-act="info" data-k="${k}"><span>${label}<i>i</i></span><b>${val}</b><small>${small}</small>${spark(key,col)}</button>`}
function renderHead(){const ev=[...ELECT.map(y=>[y,'geral']),...MUN.map(y=>[y,'municipal'])].filter(e=>e[0]>=S.ano).sort((a,b)=>a[0]-b[0])[0];
 $('#eyebrow').textContent=`Brasil · ${lbl()} · mandato ${S.mandato} de 7 · ${limTxt(S)} · ${ev?'próxima eleição: '+ev[1]+' '+ev[0]:'último mandato'}`;
 $('#lineSub').textContent=`${S.name?S.name+' · ':''}${BLI[S.party].sig} · ${ideoName(S.x)}${S.reg?' · '+S.reg.n:''}${S.risk>0?' · risco de impeachment '+S.risk+'/4':''}${S.inst>=12?' · risco institucional '+fm(S.inst,0):''}`;
 $('#btnEnd').textContent=`Encerrar ${lbl()}`;$('#score').textContent=legacy(S).score}
function renderKpis(){const gd=gdp(S),h=S.hist[S.hist.length-1],dr=S.debt/gd*100,ap=natAppr(S),pc=gd/popSum(S),F=fiscal(S);
 $('#kpis').innerHTML=
 kpi('pib','PIB',`R$ ${fm(gd/1000,1)} tri`,`${fm(popSum(S),0)} mi hab.`,'','pib')+
 kpi('pc','PIB per capita',`R$ ${fm(pc,1)} mil`,`${sg((pc/S.pc0-1)*100,0)}% desde 2027`,pc/S.pc0>=1.1?'good':pc/S.pc0>=1?'warn':'bad','pc')+
 kpi('g','Crescimento',sg(h.g)+'%','anualizado',h.g>=2.5?'good':h.g>=1?'warn':'bad','g')+
 kpi('infl','Inflação',fm(S.infl)+'%','meta 3 a 5%',S.infl<=5.5?'good':S.infl<=7?'warn':'bad','infl')+
 kpi('unem','Desemprego',fm(S.unem)+'%','taxa nacional',S.unem<=7?'good':S.unem<=9.5?'warn':'bad','unem')+
 kpi('dr','Dívida/PIB',fm(dr,0)+'%','bruta',dr<=75?'good':dr<=95?'warn':'bad','dr')+
 kpi('rate','Juros',fm(F.rate*100)+'%',`R$ ${fm(F.intr,0)} bi/ano`,F.rate<=.085?'good':F.rate<=.105?'warn':'bad','rate')+
 kpi('rt','Nota de crédito',ratingLetter(S.rt),`índice ${fm(S.rt,0)}`,S.rt>=58?'good':S.rt>=35?'warn':'bad','rt')+
 kpi('I','Investimento privado',fm(S.I)+'%','do PIB',S.I>=15?'good':S.I>=12.5?'warn':'bad','I')+
 kpi('appr','Aprovação',fm(ap,0)+'%',`rejeição ${fm(natRej(S),0)}%`,cls(ap,48,40),'appr')}
function sectorRows(uf){const u=UFI[uf],g=S.st[uf],cap=lawSum(S).cap;
 return SEC.map(s=>{const v=g.idx[s.id],d=g.d[s.id]||0,m=g.m[s.id],al=Math.min(m,cap)*base(S,u,s),dp=(Math.min(m,cap)-1)*100;
  return `<div class="srow"><div class="top"><button class="sname" data-act="sinfo" data-k="${s.id}">${s.nome}</button><div class="ctl"><button data-act="adj" data-r="${uf}" data-s="${s.id}" data-d="-.05" aria-label="Reduzir ${s.nome}">−</button><output>R$ ${fm(al)} bi <em>${Math.abs(dp)<.5?'base':sg(dp,0)+'%'}</em></output><button data-act="adj" data-r="${uf}" data-s="${s.id}" data-d=".05" aria-label="Aumentar ${s.nome}">+</button></div></div>
  <div class="bar"><div class="track"><i style="width:${v.toFixed(0)}%"></i></div><span>${fm(v,0)} <em class="${d>=0?'up':'dn'}">${d>=0?'▲':'▼'}${fm(Math.abs(d),2)}</em></span></div></div>`}).join('')}
function renderState(){const u=UFI[sel],g=S.st[sel],gd=gdp(S),pcN=gd/popSum(S),pc=g.pib/g.pop,a=g.appr,r=rejOf(S,u,a),v=shareOf(S,u,a),L=lawSum(S);
 const gcl=g.rel>=60?'up':g.rel<40?'dn':'';
 $('#stCard').innerHTML=`<div class="cardhead"><div><h2>${u.nome}</h2><p class="sub">${RG[u.reg]} · ${fm(g.pop,2)} mi hab. · ${u.dep} deputados · 3 senadores</p></div><span class="pill ${cls(v,52,46)}">voto projetado ${fm(v,0)}%</span></div>
 <div class="stats"><div><span>Aprova / rejeita</span><b>${fm(a,0)}% / ${fm(r,0)}%</b><small>eleitorado ${ideoName(u.lean).toLowerCase()}</small></div>
 <div><span>PIB</span><b>R$ ${fm(g.pib,0)} bi</b><small>${fm(g.pib/gd*100)}% do país</small></div>
 <div><span>PIB per capita</span><b>R$ ${fm(pc,1)} mil</b><small>${fm(pc/pcN,2)}× a média</small></div>
 <div><span>Crescimento</span><b>${sg(g.g*100)}%</b><small>anualizado</small></div>
 <div><span>Governador</span><b>${g.gov?BLI[g.gov].sig:'—'}</b><small class="${gcl}">${g.gov===S.party?'seu partido':inCoal(S,g.gov)?'base':'oposição'} · relação ${fm(g.rel,0)}/100 · execução ${fm((.9+.2*g.rel/100)*100,0)}%</small></div></div>
 ${vocHTML(sel)}${indMini(sel)}
 <div class="acts"><button class="btn" data-act="act" data-k="gov" data-a="${sel}" ${S.ap<1?'disabled':''}>Reunião com o governador<small>1 ponto · relação +14</small></button><button class="btn" data-act="act" data-k="reg" data-a="${u.reg}" ${S.ap<1?'disabled':''}>Agenda com o ${RG[u.reg]}<small>1 ponto · relação +8 na região</small></button></div>
 <div class="cardhead"><h3>Aportes do estado</h3><div class="ctl"><button data-act="adjAll" data-r="${sel}" data-d="-.05" aria-label="Reduzir todas as áreas">−</button><output>todas as áreas</output><button data-act="adjAll" data-r="${sel}" data-d=".05" aria-label="Aumentar todas as áreas">+</button></div></div>
 ${L.cap<2?`<p class="warnbox">Arcabouço fiscal em vigor: aportes limitados a ${fm(L.cap*100,0)}% da base.</p>`:''}
 <p class="sub">Clique no nome de uma área para ver dicas.</p><div>${sectorRows(sel)}</div>`}
function billHTML(id){const l=LAW[id],pr=proj(S,l),n=pr.n,on=S.sent.includes(id),ok=pr.c>=n.c&&pr.s>=n.s,close=pr.c>=n.c*.93&&pr.s>=n.s*.93;
 const st=(S.fl&&S.fl.refer&&l.bold&&popSup(S,l)>=55)?['good','Passa por referendo']:ok?['good','Maioria provável']:close?['warn','Disputa apertada']:['bad','Votos insuficientes'];
 const bar=(v,nd,t)=>`<div class="pj"><span>${t}</span><div class="t"><i style="width:${cl(v/(t==='Câmara'?513:81)*100).toFixed(0)}%"></i><u style="left:${(nd/(t==='Câmara'?513:81)*100).toFixed(1)}%"></u></div><b>${Math.round(v)}/${nd}</b></div>`;
 const ps=popSup(S,l),pb=l.bold?`<div class="pj"><span>Popular</span><div class="t"><i style="width:${ps.toFixed(0)}%;background:${ps<50?'var(--bad)':'var(--good)'}"></i><u style="left:50%"></u></div><b>${fm(ps,0)}%</b></div><p class="sub">${ps<50?'Se aprovada agora, provoca ampla rejeição popular e protestos.':'Apoio popular suficiente para aprovar sem desgaste.'}</p>`:'';
 return `<div class="bill ${S.selLaw===id?'on':''}" data-act="lawsel" data-id="${id}"><div class="tags"><span class="pill">${l.tipo}</span>${l.bold?'<span class="pill warn">Ousada · exige 3/5</span>':''}<span class="pill">${ideoName(l.b)}</span><span class="pill ${st[0]}">${st[1]}</span></div><h4>${l.t}</h4><p>${l.d}</p><p class="hint"><b>Efeito:</b> ${l.h}</p>${bar(pr.c,n.c,'Câmara')}${bar(pr.s,n.s,'Senado')}${pb}
 <div style="margin-top:8px"><button class="btn ${on?'primary':''}" data-act="send" data-id="${id}">${on?'Enviado para votação (clique para retirar)':'Enviar para votação neste trimestre'}</button></div></div>`}
let lawFilter='disp',tabView='gov';
function renderLeis(){const avail=LAWS.filter(l=>!S.laws.includes(l.id)&&(!l.only||(S.x>=l.only[0]&&S.x<=l.only[1])));
 const F=[['disp','Todas disponíveis',avail.length],['bold','Ousadas',avail.filter(l=>l.bold).length],['ord','Comuns',avail.filter(l=>!l.bold).length],['vig','Em vigor',S.laws.length]];
 const ids=lawFilter==='vig'?S.laws:avail.filter(l=>lawFilter==='bold'?l.bold:lawFilter==='ord'?!l.bold:true).map(l=>l.id);
 $('#leisSub').textContent=`${S.sent.length} de 2 enviados neste trimestre · ${S.ap} pontos de articulação (use o painel Governo para negociar)`;
 $('#leisChips').innerHTML=F.map(f=>`<button class="chip" data-act="lfilter" data-k="${f[0]}" aria-pressed="${f[0]===lawFilter}">${f[1]} (${f[2]})</button>`).join('');
 $('#leisList').innerHTML=ids.length?ids.map(id=>lawFilter==='vig'?`<div class="bill"><div class="tags"><span class="pill good">Em vigor</span>${LAW[id].bold?'<span class="pill warn">Ousada</span>':''}</div><h4>${LAW[id].t}</h4><p class="hint"><b>Efeito:</b> ${LAW[id].h}</p></div>`:billHTML(id)).join(''):'<p class="sub">Nenhum projeto nesta lista.</p>'}
function setTab(k){tabView=k;['gov','leis','coal','ind'].forEach(t=>{$('#tab-'+t).hidden=k!==t});document.querySelectorAll('[data-act=tab]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k));if(k==='leis')renderLeis();if(k==='coal')renderCoal();if(k==='ind')renderInd()}
function renderPauta(){$('#pautaSub').textContent=`${S.sent.length} de 2 enviados · ${S.laws.length} leis em vigor`;
 $('#pauta').innerHTML=S.pauta.length?S.pauta.map(billHTML).join(''):'<p class="sub">Todas as propostas disponíveis já foram aprovadas.</p>'}
function renderActs(){const d=S.ap<1?'disabled':'';
 $('#apBar').innerHTML=`<span>Pontos de articulação</span>`+[0,1,2].map(i=>`<i class="${i<S.ap?'on':''}"></i>`).join('')+`<span>${S.ap}/3</span>`;
 $('#acts').innerHTML=`<button class="btn" data-act="act" data-k="emenda" ${d}>Liberar emendas<small>R$ 8 bi · Centrão +12, vizinhos +5</small></button><button class="btn" data-act="act" data-k="discurso" ${d}>Pronunciamento nacional<small>até +2,5 e cai a cada uso; cansa a população</small></button>`+Object.keys(GRP).map(k=>`<button class="btn" data-act="act" data-k="cargos" data-a="${k}" ${d}>Cargos: ${GRPN[k]}<small>${GRP[k].map(i=>BLI[i].sig).join(', ')} · apoio +14, R$ 3 bi</small></button>`).join('')}
function renderBudget(){const F=fiscal(S);$('#taxOut').textContent=fm((S.tax+F.L.rev)*100)+'% do PIB';
 const Ln=(a,b,c)=>`<dt class="${c||''}">${a}</dt><dd class="${c||''}">${b}</dd>`;
 $('#fiscal').innerHTML=Ln('Receita federal (ano)',`R$ ${fm(F.rev,0)} bi`)+Ln('Despesas obrigatórias',`− R$ ${fm(F.mand,0)} bi`)+Ln('Aportes nas áreas',`− R$ ${fm(F.disc,0)} bi`)+(S.pend.cost?Ln('Decisões do trimestre (pontual)',`${S.pend.cost>0?'−':'+'} R$ ${fm(Math.abs(S.pend.cost),0)} bi`):'')+Ln('Resultado primário',`${F.prim>=0?'+':'−'} R$ ${fm(Math.abs(F.prim),0)} bi`,F.prim>=0?'good':'')+Ln('Juros da dívida',`− R$ ${fm(F.intr,0)} bi`)+Ln('Déficit nominal',`${fm(F.defPct)}% do PIB`,F.defPct>4?'bad':F.defPct<=1?'good':'');
 $('#fwarn').innerHTML=F.defPct>6?'<p class="warnbox">Déficit acima de 6% do PIB. Isso pressiona inflação, juros e dívida.</p>':'';
 $('#nat').innerHTML=SEC.map(s=>{let tot=0,bs=0;UF.forEach(u=>{const b=base(S,u,s);bs+=b;tot+=b*Math.min(S.st[u.uf].m[s.id],F.L.cap)});const dp=(tot/bs-1)*100;
  return `<div class="srow"><div class="top"><button class="sname" data-act="sinfo" data-k="${s.id}">${s.nome}</button><div class="ctl"><button data-act="nat" data-s="${s.id}" data-d="-.05" aria-label="Reduzir ${s.nome} em todos os estados">−</button><output>R$ ${fm(tot,0)} bi <em>${Math.abs(dp)<.05?'base':sg(dp,0)+'%'}</em></output><button data-act="nat" data-s="${s.id}" data-d=".05" aria-label="Aumentar ${s.nome} em todos os estados">+</button></div></div>
  <div class="bar"><div class="track"><i style="width:${avgIdx(S,s.id).toFixed(0)}%"></i></div><span>índice ${fm(avgIdx(S,s.id),0)}</span></div></div>`}).join('')}
function renderFeed(){$('#feed').innerHTML=S.feed.slice(0,10).map(f=>`<li><time>${f.a}</time><span>${f.t}</span></li>`).join('')}
function renderAll(){if(tabView==='leis')renderLeis();if(tabView==='coal')renderCoal();if(tabView==='ind')renderInd();renderHead();renderKpis();renderMap();renderState();renderPauta();renderActs();renderHemi();renderBudget();drawHist();renderRank();renderFeed();$('#tax').value=S.tax*100}
function modal(html){$('#sheet').innerHTML=html;$('#modal').hidden=false;$('#modal').scrollTop=0;document.body.style.overflow='hidden'}
function closeModal(){$('#modal').hidden=true;document.body.style.overflow=''}
const closeBtn='<button class="btn primary" data-act="close" style="margin-top:12px">Fechar</button>';
function infoModal(o,extra){modal(`<p class="eyebrow">Ajuda</p><h2>${o.t}</h2><p>${o.d}</p><p><b>Como funciona:</b> ${o.how}</p><div class="tipbox"><b>Dica:</b> ${o.tip(S)}</div>${extra||''}${closeBtn}`)}
function showLanding(){const sv=loadSave(),best=getBest(),sh=typeof SHOTS!=='undefined'?SHOTS:[];
 modal(`<div class="land"><p class="eyebrow">Brasil · 2027 a 2054</p><h2 class="landh">Simulador de <em>Política</em></h2><p class="lead">Governe o Brasil por até 28 anos, trimestre a trimestre. Negocie com o Congresso, enfrente crises, ganhe (ou perca) eleições e deixe o país melhor do que o encontrou.</p>
 <div class="steps"><div><b>1 · Decida</b><span>Ajuste impostos e aportes por área e por estado, escolha projetos de lei e use a articulação política.</span></div><div><b>2 · Negocie</b><span>Monte a coalizão, distribua ministérios e evite escândalos. Base insatisfeita vota contra.</span></div><div><b>3 · Reaja</b><span>Pandemias, crise de energia, recessões e eleições mudam o jogo. Sua nota final vai de 0 a 100.</span></div></div>
 ${sh.length?`<div class="shots" aria-label="Capturas de tela do jogo">${sh.map(x=>`<figure><img src="${x.src}" alt="${x.alt}" loading="lazy"><figcaption>${x.cap}</figcaption></figure>`).join('')}</div>`:''}
 <div class="cbar" style="margin-top:12px"><button class="btn primary" data-act="landgo">Jogar agora</button><button class="btn" data-act="tut" data-i="0">Como jogar</button>${sv?`<button class="btn" data-act="cont">Continuar jogo salvo (${sv.q?`T${sv.q}/${sv.ano}`:''})</button>`:''}</div>
 <p class="sub" style="margin-top:8px">Dificuldade única: dura. ${best?`Sua melhor nota: ${best}/100. `:''}Os partidos e as situações são fictícios e servem apenas como simulação.</p></div>`)}
function showStart(){const sv=loadSave(),best=getBest(),opts=IDEO.map(i=>{const t=newState(i.x),sh=UF.map(u=>({u,v:shareOf(t,u,t.st[u.uf].appr)})).sort((a,b)=>b.v-a.v),bb=BLI[i.k];
  return `<button class="opt" data-act="start" data-k="${i.k}"><b>${i.n} (${i.sig}) · ${ideoName(i.x)} · ${bb.cd} deputados e ${bb.sn} senadores</b><span>Aprovação inicial ${fm(natAppr(t),0)}% · rejeição ${fm(natRej(t),0)}%</span><span>${i.d}</span><span>Mais forte: ${sh[0].u.nome} (${fm(sh[0].v,0)}%) · Mais fraco: ${sh[sh.length-1].u.nome} (${fm(sh[sh.length-1].v,0)}%)</span></button>`}).join('');
 modal(`<p class="eyebrow">Brasil · 2027 a 2054</p><h2>Escolha seu partido</h2><label class="namebox"><span class="eyebrow">Seu nome</span><input id="nameIn" maxlength="24" autocomplete="off" placeholder="Como você quer ser chamado(a)?" value="${playerName.replace(/"/g,'&quot;')}"></label><p><b>Objetivo: enriquecer o país.</b> Você governa até 28 anos em trimestres, e sua nota final mede o crescimento do PIB per capita, o capital humano e a infraestrutura, a saúde fiscal, a redução da desigualdade regional, a estabilidade e a nota de crédito. A popularidade é só o meio: sem ela você perde a eleição e o jogo termina. Há eleições gerais a cada 4 anos (com renovação da Câmara e de parte do Senado) e municipais no meio do mandato. Você pode renunciar ou não disputar a reeleição. O cenário inicial é sorteado, e cada linha política tem leis e eventos próprios.${best?`</p><p class="sub">Melhor nota: ${best}/100.`:''}</p><p class="tipbox">Dificuldade única: <b>Dura</b>. Congresso resistente, eleições disputadas e crises em fases.</p><div class="chips" style="margin:6px 0;align-items:center"><button class="chip" data-act="daily">Desafio diário (${dailySeed()})</button><input id="codeIn" placeholder="Código do desafio (ex.: SP-1ABCD-1)" style="background:var(--panel2);border:1px solid var(--line);color:var(--ink);border-radius:99px;padding:4px 12px;font:12px var(--mono);min-width:210px"><button class="chip" data-act="codego">Usar código</button><button class="chip" data-act="tut" data-i="0">Como jogar</button></div>${startSeed!=null?`<p class="tipbox">Desafio ativo: <b>SP-${(startSeed>>>0).toString(36).toUpperCase()}-${startDiff}</b>. Todos que usarem este código enfrentam os mesmos choques e eventos.</p>`:''}${sv?`<button class="btn primary" data-act="cont" style="margin:8px 0">Continuar jogo salvo (${sv.q?`T${sv.q}/${sv.ano}`:''})</button>`:''}${opts}`)}
function flow(){if(S.queue&&S.queue.length){const e0=S.queue.shift(),e=typeof e0==='string'?EVm[e0]:e0;S.cur=e;const n=S.qn||1,i=n-S.queue.length;
  modal(`<p class="eyebrow">Decisão ${i} de ${n} · ${lbl()}</p>${e.tag?`<span class="tag ${/positivo/.test(e.tag)?'pos':''}">${e.tag}</span>`:''}<h2>${e.t}</h2><p>${e.d}</p>`+e.o.map((o,j)=>`<button class="opt" data-act="ev" data-i="${j}"><b>${o.t}</b><span>${o.h}</span></button>`).join(''));return}
 S.cur=null;closeModal();renderAll();save()}
function endTurn(){const L=lbl(),ap0=natAppr(S),lines=[];
 S.sent.forEach(id=>{const law=LAW[id],v=vote(S,law);
  if(v.pass){const af=lawAftermath(S,law);passLaw(S,id);S.pauta=S.pauta.filter(x=>x!==id);lines.push(`<li><b>${law.t}</b> aprovada. Câmara ${v.c}/${v.n.c}, Senado ${v.s}/${v.n.s}.${v.ref?' Aprovada por referendo popular, sem passar pelo Congresso.':''}${v.inf>=6?` Cerca de ${v.inf} deputados da base não seguiram a orientação.`:''}${af?' '+af:''}</li>`);S.feed.unshift({a:L,t:`Lei aprovada: ${law.t}.`})}
  else{S.fails++;applyFx(S,{mood:{all:-1}});lines.push(`<li><b>${law.t}</b> rejeitada. Câmara ${v.c}/${v.n.c}, Senado ${v.s}/${v.n.s}.</li>`);S.feed.unshift({a:L,t:`Derrota no Congresso: ${law.t}.`})}});
 S.sent=[];const rep=simQuarter(S),dA=natAppr(S)-ap0,bn=UFI[rep.best].nome,wn=UFI[rep.worst].nome;
 S.feed.unshift({a:L,t:`PIB ${sg(rep.gN)}%, inflação ${fm(rep.infl)}%, aprovação ${fm(rep.appr,0)}% (${sg(dA)}).`});
 if(rep.imp){finish('Impeachment','Com aprovação baixa e sem apoio no Congresso por um ano, o Legislativo afastou você do cargo.','imp');return}
 const last=S.ano===END&&S.q===4;
 modal(`<p class="eyebrow">Resultado de ${L}</p><h2>Balanço do trimestre</h2><div class="rep"><p><b>Congresso</b></p>${lines.length?'<ul>'+lines.join('')+'</ul>':'<p class="sub">Nenhum projeto foi votado.</p>'}<p><b>Economia</b>: PIB ${sg(rep.gN)}% (anualizado), inflação ${fm(rep.infl)}%, desemprego ${fm(rep.unem)}%, déficit ${fm(rep.defPct)}% do PIB, dívida ${fm(rep.dr,0)}% do PIB. Nota de crédito ${ratingLetter(rep.rt)}, investimento privado ${fm(rep.I)}% do PIB.</p><p><b>Estados</b>: destaque para ${bn}; pior desempenho em ${wn}.</p><p><b>Aprovação</b>: ${fm(rep.appr,0)}% (${sg(dA)} p.p.). Nota projetada: ${legacy(S).score}/100.</p></div><button class="btn primary" data-act="after" style="margin-top:10px">${last?'Ver resultado final':'Continuar'}</button>`);
 renderAll()}
function limitModal(){modal(`<p class="eyebrow">Eleição de ${S.ano}</p><h2>Você não pode concorrer</h2><p>${limOf(S)===1?'A regra atual proíbe a reeleição':'Você cumpriu o limite de dois mandatos consecutivos'}. O governo será assumido por 4 anos por outra pessoa. Seu candidato disputa a eleição agora, conforme a sua popularidade (voto projetado: ${fm(natShare(S),1)}%). Se ele perder, a oposição assume. Durante o interregno haverá eventos aleatórios, novas leis e eleições municipais, e você poderá tentar voltar ao governo na eleição seguinte.</p><button class="btn primary" data-act="interr" style="margin-top:10px">Acompanhar a eleição e os próximos 4 anos</button>`)}
function intSummary(){const I=S.int,end=S.ano>=END;modal(`<p class="eyebrow">Interregno · ${I.from} a ${I.to}</p><h2>${I.flip?'A oposição assumiu':'Seu sucessor assumiu'}</h2><p>Na eleição, ${I.flip?`${I.who} venceu com ${fm(100-I.nat,1)}% dos votos`:`${I.who} foi eleito com ${fm(I.nat,1)}% dos votos`}. Durante os 4 anos seguintes o governo ${I.flip?'seguiu uma linha diferente da sua':'seguiu uma linha próxima da sua'}. Aprovação do governo ao final: ${fm(I.appr,0)}%. Nota projetada: ${legacy(S).score}/100.</p><div class="rep"><p><b>Leis aprovadas no período</b></p>${I.laws.length?'<ul>'+I.laws.map(x=>'<li>'+x+'</li>').join('')+'</ul>':'<p class="sub">Nenhuma lei relevante.</p>'}<p><b>Eventos</b></p>${I.evs.length?'<ul>'+I.evs.slice(0,8).map(x=>'<li>'+x+'</li>').join('')+'</ul>':'<p class="sub">Sem eventos relevantes.</p>'}${I.note.length?'<p class="sub">'+I.note.join(' ')+'</p>':''}</div><button class="btn primary" data-act="${end?'fin':'retc'}" style="margin-top:10px">${end?'Ver resultado final':'Ver a eleição de retorno'}</button>`)}
function retCampaign(){const I=S.int;modal(`<p class="eyebrow">Eleição de ${S.ano}</p><h2>Você quer voltar ao governo?</h2><p>${I.flip?'A oposição governa. ':'Seu partido governa. '}Aprovação do governo atual: ${fm(natAppr(S),0)}%. ${I.flip?'Quanto pior a avaliação do governo, mais fácil o retorno.':'O desempenho do sucessor ajuda ou atrapalha o seu retorno.'} Se vencer, começa um novo ciclo de mandatos.</p>
 <button class="opt" data-act="rcamp" data-k="mod"><b>Voltar moderando o discurso</b><span>Aproxima sua posição do centro.</span></button>
 <button class="opt" data-act="rcamp" data-k="ent"><b>Voltar com campanha de entregas</b><span>Cerca de +3 pontos em todos os estados.</span></button>
 <button class="opt" data-act="rcamp" data-k="base"><b>Voltar mobilizando a base</b><span>+4 onde o eleitorado é próximo de você e −2 nos demais.</span></button>
 <button class="opt" data-act="quit"><b>Não voltar</b><span>Encerra o jogo agora; a nota inclui o que acontecer depois.</span></button>`)}
function campaign(){modal(`<p class="eyebrow">Eleição de ${S.ano}</p><h2>Você vai disputar a reeleição?</h2><p>Voto projetado nacional: ${fm(natShare(S),1)}%. Presidente, Congresso e governadores vão às urnas ao mesmo tempo.</p>
 <button class="opt" data-act="camp" data-k="mod"><b>Candidatar-se: moderar o discurso</b><span>Aproxima sua posição do centro. Ganha indecisos e perde parte da fidelidade da base.</span></button>
 <button class="opt" data-act="camp" data-k="ent"><b>Candidatar-se: campanha de entregas</b><span>R$ 25 bi em obras e benefícios. Cerca de +3 pontos em todos os estados e mais dívida.</span></button>
 <button class="opt" data-act="camp" data-k="base"><b>Candidatar-se: mobilizar a base</b><span>+4 pontos onde o eleitorado é próximo da sua linha e −2 nos demais.</span></button>
 <button class="opt" data-act="quit" data-k="nocand"><b>Não me candidatar</b><span>Você encerra o governo agora e sua nota é calculada com o que construiu até aqui. Útil quando a eleição está perdida e a economia vai bem.</span></button>`)}
function legacyHTML(){const L=legacy(S),nm=['Crescimento do PIB per capita','Capital humano, saúde e infraestrutura','Solidez fiscal','Equilíbrio regional','Inflação e desemprego','Nota de crédito'],wt=[40,15,15,10,10,10];
 return `<div class="stats"><div><span>PIB per capita</span><b>R$ ${fm(L.pc,1)} mil</b><small>${sg(L.pcg,0)}% desde 2027 · ${sg(L.cagr,1)}% ao ano</small></div><div><span>Dívida/PIB</span><b>${fm(L.dr,0)}%</b></div><div><span>Inflação / desemprego</span><b>${fm(L.infl)}% / ${fm(L.unem)}%</b></div><div><span>Nota de crédito</span><b>${ratingLetter(L.rt)}</b></div><div><span>Anos de governo</span><b>${fm(L.yrs,1)}</b></div><div><span>Leis aprovadas</span><b>${L.laws}</b></div></div>
 <div class="sc6">${L.s.map((v,i)=>`<div><span>${nm[i]} <em class="sub">(${wt[i]}%)</em></span><div class="track"><i style="width:${v.toFixed(0)}%"></i></div><b>${fm(v,0)}</b></div>`).join('')}</div>`}
function finish(head,why,mode){if(mode&&!S.succ&&!(S.ano===END&&S.q===4))succession(S,mode);const L=legacy(S),sc=finalScore(S),g=sc>=85?'Estadista':sc>=70?'Governo de transformação':sc>=55?'Governo mediano':sc>=40?'Oportunidades perdidas':'Década perdida';setBest(sc);S.finalSc=sc;
 modal(`<p class="eyebrow">Fim de jogo · ${S.succ?S.succ.from:lbl()}${S.name?' · '+S.name:''}</p><h2>${head}</h2><p>${why}</p><p class="sub">Nota final</p><div class="big">${sc}<span class="sub" style="font-size:20px">/100</span></div><p><b>${g}</b>${getBest()>sc?` · melhor nota: ${getBest()}`:' · nova melhor nota'}</p>${succHTML()}${timelineHTML()}${legacyHTML()}${weighHTML()}<div class="tipbox"><b>Compartilhar</b><br><span id="shr">${shareText(sc)}</span><div class="cbar"><button class="btn" data-act="copy">Copiar resultado</button><button class="btn primary" data-act="restart">Jogar de novo</button></div><p class="sub">Quem digitar o código ${mkCode(S)} na tela inicial joga o mesmo mundo (mesmos choques, crises e eleições) e pode comparar a nota.</p></div>`);wipe()}
function showResult(res){const rows=[...UF].sort((a,b)=>res.sh[b.uf]-res.sh[a.uf]).map(u=>`<div class="vrow"><span>${u.uf} · ${RG[u.reg]}</span><div class="vtrack"><i style="width:${res.sh[u.uf].toFixed(0)}%"></i><u></u></div><b>${fm(res.sh[u.uf],0)}%</b></div>`).join('');
 const won=UF.filter(u=>res.sh[u.uf]>50).length;
 const head=res.win?(S.retWin?`Retorno ao governo com ${fm(res.nat,1)}% dos votos`:`Reeleito com ${fm(res.nat,1)}% dos votos`):`Derrota: ${fm(res.nat,1)}% dos votos`;
 const btn=res.win?'<button class="btn primary" data-act="next">Iniciar o próximo mandato</button>':'<button class="btn primary" data-act="lose">Ver resultado final</button>';
 modal(`<p class="eyebrow">Apuração · ${S.ano}</p><h2>${head}</h2><p>Você venceu em ${won} de 27 estados. Novo Congresso (Câmara, maiores bancadas): ${[...BL].sort((a,b)=>S.seats[b.id].cd-S.seats[a.id].cd).slice(0,6).map(b=>`${b.sig} ${S.seats[b.id].cd}`).join(' · ')}. Senado: ${S.snRen} das 81 cadeiras foram renovadas. Seu partido (${BLI[S.party].sig}) tem ${S.seats[S.party].cd} deputados e ${S.seats[S.party].sn} senadores. Governadores eleitos: ${S.govRes?S.govRes.own:0} do seu partido, ${S.govRes?S.govRes.coal:0} da base e ${S.govRes?S.govRes.opp:0} da oposição.</p><div style="display:flex;flex-direction:column;gap:4px;max-height:260px;overflow:auto;margin:8px 0">${rows}</div>${btn}`)}
function munShow(){const r=munElection(S),o=r.own,tot=5570;logE(S,'elec','Eleições municipais');renderAll();
 modal(`<p class="eyebrow">Eleições municipais · ${S.ano}</p><h2>Resultado das prefeituras</h2><p>Foram disputadas ${tot.toLocaleString('pt-BR')} prefeituras. Seu partido (${BLI[S.party].sig}) elegeu ${o.pref.toLocaleString('pt-BR')} prefeitos, ${o.d>=0?'acima':'abaixo'} do que sua bancada na Câmara sugeria. ${r.mood>=0?'Isso reforça':'Isso enfraquece'} sua imagem (${sg(r.mood)} ponto na aprovação). Os partidos que cresceram nas cidades ganham força no Congresso nos próximos trimestres.</p><div style="display:flex;flex-direction:column;gap:4px;margin:8px 0">${r.rows.slice(0,8).map(x=>`<div class="vrow"><span>${x.sig}</span><div class="vtrack"><i style="width:${(x.pref/tot*100*3).toFixed(0)}%"></i></div><b>${x.pref}</b></div>`).join('')}</div><button class="btn primary" data-act="adv">Continuar</button>`)}
function advance(){S.q++;if(S.q>4){S.q=1;S.ano++}startTurn(S);S.qn=S.queue.length;S.feed.unshift({a:lbl(),t:'Novo trimestre. Defina aportes, pauta e articulação.'});renderAll();flow()}
const clickAdj=(m,s,d,cap)=>{m[s]=cl(+(m[s]+d).toFixed(2),.5,cap)};
function menu(){modal(`<p class="eyebrow">Menu</p><h2>Opções</h2><p class="sub">Seu progresso é salvo automaticamente.</p><button class="opt" data-act="scoreinfo"><b>Ver nota projetada</b><span>Como a nota final é calculada.</span></button><button class="opt" data-act="tut" data-i="0"><b>Como jogar e atalhos</b><span>Resumo das regras e das teclas.</span></button><button class="opt" data-act="cbtoggle"><b>Modo para daltônicos: ${document.documentElement.dataset.cb==='1'?'ligado':'desligado'}</b><span>Troca verde e vermelho por azul e laranja.</span></button><button class="opt" data-act="copy"><b>Copiar código desta partida</b><span>${mkCode(S)} · compartilhe para outra pessoa jogar o mesmo mundo.</span></button><button class="opt" data-act="resign"><b>Renunciar ao mandato</b><span>Encerra o jogo agora com a nota atual.</span></button><button class="opt" data-act="restart"><b>Novo jogo</b><span>Descarta o progresso atual.</span></button>${closeBtn}`)}
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t||t.disabled)return;const ni=$('#nameIn');if(ni){playerName=ni.value.trim().slice(0,24);try{localStorage.setItem('simpol-name',playerName)}catch(_){}}const a=t.dataset.act,d=+t.dataset.d,cap=lawSum(S).cap;
 if(a==='sel'){sel=t.dataset.r;renderMap();renderState();renderRank()}
 else if(a==='metric'){metric=t.dataset.k;renderMap();renderRank()}
 else if(a==='htab'){histK=t.dataset.k;drawHist()}
 else if(a==='adj'){clickAdj(S.st[t.dataset.r].m,t.dataset.s,d,cap);renderState();renderBudget();save()}
 else if(a==='adjAll'){SEC.forEach(s=>clickAdj(S.st[t.dataset.r].m,s.id,d,cap));renderState();renderBudget();save()}
 else if(a==='nat'){UF.forEach(u=>clickAdj(S.st[u.uf].m,t.dataset.s,d,cap));renderState();renderBudget();save()}
 else if(a==='reset'){UF.forEach(u=>SEC.forEach(s=>{S.st[u.uf].m[s.id]=1}));renderState();renderBudget();save()}
 else if(a==='lawsel'){S.selLaw=t.dataset.id;renderPauta();renderHemi()}
 else if(a==='send'){e.stopPropagation();const id=t.dataset.id;if(S.sent.includes(id))S.sent=S.sent.filter(x=>x!==id);else if(S.sent.length<2)S.sent.push(id);S.selLaw=id;renderPauta();renderHemi();save()}
 else if(a==='act'){$('#actMsg').textContent=act(S,t.dataset.k,t.dataset.a);renderKpis();renderPauta();renderHemi();renderActs();renderState();renderBudget();save()}
 else if(a==='end'){endTurn()}
 else if(a==='after'){if(S.ano===END&&S.q===4)finish('Mandato concluído',`Você governou até ${END}. Sua nota é calculada sobre o desempenho acumulado.`);else if(isElectionQ()){if(termLimited(S))limitModal();else campaign()}else if(MUN.includes(S.ano)&&S.q===4)munShow();else advance()}
 else if(a==='adv'){advance()}
 else if(a==='tab'){setTab(t.dataset.k)}
 else if(a==='lfilter'){lawFilter=t.dataset.k;renderLeis()}
 else if(a==='landgo'){showStart()}
 else if(a==='restart'){showLanding()}
 else if(a==='cont'){const sv=loadSave();if(sv){S=sv;renderAll();S.queue=S.queue||[];if(S.cur){S.queue.unshift(S.cur)}if(S.stage==='ret'&&S.int){retCampaign()}else flow()}}
 else if(a==='start'){const pty=IDEO.find(i=>i.k===t.dataset.k),x=pty.x;S=newGame(x,2,pty.k,startSeed);S.name=playerName;startSeed=null;sel='SP';setTab('gov');S.feed.unshift({a:'T1/2027',t:`${playerName?playerName+' assume':'Você assume'} o governo pelo ${pty.n}, com linha ${ideoName(x).toLowerCase()}. Aprovação inicial de ${fm(natAppr(S),0)}%.`});startTurn(S);S.queue.unshift(S.notice);S.qn=S.queue.length;renderAll();flow()}
 else if(a==='ev'){const e2=S.cur,o=e2.o[+t.dataset.i];applyFx(S,o.e);S.feed.unshift({a:lbl(),t:`${e2.t}: ${o.t}.`});flow()}
 else if(a==='camp'){const res=election(S,t.dataset.k);logE(S,'elec',res.win?`Reeleito com ${fm(res.nat,0)}%`:`Derrota com ${fm(res.nat,0)}%`);reelect(S);renderAll();showResult(res)}
 else if(a==='lose'){finish('Fim do mandato',`Você perdeu a eleição de ${S.ano}.`,'lose')}
 else if(a==='quit'){finish('Você não disputou a reeleição',`Você encerrou o governo em ${lbl()}.`,'nocand')}
 else if(a==='resign'){finish('Você renunciou',`Você deixou o cargo em ${lbl()}.`,'resign')}
 else if(a==='next'){if(S.retWin){S.retWin=false;S.consec=1}else S.consec=(S.consec||1)+1;S.mandato++;advance()}
 else if(a==='interr'){interregnum(S);renderAll();save();intSummary()}
 else if(a==='retc'){retCampaign()}
 else if(a==='fin'){finish('Mandato concluído',`O jogo chegou a ${END}. Sua nota é calculada sobre o desempenho acumulado.`)}
 else if(a==='rcamp'){const res=returnElection(S,t.dataset.k);logE(S,'elec',res.win?`Retorno ao governo (${fm(res.nat,0)}%)`:`Derrota na tentativa de retorno (${fm(res.nat,0)}%)`);if(res.win){S.x=S.int.x0;S.retWin=true;S.stage=null;S.int=null;initCoal(S);pickRival(S)}renderAll();showResult(res)}
 else if(a==='info'){const o=INFO[t.dataset.k];infoModal(o)}
 else if(a==='sinfo'){const o=SINFO[t.dataset.k];infoModal(o)}
 else if(a==='scoreinfo'){modal(`<p class="eyebrow">Nota final</p><h2>Nota projetada: ${legacy(S).score}/100</h2><p>Se o jogo terminasse agora. Pesos: crescimento do PIB per capita (40%), capital humano e infraestrutura (15%), solidez fiscal (15%), equilíbrio regional (10%), inflação e desemprego (10%) e nota de crédito (10%).</p>${legacyHTML()}${closeBtn}`)}
 else if(a==='menu'){menu()}
 else if(a==='tut'){showTut(+t.dataset.i)}
 else if(a==='tutend'){SS('simpol-tut','1');if(S&&S.hist.length>1&&S.cur!==undefined&&!$('#sheet .eyebrow').textContent.startsWith('Ajuda')){flow()}else showStart()}
 else if(a==='ind'){indK=t.dataset.k;renderInd()}
 else if(a==='isel'){sel=t.dataset.r;renderInd();renderMap();renderState();renderRank()}
 else if(a==='isort'){indSort=t.dataset.k;renderInd()}
 else if(a==='minadj'||a==='coalin'||a==='coalout'){const m=coalAct(a,t.dataset.id,+t.dataset.d);if(m)S.feed.unshift({a:lbl(),t:m});renderCoal();renderPauta();renderHemi();renderKpis();save()}
 else if(a==='daily'){startSeed=dailySeed();showStart()}
 else if(a==='codego'){const c=parseCode($('#codeIn').value);if(c){startSeed=c.seed;showStart()}else{$('#codeIn').value='';$('#codeIn').placeholder='Código inválido'}}
 else if(a==='cbtoggle'){setCB(document.documentElement.dataset.cb!=='1');menu()}
 else if(a==='copy'){const tx=$('#shr')?$('#shr').textContent:mkCode(S);try{navigator.clipboard.writeText(tx)}catch(e){}t.querySelector&&(t.firstElementChild?0:0);t.textContent='Copiado: '+mkCode(S)}
 else if(a==='close'){flow()}});
document.addEventListener('keydown',e=>{const t=e.target.closest&&e.target.closest('.tl');if(t&&(e.key==='Enter'||e.key===' ')){e.preventDefault();sel=t.dataset.r;renderMap();renderState();renderRank()}});
$('#tax').addEventListener('input',e=>{S.tax=+e.target.value/100;renderBudget();renderKpis();save()});
$('#map').addEventListener('mousemove',mapHover);$('#map').addEventListener('mouseleave',hideTip);
$('#rank').addEventListener('mousemove',mapHover);$('#rank').addEventListener('mouseleave',hideTip);
$('#hemis').addEventListener('mousemove',hemiHover);$('#hemis').addEventListener('mouseleave',hideTip);
$('#hist').addEventListener('pointermove',histMove);$('#hist').addEventListener('pointerdown',histMove);$('#hist').addEventListener('pointerleave',histOut);
setCB(SS('simpol-cb')==='1');buildMap();genPauta(S);renderAll();showLanding();
