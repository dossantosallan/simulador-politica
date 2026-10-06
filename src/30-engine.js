const EVm=Object.fromEntries(EV.map(e=>[e.id,e]));
const f1=v=>v.toFixed(1).replace('.',',');
const LAWS=[
{id:'trib',t:'Reforma tributária',tipo:'PEC',b:0,d:'Simplifica os impostos sobre o consumo e destrava investimento.',h:'+0,4 p.p. de crescimento ao ano, +1 p.p. de investimento privado, nota de crédito melhor; desgaste curto',fx:{gn:.004,inv:1,rat:4,mood:{all:-2},sched:[{t:24,pg:.004,evd:LATE.fruto('reforma tributária')}]}},
{id:'admin',t:'Reforma administrativa',tipo:'PL',b:1,d:'Reduz despesas de pessoal e muda regras do funcionalismo.',h:'Economiza cerca de R$ 33 bi ao ano e melhora a nota de crédito; desgaste no DF',fx:{mand:-.003,rat:4,mood:{all:-2,DF:-8},sched:[{t:20,pg:.002,evd:LATE.fruto('reforma administrativa')}]}},
{id:'fiscal',t:'Arcabouço fiscal rígido',tipo:'PEC',b:1,d:'Limita o crescimento da despesa e reduz o prêmio de risco.',h:'Juros −0,6 p.p., nota de crédito +8, investimento privado +0,8 p.p.; aportes limitados a 115% da base',fx:{rate:-.006,infl:-.3,inv:.8,rat:8,cap:1.15}},
{id:'educ',t:'Fundeb ampliado e piso nacional',tipo:'PL',b:-1,d:'Amplia o financiamento da educação básica e o piso dos professores.',h:'+0,8 ponto de educação ao ano (capital humano); despesa obrigatória maior',fx:{mand:.003,idx:{edu:.8},sched:[{t:20,pg:.003,evd:LATE.fruto('aposta na educação básica')}]}},
{id:'renda',t:'Renda básica universal',tipo:'PL',b:-1.6,d:'Transferência mensal ampliada a todas as famílias vulneráveis.',h:'+1,2 ponto de assistência social ao ano; custa 0,7% do PIB; piora a nota de crédito',fx:{mand:.007,idx:{social:1.2},mood:{all:2},infl:.15,rat:-3}},
{id:'priv',t:'Privatização de estatais',tipo:'PL',b:1.3,d:'Venda de empresas públicas de energia, portos e logística.',h:'Receita única de R$ 60 bi, crescimento maior e +0,6 p.p. de investimento privado; rejeição no Nordeste',fx:{once:-60,gn:.002,inv:.6,rat:2,mood:{NE:-3},sched:[{t:8,p:.35,evd:LATE.audit('a privatização de estatais')}]}},
{id:'conces',t:'Marco das concessões em infraestrutura',tipo:'PL',b:.7,d:'Regras estáveis para investimento privado em rodovias, portos e saneamento.',h:'+0,6 ponto de infraestrutura ao ano, +1 p.p. de investimento privado',fx:{gn:.002,inv:1,idx:{infra:.6},vs:{agro:.002,ind:.002},sched:[{t:8,p:.3,evd:LATE.audit('as concessões de infraestrutura')}]}},
{id:'seg',t:'Pacote de segurança pública',tipo:'PL',b:1,d:'Endurece penas e financia polícia e inteligência.',h:'+0,8 ponto de segurança ao ano; bem recebido no Sul, Centro-Oeste e Sudeste',fx:{mand:.002,idx:{seg:.8},mood:{S:1,CO:1,SE:1}}},
{id:'sus',t:'Piso constitucional da saúde',tipo:'PEC',b:-1,d:'Garante um piso crescente de recursos para o SUS.',h:'+1 ponto de saúde ao ano; despesa obrigatória maior',fx:{mand:.004,idx:{saude:1}}},
{id:'inov',t:'Lei de incentivo à inovação',tipo:'PL',b:.3,d:'Crédito e benefícios fiscais para pesquisa e desenvolvimento.',h:'+1 ponto de ciência e tecnologia ao ano (produtividade) e +0,4 p.p. de investimento privado',fx:{gn:.002,inv:.4,idx:{tech:1},mand:.001}},
{id:'amb',t:'Lei de proteção ambiental',tipo:'PL',b:-1,d:'Reforça fiscalização e metas de desmatamento.',h:'+1 ponto de meio ambiente ao ano; Centro-Oeste cresce menos',fx:{idx:{amb:1},vs:{agro:-.004,min:-.003}}},
{id:'pacto',t:'Pacto federativo',tipo:'PEC',b:.2,d:'Divide receitas e responsabilidades entre União, estados e municípios.',h:'Governadores mais próximos (+10); despesa obrigatória maior',fx:{rel:10,mand:.002}},
{id:'prev',t:'Reforma da previdência',tipo:'PEC',b:.9,d:'Muda idade mínima e regras de aposentadoria.',h:'Economiza cerca de R$ 65 bi ao ano, nota de crédito +6; grande desgaste',fx:{mand:-.006,rat:6,mood:{all:-4},sched:[{t:24,pg:.003,evd:LATE.fruto('reforma da previdência')}]}},
{id:'fortuna',t:'Imposto sobre grandes fortunas',tipo:'PL',b:-1.6,d:'Cobra imposto anual sobre patrimônios muito altos.',h:'Receita de 0,4% do PIB; crescimento e investimento privado menores',fx:{rev:.004,gn:-.0015,inv:-.5}},
{id:'salmin',t:'Valorização real do salário mínimo',tipo:'PL',b:-1,d:'Reajuste acima da inflação todos os anos.',h:'+0,6 ponto de assistência social ao ano; inflação maior',fx:{idx:{social:.6},infl:.2,mand:.002,mood:{NE:2}}},
{id:'trab',t:'Modernização trabalhista',tipo:'PL',b:1.2,d:'Flexibiliza contratos e negociações coletivas.',h:'+0,3 p.p. de crescimento ao ano, +0,5 p.p. de investimento privado; desgaste e perda social',fx:{gn:.003,inv:.5,mood:{all:-2},idx:{social:-1},sched:[{t:20,pg:.002,evd:LATE.fruto('modernização trabalhista')}]}}];
const LAW=Object.fromEntries(LAWS.map(l=>[l.id,l]));
function lawSum(S){const o={gn:0,mand:0,rev:0,rate:0,infl:0,inv:0,rat:0,idx:{},regG:{},vs:{},cap:2};
 S.laws.forEach(id=>{const f=LAW[id].fx;['gn','mand','rev','rate','infl','inv','rat'].forEach(k=>{if(f[k])o[k]+=f[k]});for(const s in(f.idx||{}))o.idx[s]=(o.idx[s]||0)+f.idx[s];for(const r in(f.regG||{}))o.regG[r]=(o.regG[r]||0)+f.regG[r];for(const r in(f.vs||{}))o.vs[r]=(o.vs[r]||0)+f.vs[r];if(f.cap)o.cap=Math.min(o.cap,f.cap)});
 // efeitos pontuais de investimento/nota só valem uma vez (na aprovação); aqui ficam só os contínuos
 o.inv=.5*S.laws.reduce((a,id)=>a+(LAW[id].fx.inv||0),0);o.rat=0;return o}
function fiscal(S){const L=lawSum(S),gd=gdp(S),pt=popSum(S),B=.04*gd;let disc=0;
 UF.forEach(u=>SEC.forEach(s=>{disc+=Math.min(S.st[u.uf].m[s.id],L.cap)*.04*gd*s.w*S.st[u.uf].pop/pt}));
 const rev=(S.tax+L.rev)*gd,mand=(.15+L.mand)*gd,rate=cl(.045+(43-S.rt)*.0007+L.rate+(S.reg?S.reg.rate*[.6,1,1.4][S.diff==null?1:S.diff]:0),.02,.14),intr=rate*S.debt,prim=rev-mand-disc,def=intr-prim;
 return{gd,B,disc,rev,mand,prim,intr,def,defPct:def/gd*100,rate,cost:S.pend.cost,L}}
function bonus(S,id,v){S.bl[id].b=cl(S.bl[id].b+(v>0?v*cl(1-S.bl[id].b/36,.1,1):v),-30,32)}
const ownBloc=S=>S.party;
const regOf=(S,k)=>UF.filter(u=>k==='all'||u.reg===k||u.uf===k);
function applyFx(S,e){const P=S.pend;
 if(e.gn)P.gn+=e.gn;if(e.infl)P.infl+=e.infl;if(e.cost)P.cost+=e.cost;
 if(e.inv)S.I=cl(S.I+e.inv,8,28);if(e.rat)S.rt=cl(S.rt+e.rat,5,95);if(e.unem)S.unem=cl(S.unem+e.unem,4,16);
 for(const k in(e.gr||{}))P.gr[k]=(P.gr[k]||0)+e.gr[k];
 for(const k in(e.mood||{}))regOf(S,k).forEach(u=>{S.st[u.uf].mood=cl(S.st[u.uf].mood+e.mood[k],-25,16)});
 for(const k in(e.idx||{}))UF.forEach(u=>{S.st[u.uf].idx[k]=cl(S.st[u.uf].idx[k]+e.idx[k])});
 for(const k in(e.ridx||{}))for(const s in e.ridx[k])regOf(S,k).forEach(u=>{S.st[u.uf].idx[s]=cl(S.st[u.uf].idx[s]+e.ridx[k][s])});
 for(const k in(e.rel||{}))UF.filter(u=>{const d=Math.abs(S.x-S.st[u.uf].gx);return k==='all'||u.reg===k||u.uf===k||(k==='opp'&&d>1.2)||(k==='ally'&&d<=1.2)}).forEach(u=>{S.st[u.uf].rel=cl(S.st[u.uf].rel+e.rel[k])});
 for(const k in(e.bloc||{})){const ids=k==='own'?[S.party]:GRP[k]?GRP[k]:[k];ids.forEach(id=>bonus(S,id,e.bloc[k]))}
 if(e.gv){P.gv=P.gv||{};for(const k in e.gv)P.gv[k]=(P.gv[k]||0)+e.gv[k]}
 if(e.coal)coalFx(S,e.coal);
 if(e.crise&&S.crise){S.crise.sev+=e.crise.sev||0;S.crise.vac=(S.crise.vac||0)+(e.crise.vac||0)}
 if(e.late)e.late.forEach(x=>S.sched.push({...x}));
 if(e.perm){S.xg+=e.perm.g||0;S.xi+=e.perm.i||0;S.xinv+=e.perm.inv||0;S.xu+=e.perm.u||0}
 if(e.ideo)S.x=cl(S.x+e.ideo,-2,2)}
function blocS(S,i){return cl(66-24*Math.abs(S.x-BL[i].pos)+.35*(natAppr(S)-45)+S.bl[BL[i].id].b+gvb(S,BL[i].id)+(BL[i].id===S.party?14:0)+(inCoal(S,BL[i].id)?6:-4),0,100)}
const pBase=(S,law,i)=>.2+.6*blocS(S,i)/100+.28*(1-cl(Math.abs(law.b-BL[i].pos)/2.2,0,1));
function backlash(S,law,i){const b=BL[i];if(b.id===S.party||inCoal(S,b.id))return 0;const d=Math.abs(S.x-b.pos),imp=Math.max(0,50-(typeof popSup==='function'?popSup(S,law):50))/50,dom=Math.max(0,natAppr(S)-62)/38;return -(.10*imp+.12*dom)*cl(.4+d/2,.4,1.3)}
function pYes(S,law,i){return cl(pBase(S,law,i)+fid(S,i)+backlash(S,law,i),.03,.97)}
function need(law){return law.tipo==='PEC'?{c:308,s:49}:{c:257,s:41}}
function proj(S,law){let c=0,s=0;BL.forEach((b,i)=>{const p=pYes(S,law,i);c+=S.seats[b.id].cd*p;s+=S.seats[b.id].sn*p});return{c,s,n:need(law)}}
function vote(S,law){if(S.fl&&S.fl.refer&&law.bold&&popSup(S,law)>=55)return{c:513,s:81,n:need(law),inf:0,ref:1,pass:true};let c=0,s=0,inf=0;BL.forEach((b,i)=>{const p=pYes(S,law,i),j=()=>cl(p+(RV()-.5)*.24,0,1);c+=Math.round(S.seats[b.id].cd*j());s+=Math.round(S.seats[b.id].sn*j());if(inCoal(S,b.id)&&fid(S,i)<0)inf+=Math.round(S.seats[b.id].cd*Math.min(-fid(S,i),pBase(S,law,i)))});const n=need(law);return{c,s,n,inf,pass:c>=n.c&&s>=n.s}}
const supportNat=S=>BL.reduce((a,b,i)=>a+S.seats[b.id].cd*blocS(S,i),0)/513;
function genPauta(S){const pool=LAWS.filter(l=>!l.bold&&!S.laws.includes(l.id)&&(!l.only||(S.x>=l.only[0]&&S.x<=l.only[1]))).map(l=>l.id).sort(()=>RE()-.5);S.pauta=pool.slice(0,3);S.sent=[];S.selLaw=S.pauta[0]||null}
function passLaw(S,id){const f=LAW[id].fx;S.laws.push(id);logE(S,'law',LAW[id].t);if(f.lim!=null)S.lim=f.lim;const e={};if(f.mood)e.mood=f.mood;if(f.rel)e.rel={all:f.rel};if(f.once)e.cost=f.once;if(f.rat)e.rat=f.rat;if(f.bloc)e.bloc=f.bloc;if(f.ridx)e.ridx=f.ridx;if(f.unem)e.unem=f.unem;applyFx(S,e);
 if(f.inst)S.inst=cl((S.inst||0)+f.inst,0,100);if(f.flag){S.fl=S.fl||{};S.fl[f.flag]=1;if(f.flag==='bip')consolidate(S)}
 if(f.perm){S.xg+=f.perm.g||0;S.xi+=f.perm.i||0;S.xinv+=f.perm.inv||0;S.xu+=f.perm.u||0}
 if(f.sched)f.sched.forEach(x=>S.sched.push({...x}))}
function act(S,k,a){if(S.ap<1)return 'Sem pontos de articulação neste trimestre.';
 if(k==='emenda'){S.ap--;S.pend.cost+=8;GRP.C.forEach(i=>bonus(S,i,12));GRP.CD.forEach(i=>bonus(S,i,5));GRP.CE.forEach(i=>bonus(S,i,5));return 'Emendas liberadas (R$ 8 bi). Centrão e blocos vizinhos mais favoráveis.'}
 if(k==='cargos'){S.ap--;const g=GRP[a],ps=g.map(id=>BLI[id]);g.forEach(id=>{bonus(S,id,14);if(inCoal(S,id)&&id!==S.party)S.sat[id]=cl(S.sat[id]+6)});S.pend.cost+=3;if(a==='C')applyFx(S,{mood:{all:-.3}});const avg=ps.reduce((q,b)=>q+b.pos,0)/ps.length;S.x=cl(S.x+(avg-S.x)*.08,-2,2);return `Negociação de cargos com ${GRPN[a]}. Apoio maior, e sua linha se aproxima um pouco do grupo.`}
 if(k==='reg'){S.ap--;regOf(S,a).forEach(u=>{S.st[u.uf].rel=cl(S.st[u.uf].rel+8)});return `Agenda com governadores do ${RG[a]}: relação +8.`}
 if(k==='gov'){S.ap--;S.st[a].rel=cl(S.st[a].rel+14);return `Reunião com o governador de ${UFI[a].nome}: relação +14.`}
 if(k==='discurso'){S.ap--;const sp=S.sp||0,v=cl(2.5*(1-.4*sp),-.3,2.5);S.sp=sp+1;applyFx(S,{mood:{all:v}});return v>=0.3?`Pronunciamento em rede nacional: aprovação ${sg(v)} em todos os estados. Cada novo discurso rende menos.`:v>-.3?'Pronunciamento sem efeito: a população já está saturada de discursos.':`Excesso de pronunciamentos: a população se cansa e a aprovação cai ${fm(-v)} ponto.`}
 return ''}
const DEC={edu:.2,saude:.4,infra:.6,seg:.5,tech:.3,social:.4,amb:.3};
function simQuarter(S){
 seedStreams(S.seed,S.hist.length);
 {const rest=[];(S.sched||[]).forEach(it=>{it.t--;if(it.t>0){rest.push(it);return}if(it.p!=null&&RW()>it.p)return;if(it.rat)S.rt=cl(S.rt+it.rat,5,95);if(it.inv)S.I=cl(S.I+it.inv,8,28);if(it.mood)applyFx(S,{mood:{all:it.mood}});S.xg+=it.pg||0;S.xi+=it.pi||0;S.xinv+=it.pinv||0;if(it.ev)S.forceEv=it.ev;if(it.infl)S.pend.infl+=it.infl;if(it.evd)(S.late=S.late||[]).push(it.evd);if(it.msg)S.msgs.push(it.msg)});S.sched=rest}
 const P=S.pend,F=fiscal(S),L=F.L,dm=[.6,1,1.4][S.diff==null?1:S.diff],R=(r0=>({gn:r0.gn*dm,infl:r0.infl*dm,rat:r0.rat*dm,inv:r0.inv*dm,gr:Object.fromEntries(Object.entries(r0.gr).map(([k,v])=>[k,v*dm])),vs:r0.vs?Object.fromEntries(Object.entries(r0.vs).map(([k,v])=>[k,v*dm])):null}))(S.reg||{gn:0,infl:0,rat:0,inv:0,gr:{}}),nz=(RW()-.5)*.010*dm,f=.25,gd0=F.gd,pt=popSum(S),spend=F.disc/F.B,dI=.0012*(S.I-15);let g1=0;const gs={};
 UF.forEach(u=>{const g=S.st[u.uf],i=g.idx,o=g.i0,pcI=(g.pib/g.pop)/(gd0/pt);
  const ga=G0[u.reg]+.008+.011*(i.edu-o.edu)/50*cl(.6+i.infra/100,.6,1.1)+.009*(i.infra-o.infra)/50+.011*(i.tech-o.tech)/50*cl(i.edu/60,.4,1.15)+.006*(i.saude-o.saude)/50+.005*(i.seg-o.seg)/50+.004*(i.social-o.social)/50+.004*(i.amb-o.amb)/50+.006*(1-pcI)+dI+(.19-S.tax)*.25+.02*(spend-1)-Math.max(0,S.infl-6)*.003+L.gn+(L.regG[u.reg]||0)+R.gn+(R.gr[u.reg]||0)+vocG(u.uf,L.vs)+vocG(u.uf,R.vs)+vocG(u.uf,P.gv)+(S.xg||0);
  const gq=cl(ga,-.04,.055)*f+nz+(RW()-.5)*.010+(P.gn||0)+(P.gr[u.reg]||0)+(P.gr[u.uf]||0);
  g.pib*=1+gq;g.pop*=1+POPG[u.reg]*f;g1+=g.pib;g.g=.5*g.g+.5*gq*4;gs[u.uf]=gq*4;
  const ex=.9+.2*g.rel/100;
  SEC.forEach(s=>{const m=Math.min(g.m[s.id],L.cap)*eff(S.x,s.id)*ex;let d=(12*(m-1)*(1-i[s.id]/100)-DEC[s.id])/4+(L.idx[s.id]||0)*f;d=cl(d,-3,3);const ni=cl(i[s.id]+d);g.d[s.id]=ni-i[s.id];i[s.id]=ni})});
 const gA=(g1/gd0-1)*4,drPrev=S.debt/gd0*100;
 S.infl=cl(.85*S.infl+.15*(3.5+.35*Math.max(0,F.defPct-2)+.3*Math.max(0,gA*100-3.5)+L.infl+R.infl+(S.xi||0))+P.infl+(RW()-.5)*.3,2,20);
 S.unem=cl(.9*S.unem+.1*(10-1.5*gA*100+(S.xu||0)),4,16);
 S.debt+=F.def*f+P.cost-S.debt*S.infl/100*f*.3;
 const dr=S.debt/g1*100,av=k=>avgIdx(S,k),nb=S.nb;
 const It=15+.05*(av('infra')-nb.infra)+.04*(av('seg')-nb.seg)+.03*(av('edu')-nb.edu)+.05*(S.rt-44)-.3*(S.infl-4.5)-.04*(drPrev-76)+L.inv+R.inv+(S.xinv||0)-.03*(S.inst||0);
 S.I=cl(S.I+.15*(It-S.I),8,22);
 const rs=80-.7*Math.max(0,dr-40)-4*Math.max(0,F.defPct-1)-4*Math.max(0,S.infl-4)+4*(gA*100-2)+S.laws.reduce((a,id)=>a+(LAW[id].fx.rat||0),0)*.5+R.rat-.12*(S.inst||0);
 S.rt=cl(.85*S.rt+.15*rs,5,95);
 UF.forEach(u=>{const g=S.st[u.uf],tr=SEC.reduce((a,s)=>a+s.w*Math.min(g.m[s.id],L.cap),0);g.rel=cl(g.rel+.2*(relTarget(S,g,tr)-g.rel),0,100);g.appr=.7*g.appr+.3*approval(S,u);g.mood*=.88});
 BL.forEach(b=>{S.bl[b.id].b*=.75});S.sp=(S.sp||0)*.8;
 S.pend={gn:0,gr:{},infl:0,cost:0,gv:{}};rvQuarter(S);coalQuarter(S);
 const ids=UF.map(u=>u.uf).sort((a,b)=>gs[b]-gs[a]);
 S.hist.push(hrow(S,`T${S.q}/${S.ano}`,gA*100,dr));
 const fl=S.fl||{},wk=fl.parl?supportNat(S)<46:fl.recall?(natAppr(S)<38&&supportNat(S)<48):(natAppr(S)<30&&supportNat(S)<42);S.inst=(S.inst||0)*.94;S.risk=wk?(S.risk||0)+1:Math.max(0,(S.risk||0)-1);
 return{gN:gA*100,infl:S.infl,unem:S.unem,defPct:F.defPct,dr,appr:natAppr(S),best:ids[0],worst:ids[ids.length-1],rt:S.rt,I:S.I,imp:S.risk>=4}}
function election(S,strat){
 seedStreams(S.seed,S.ano*10);
 if(strat==='ent')S.debt+=25;
 if(strat==='mod')S.x*=.6;
 const sh={};let tot=0;
 UF.forEach(u=>{const g=S.st[u.uf];let a=strat==='mod'?.5*g.appr+.5*approval(S,u):g.appr;
  let v=shareOf(S,u,a);if(strat==='ent')v+=3;if(strat==='mod')v+=1;if(strat==='base')v+=Math.abs(S.x-u.lean)<1?4:-2;
  if(S.fl&&S.fl.vf)v+=(u.dev-60)/60*4*(S.x>=0?1:-1);v=cl(v+(RL()-.5)*7-(S.rv?.5*S.rv.b:0)-1.2*Math.max(0,(S.consec||1)-1),5,95);sh[u.uf]=v;tot+=v*g.pop});
 const nat=tot/popSum(S);return{sh,nat,win:nat>50}}
const distr=(tot,raw)=>{const sum=raw.reduce((a,v)=>a+v,0),out=raw.map(v=>Math.round(v/sum*tot)),k=out.indexOf(Math.max(...out));out[k]+=tot-out.reduce((a,v)=>a+v,0);return out};
function reelect(S){const mood=(natAppr(S)-45)/45,w=BL.map(b=>Math.max(.15,1+(.4+(b.id===S.party?.35:0))*mood*(1-Math.abs(S.x-b.pos)/3.2)+(RL()-.5)*.25));
 const cd=distr(513,BL.map((b,i)=>(.5*b.cd+.5*S.seats[b.id].cd)*w[i]));
 const nren=((S.ano-2030)/4)%2===0?27:54,keep=distr(81-nren,BL.map(b=>S.seats[b.id].sn+.001)),nw=distr(nren,BL.map((b,i)=>(.5*b.sn+.5*S.seats[b.id].sn)*w[i]));
 BL.forEach((b,i)=>{S.seats[b.id]={cd:cd[i],sn:keep[i]+nw[i]}});S.snRen=nren;
 UF.forEach(u=>{const g=S.st[u.uf];electGov(S,u);const tr=SEC.reduce((a,q)=>a+q.w*g.m[q.id],0);g.rel=relTarget(S,g,tr)});
 BL.forEach(b=>{S.bl[b.id].b=0});S.govRes=govRes(S);pickRival(S,true);if(S.rv)S.rv.b=0}
function munElection(S){seedStreams(S.seed,S.ano*10+1);const mood=(natAppr(S)-45)/45,w=BL.map(b=>S.seats[b.id].cd*Math.max(.2,1+(.4+(b.id===S.party?.3:0))*mood*(1-Math.abs(S.x-b.pos)/3.2)+(RL()-.5)*.3));
 const pr=distr(5570,w),rows=BL.map((b,i)=>({id:b.id,sig:b.sig,n:b.n,pref:pr[i],seat:S.seats[b.id].cd}));
 rows.forEach(r=>{const d=r.pref/5570-r.seat/513;r.d=d;bonus(S,r.id,cl(d*100*.7,-7,7))});
 const own=rows.find(r=>r.id===S.party),m=cl(own.d*100*.6,-3,3);applyFx(S,{mood:{all:m}});
 return{rows:rows.sort((a,b)=>b.pref-a.pref),own,mood:m}}
function popSup(S,l){return cl(natAppr(S)+(l.pop||0),0,100)}
function lawAftermath(S,l){if(!l.bold)return '';const ps=popSup(S,l);
 if(ps<50){const m=Math.min(14,(50-ps)*.5);applyFx(S,{mood:{all:-m},bloc:{own:-6}});S.protest=l.t;return `Ampla rejeição popular (apoio de ${ps.toFixed(0)}%): a aprovação cai ${m.toFixed(1).replace('.',',')} pontos em todos os estados e há protestos.`}
 if(ps>=60){applyFx(S,{mood:{all:3}});return 'Forte apoio popular: a aprovação sobe 3 pontos.'}
 return 'Recepção popular neutra.'}
function legacy(S){const pt=popSum(S),yrs=Math.max(.25,(S.hist.length-1)/4),pc=gdp(S)/pt,cagr=Math.pow(pc/S.pc0,1/yrs)-1;
 const pcs=UF.map(u=>S.st[u.uf].pib/S.st[u.uf].pop),spread=Math.max(...pcs)/Math.min(...pcs),dr=S.debt/gdp(S)*100,av=k=>avgIdx(S,k),stock=(av('edu')+av('tech')+av('infra')+av('saude'))/4;
 const s1=cl(cagr/.055*100),s2=cl(.6*(stock-40)*2+.4*cl((indNat(S).idh-.66)/.22*100)),s3=cl((115-dr)/70*100),s4=cl((8-spread)/5*100),s5=cl((20-(S.infl+S.unem))/11*100),s6=cl(S.rt);
 return{yrs,pc,pcg:(pc/S.pc0-1)*100,cagr:cagr*100,stock,spread,dr,infl:S.infl,unem:S.unem,rt:S.rt,appr:natAppr(S),laws:S.laws.length,s:[s1,s2,s3,s4,s5,s6],score:Math.round(.40*s1+.15*s2+.15*s3+.10*s4+.10*s5+.10*s6)}}
function pickEvent(S){const okc=e=>(!e.cond||e.cond(S))&&(!e.only||(S.x>=e.only[0]&&S.x<=e.only[1]));let pool=EV.filter(e=>!S.used.includes(e.id)&&okc(e)&&e.id!==S.curId);if(!pool.length){S.used=[];pool=EV.filter(okc)}
 const e=pool[Math.floor(RE()*pool.length)];S.used.push(e.id);return e}
const REGS=[
{id:'boom',n:'Boom de commodities',d:'Os preços de soja, minério e petróleo sobem no mercado mundial. Exportadores ganham fôlego e o câmbio ajuda.',gn:.008,infl:.2,rat:1,inv:.3,rate:0,gr:{},vs:{agro:.02,min:.03,ind:.001}},
{id:'bust',n:'Queda de commodities',d:'Os preços das exportações despencam. A receita e o crescimento caem, principalmente no agro e na mineração.',gn:-.009,infl:.1,rat:-1.5,inv:-.3,rate:.003,gr:{},vs:{agro:-.02,min:-.03,ind:-.002}},
{id:'crise',n:'Crise financeira global',d:'Bancos e mercados do mundo entram em estresse. O capital foge de emergentes e o comércio encolhe.',gn:-.014,infl:.3,rat:-2.5,inv:-.6,rate:.008,gr:{},vs:{ind:-.01,serv:-.005,min:-.004}},
{id:'juros',n:'Juros internacionais altos',d:'Os bancos centrais dos países ricos mantêm juros elevados e o capital volta para lá.',gn:-.004,infl:.2,rat:-1,inv:-.5,rate:.01,gr:{},vs:{ind:-.004,serv:-.002}},
{id:'liquid',n:'Onda de liquidez global',d:'Dinheiro barato no mundo busca retorno em emergentes. Investimento e crédito avançam.',gn:.006,infl:.1,rat:1.5,inv:.6,rate:-.006,gr:{},vs:{serv:.006,ind:.004}},
{id:'seca',n:'Seca prolongada',d:'Chuvas abaixo da média por anos afetam lavouras, energia e preços de alimentos.',gn:-.005,infl:.5,rat:-.5,inv:-.2,rate:0,gr:{},vs:{agro:-.025,ind:-.004}}];
const gl=(S,n)=>{const h=S.hist.slice(-n);return h.length===n?h.reduce((a,x)=>a+x.g,0)/n:2};
const drNow=S=>S.debt/gdp(S)*100;
const weakest=(S,k)=>UF.reduce((a,u)=>S.st[u.uf].idx[k]<S.st[a.uf].idx[k]?u:a,UF[0]);
const TRIG=[
{id:'infl',cool:6,when:S=>S.infl>6.2,build:S=>({id:'t-infl',tag:'Alarme: inflação',t:'Inflação corrói o poder de compra',d:`A inflação chegou a ${f1(S.infl)}% e o custo de vida virou o assunto do país.`,o:[
 {t:'Cortar gastos e apertar o crédito',h:'Economiza R$ 20 bi e esfria os preços, com custo no crescimento.',e:{cost:-20,infl:-.9,gn:-.003,mood:{all:-2}}},
 {t:'Congelar preços de itens essenciais',h:'R$ 10 bi. Alivia agora e desestimula investimento.',e:{cost:10,infl:-.5,inv:-1,mood:{all:1}}},
 {t:'Esperar a política monetária agir',h:'Sem custo. A inflação cai devagar e o desgaste cresce.',e:{infl:-.2,mood:{all:-3}}}]})},
{id:'unem',cool:6,when:S=>S.unem>9.2,build:S=>({id:'t-unem',tag:'Alarme: desemprego',t:'Desemprego alto fecha fábricas',d:`O desemprego está em ${f1(S.unem)}%. Cidades industriais pedem socorro.`,o:[
 {t:'Frentes de trabalho e obras locais',h:'R$ 15 bi. Reduz o desemprego já, sem ganho de produtividade.',e:{cost:15,unem:-.7,mood:{all:2}}},
 {t:'Requalificação profissional',h:'R$ 8 bi. Efeito mais lento e duradouro: educação sobe.',e:{cost:8,unem:-.3,idx:{edu:1.5}}},
 {t:'Reduzir encargos sobre a folha',h:'R$ 12 bi. Estimula contratações e investimento privado.',e:{cost:12,gn:.003,inv:.5,unem:-.4}}]})},
{id:'dr',cool:6,when:S=>drNow(S)>95,build:S=>({id:'t-dr',tag:'Alarme: dívida',t:'Agências ameaçam rebaixar a nota do país',d:`A dívida chegou a ${f1(drNow(S))}% do PIB e os juros de longo prazo sobem.`,o:[
 {t:'Ajuste fiscal forte',h:'Economiza R$ 30 bi, melhora a nota de crédito e esfria a economia.',e:{cost:-30,rat:6,gn:-.002,mood:{all:-3}}},
 {t:'Plano de privatizações e concessões',h:'Receita de R$ 25 bi e melhor percepção de risco.',e:{cost:-25,rat:4,inv:.5,mood:{NE:-3},ideo:.2}},
 {t:'Ignorar o alerta',h:'Sem custo agora. A nota cai e o investimento privado recua.',e:{rat:-8,inv:-1.5}}]})},
{id:'rec',cool:8,when:S=>S.hist.length>3&&gl(S,2)<.4,build:S=>({id:'t-rec',tag:'Alarme: crescimento',t:'A economia estagna',d:`O crescimento caiu para ${f1(gl(S,2))}% ao ano. Empresas seguram investimentos.`,o:[
 {t:'Estímulo fiscal temporário',h:'R$ 25 bi. Reaquece a economia e pressiona a inflação.',e:{late:[{t:5,infl:1,msg:'O estímulo fiscal de alguns trimestres atrás deixou um pulso de inflação.'}],cost:25,gn:.005,infl:.4,inv:.5,mood:{all:2}}},
 {t:'Agenda de reformas pró-investimento',h:'Sem custo. Efeito gradual na confiança.',e:{gn:.002,inv:1,mood:{all:-1}}},
 {t:'Austeridade para recuperar a confiança',h:'Economiza R$ 15 bi e agrada o mercado, mas piora o curto prazo.',e:{cost:-15,gn:-.004,rat:3,mood:{all:-2}}}]})},
{id:'log',cool:8,when:S=>weakest(S,'infra').uf&&S.st[weakest(S,'infra').uf].idx.infra<32,build:S=>{const u=weakest(S,'infra');return{id:'t-log',tag:'Alarme: infraestrutura',t:`Colapso logístico em ${u.nome}`,d:`Estradas, energia e portos em ${u.nome} não acompanham a economia. Empresas ameaçam sair.`,o:[
 {t:'Plano emergencial de logística',h:'R$ 6 bi. Infraestrutura do estado sobe forte.',e:{cost:6,ridx:{[u.uf]:{infra:5}},mood:{[u.uf]:4}}},
 {t:'Concessão ao setor privado',h:'Receita de R$ 4 bi e melhora gradual.',e:{late:[{t:8,p:.4,evd:LATE.audit('a concessão de infraestrutura no estado')}],cost:-4,ridx:{[u.uf]:{infra:3}},inv:.4,mood:{[u.uf]:-1}}},
 {t:'Ignorar o problema',h:'Sem custo. O estado perde PIB e a população reage.',e:{gr:{[u.uf]:-.01},mood:{[u.uf]:-6}}}]}}},
{id:'seg',cool:8,when:S=>avgIdx(S,'seg')<40,build:S=>({id:'t-seg',tag:'Alarme: segurança',t:'Insegurança afasta investimentos',d:'Empresas reduzem operações em áreas com alta criminalidade.',o:[
 {t:'Reforço de policiamento e inteligência',h:'R$ 10 bi. Segurança sobe e o investimento volta.',e:{cost:10,idx:{seg:.8},inv:.4}},
 {t:'Operação de choque',h:'R$ 6 bi. Efeito curto.',e:{cost:6,idx:{seg:1},mood:{all:1}}},
 {t:'Aguardar os estados',h:'Sem custo. Investimento privado recua.',e:{inv:-1,mood:{all:-2}}}]})},
{id:'edu',cool:10,when:S=>avgIdx(S,'edu')<48,build:S=>({id:'t-edu',tag:'Alarme: capital humano',t:'Falta mão de obra qualificada',d:'Indústria e serviços relatam vagas abertas sem candidatos preparados.',o:[
 {t:'Programa nacional de qualificação',h:'R$ 12 bi. Educação sobe em todos os estados.',e:{cost:12,idx:{edu:.8}}},
 {t:'Facilitar a vinda de profissionais do exterior',h:'Sem custo. Alívio imediato e atrito político.',e:{inv:.3,mood:{all:-2}}},
 {t:'Aguardar o mercado ajustar',h:'Sem custo. Crescimento menor.',e:{gn:-.003}}]})},
{id:'boom',cool:8,when:S=>S.hist.length>4&&gl(S,3)>3.6,build:S=>({id:'t-boom',tag:'Sinal positivo: crescimento',t:'Boom de investimento estrangeiro',d:`Crescimento de ${f1(gl(S,3))}% ao ano atrai capital de fora.`,o:[
 {t:'Direcionar o capital para infraestrutura',h:'R$ 10 bi. Infraestrutura sobe e o ciclo se sustenta.',e:{cost:10,idx:{infra:2},gn:.003,inv:1.2}},
 {t:'Poupar o excedente',h:'Receita extra de R$ 20 bi e melhora da nota.',e:{cost:-20,rat:3}},
 {t:'Estimular o consumo',h:'Agrada o eleitor e aquece os preços.',e:{infl:.5,gn:.002,mood:{all:3}}}]})},
{id:'grau',cool:12,when:S=>S.rt>=70,build:S=>({id:'t-grau',tag:'Sinal positivo: nota de crédito',t:'Grau de investimento pleno',d:'A nota de crédito subiu e o país capta recursos a juros baixos.',o:[
 {t:'Captar barato para investir em capital humano',h:'R$ 15 bi. Educação e saúde sobem.',e:{cost:15,idx:{edu:2,saude:1.5},rat:-1}},
 {t:'Reduzir tributos',h:'R$ 20 bi. Crescimento e investimento privado sobem.',e:{cost:20,gn:.004,inv:.8,mood:{all:2}}},
 {t:'Formar reservas',h:'Economiza R$ 10 bi e consolida a nota.',e:{cost:-10,rat:2}}]})},
{id:'polo',cool:10,when:S=>avgIdx(S,'edu')>62&&avgIdx(S,'tech')>50,build:S=>({id:'t-polo',tag:'Sinal positivo: inovação',t:'Polo de inovação em formação',d:'Universidades e empresas se conectam e atraem startups.',o:[
 {t:'Cluster com universidades',h:'R$ 12 bi. Tecnologia sobe e atrai investimento.',e:{cost:12,idx:{tech:3},inv:.8}},
 {t:'Isenção para startups',h:'R$ 5 bi. Efeito menor e mais rápido.',e:{cost:5,inv:.5,gn:.002}},
 {t:'Deixar o mercado conduzir',h:'Sem custo e sem ganho adicional.',e:{ideo:.1}}]})},
{id:'esp',cool:10,when:S=>drNow(S)<60,build:S=>({id:'t-esp',tag:'Sinal positivo: dívida',t:'Espaço fiscal sobrando',d:`Dívida em ${f1(drNow(S))}% do PIB. O mercado espera uma decisão sobre o uso do espaço.`,o:[
 {t:'Investir em educação e saúde',h:'R$ 20 bi. Capital humano sobe.',e:{cost:20,idx:{edu:2.5,saude:1.5}}},
 {t:'Cortar tributos',h:'R$ 25 bi. Crescimento maior e popularidade.',e:{cost:25,gn:.004,mood:{all:3}}},
 {t:'Antecipar o pagamento da dívida',h:'Melhora a nota e reduz juros futuros.',e:{rat:4}}]})}];
function startTurn(S){seedStreams(S.seed,S.hist.length);S.ap=3;genPauta(S);if(S.reg){S.reg.left--;if(S.reg.left<=0)S.reg=null}
 const ce=crisisStep(S);
 let notice=null;if(!S.reg&&!S.crise&&S.hist.length>2&&RE()<.09*[.6,1,1.4][S.diff==null?1:S.diff]){const r=REGS[Math.floor(RE()*REGS.length)];S.reg={...r,left:10+Math.floor(RE()*13)};logE(S,'reg',r.n);notice={id:'reg-'+r.id,tag:'Cenário externo',t:r.n,d:r.d+` O ciclo deve durar cerca de ${Math.round(S.reg.left/4)} anos.`,o:[{t:'Entendido',h:'O efeito aparece no crescimento, nos juros e na confiança. Ajuste sua estratégia.',e:{}}]}}
for(const k in S.cd)S.cd[k]=Math.max(0,S.cd[k]-1);
 const q=[];if(S.hist.length>2)TRIG.forEach(tr=>{if(!(S.cd[tr.id]>0)&&q.length<2&&tr.when(S)){S.cd[tr.id]=tr.cool;const ev=tr.build(S);q.push(ev);logE(S,/positivo/.test(ev.tag||'')?'pos':'crise',ev.t)}});
 if(S.protest){q.unshift({id:'prot',tag:'Reação popular',t:'Protestos contra '+S.protest,d:'Manifestações tomam as ruas contra a lei aprovada sem apoio popular.',o:[{t:'Manter a lei',h:'Mantém a política e o desgaste.',e:{mood:{all:-2}}},{t:'Abrir diálogo e compensar',h:'R$ 6 bi em compensações, reduz o desgaste.',e:{cost:6,mood:{all:1}}},{t:'Recuar parcialmente',h:'Perde credibilidade e acalma as ruas.',e:{rat:-1,mood:{all:2}}}]});S.protest=null}
 if(ce)q.unshift(ce);
 if(S.late&&S.late.length){S.late.forEach(ev=>q.unshift(ev));S.late=[]}
 if(S.forceEv){q.unshift(constEv(S));S.forceEv=null}
 if(S.msgs&&S.msgs.length){q.unshift({id:'t-late',tag:'Efeito tardio',t:'Consequências de decisões passadas',d:S.msgs.join(' '),o:[{t:'Entendido',h:'Ajuste sua estratégia.',e:{}}]});S.msgs=[]}
 if(S.news&&S.news.length){q.unshift({id:'t-news',tag:'Coalizão',t:'Mudanças na base do governo',d:S.news.join(' '),o:[{t:'Entendido',h:'Veja a aba Coalizão para negociar ministérios e reconquistar apoio.',e:{}}]});S.news=[]}
 if(notice)q.unshift(notice);q.push(pickEvent(S).id);S.queue=q}

EV.push(
{id:'comercio',t:'Guerra comercial ameaça as exportações',d:'Um grande parceiro anuncia tarifas sobre produtos brasileiros.',o:[
 {t:'Retaliar com tarifas',h:'Agrada o eleitor, mas encarece insumos e arrisca uma espiral.',e:{gn:-.003,mood:{all:2},infl:.2,rat:-1}},
 {t:'Negociar abrindo o mercado',h:'Atrai investimento e acalma a crise, mas a indústria do Sul e do Sudeste reclama.',e:{gn:.002,inv:.5,mood:{S:-3,SE:-3},ideo:.15}},
 {t:'Subsidiar exportadores',h:'R$ 15 bi. Protege agro e indústria exportadora e pesa nas contas.',e:{cost:15,gn:-.001,mood:{CO:3,S:3}}}]},
{id:'bigtech',t:'Pressão por regular as big techs',d:'Plataformas digitais dominam publicidade, comércio e dados no país.',o:[
 {t:'Regulação dura',h:'Aprovação sobe, mas o investimento em tecnologia cai.',e:{idx:{tech:-1},mood:{all:1},inv:-.3}},
 {t:'Incentivar o setor',h:'Mais tecnologia e investimento privado, com desgaste político.',e:{inv:.6,idx:{tech:1.5},mood:{all:-1}}},
 {t:'Esperar',h:'Sem custo e sem ganho.',e:{}}]},
{id:'greveprof',t:'Greve de professores',d:'Redes estaduais param por reposição salarial e condições de trabalho.',o:[
 {t:'Conceder o reajuste',h:'R$ 12 bi. Educação melhora e a nota de crédito sofre um pouco.',e:{cost:12,idx:{edu:1.5},rat:-1}},
 {t:'Negociar parcialmente',h:'R$ 5 bi. Resolve pela metade e desgasta.',e:{cost:5,idx:{edu:.5},mood:{all:-1}}},
 {t:'Resistir',h:'Economiza e piora a educação e a imagem do governo.',e:{mood:{all:-3},idx:{edu:-1.5}}}]},
{id:'petroleo',t:'Alta do petróleo',d:'O preço dos combustíveis dispara e pressiona transportes e alimentos.',o:[
 {t:'Subsidiar combustíveis',h:'R$ 20 bi. Segura os preços e piora as contas e a nota.',e:{cost:20,infl:-.5,rat:-2}},
 {t:'Repassar os preços',h:'Inflação maior e forte desgaste.',e:{infl:.6,mood:{all:-3}}},
 {t:'Acelerar energias renováveis',h:'R$ 10 bi. Dá resultado no longo prazo, com pouco alívio agora.',e:{cost:10,infl:.2,idx:{infra:1,amb:1}}}]},
{id:'fuga',t:'Fuga de capitais',d:'Investidores estrangeiros retiram recursos e o dólar sobe rápido.',o:[
 {t:'Subir os juros',h:'Segura o câmbio e melhora a confiança, mas esfria a economia.',e:{rat:3,gn:-.004,unem:.3}},
 {t:'Vender reservas',h:'R$ 25 bi. Ganha tempo sem resolver a causa.',e:{cost:25,rat:1}},
 {t:'Deixar o câmbio flutuar',h:'Inflação maior e exportadores favorecidos.',e:{infl:.7,gn:.001}}]},
{id:'surto',t:'Surto epidêmico',d:'Uma doença infecciosa se espalha em várias regiões.',o:[
 {t:'Campanha nacional',h:'R$ 15 bi. Contém o surto e fortalece a saúde.',e:{cost:15,idx:{saude:2}}},
 {t:'Resposta focalizada',h:'R$ 6 bi. Menor impacto, menor custo.',e:{cost:6,idx:{saude:.8}}},
 {t:'Aguardar os estados',h:'Sem custo. A economia sofre e a população reage.',e:{gn:-.004,mood:{all:-3}}}]});
EVm.comercio=EV.find(e=>e.id==='comercio');EV.forEach(e=>{EVm[e.id]=e});
TRIG.push(
{id:'govcobra',cool:5,when:S=>S.hist.length>3&&UF.some(u=>S.st[u.uf].rel<45&&!inCoal(S,S.st[u.uf].gov))&&RE()<.35,build:S=>{const c=UF.filter(u=>S.st[u.uf].rel<45&&!inCoal(S,S.st[u.uf].gov)).sort((a,b)=>S.st[b.uf].pop-S.st[a.uf].pop)[0],p=S.st[c.uf].gov,sg=BLI[p].sig;return{id:'t-govc',tag:'Federalismo',t:`Governador do ${sg} cobra repasses em ${c.nome}`,d:`O governador de ${c.nome} (${sg}), fora da sua base, ameaça obstruir projetos e cobra recursos federais.`,o:[
 {t:'Liberar repasses',h:'R$ 8 bi. A relação com o governador melhora.',e:{cost:8,rel:{[c.uf]:18},mood:{[c.uf]:3}}},
 {t:'Trocar repasses por apoio no Congresso',h:`R$ 5 bi. O ${sg} passa a apoiar mais o governo no Congresso.`,e:{cost:5,rel:{[c.uf]:10},bloc:{[p]:8}}},
 {t:'Manter distância',h:'Sem custo. A relação piora e o estado executa menos.',e:{rel:{[c.uf]:-10},mood:{[c.uf]:-3}}}]}}},
{id:'bolsao',cool:10,when:S=>S.hist.length>3&&Math.max(...UF.map(u=>indOf(S,u.uf).pov))>40,build:S=>{const w=[...UF].sort((a,b)=>indOf(S,b.uf).pov-indOf(S,a.uf).pov).slice(0,3),n=w.map(u=>u.nome).join(', '),ids=w.map(u=>u.uf),rx=k=>Object.fromEntries(ids.map(i=>[i,k]));return{id:'t-bols',tag:'Alarme: bolsões de pobreza',t:'Bolsões de pobreza se aprofundam',d:`${n} concentram a maior pobreza do país (${w.map(u=>f1(indOf(S,u.uf).pov)+'%').join(', ')}). Prefeitos e governadores cobram um plano federal.`,o:[
 {t:'Programa de renda e saúde nos bolsões',h:'R$ 14 bi. Assistência social e saúde sobem nesses estados.',e:{cost:14,ridx:{...Object.fromEntries(ids.map(i=>[i,{social:4,saude:2.5}]))},mood:rx(5)}},
 {t:'Polos de emprego e infraestrutura local',h:'R$ 18 bi. Infraestrutura e educação sobem; efeito mais lento na pobreza.',e:{cost:18,ridx:{...Object.fromEntries(ids.map(i=>[i,{infra:4,edu:2.5}]))},mood:rx(3),gr:rx(.004)}},
 {t:'Manter a política atual',h:'Sem custo. A pobreza persiste e o desgaste local cresce.',e:{mood:rx(-5)}}]}}},
{id:'esc',cool:10,when:S=>S.hist.length>6&&scandalMins(S)>0&&RE()<scandalP(S),build:S=>{const p=scandalParty(S),sg=BLI[p].sig;return{id:'t-esc',tag:'Crise política',t:`Escândalo atinge ministério do ${sg}`,d:`Reportagens ligam um ministro indicado pelo ${BLI[p].n} (${sg}) a um esquema de desvio de verbas. O partido tem ${S.mins[p]} ministério(s) e ${S.seats[p].cd} deputados.`,o:[
 {t:'Demitir o ministro e abrir investigação',h:`Reduz o desgaste. O ${sg} perde um ministério e fica insatisfeito.`,e:{mood:{all:2},coal:{sat:{[p]:-25},min:{[p]:-1}}}},
 {t:'Blindar o aliado',h:`O ${sg} agradece e fica mais fiel, mas a opinião pública pune e a nota piora.`,e:{mood:{all:-5},rat:-1,bloc:{C:4},coal:{sat:{[p]:12}}}},
 {t:'Romper com o partido',h:`O ${sg} sai da base e vai para a oposição. A imagem melhora, o Congresso piora.`,e:{mood:{all:3},coal:{leave:[p]}}},
 {t:'Apoiar investigação independente',h:'Custo político moderado e melhora a confiança nas instituições.',e:{mood:{all:-1},rat:1,coal:{sat:{[p]:-8}}}}]}}},
{id:'greve',cool:8,when:S=>S.unem>10&&natAppr(S)<38,build:S=>({id:'t-greve',tag:'Alarme: desemprego e popularidade',t:'Greve geral e protestos',d:'Centrais sindicais e movimentos sociais paralisam grandes cidades.',o:[
 {t:'Abrir diálogo e conceder benefícios',h:'R$ 15 bi. Acalma as ruas.',e:{cost:15,mood:{all:4},infl:.2}},
 {t:'Endurecer a resposta',h:'Sem custo. Piora a rejeição e o clima político.',e:{mood:{all:-4},bloc:{E:-8,CE:-5}}},
 {t:'Antecipar um plano de empregos',h:'R$ 10 bi. Reduz o desemprego aos poucos.',e:{cost:10,unem:-.5,mood:{all:1}}}]})},
{id:'calote',cool:12,when:S=>drNow(S)>140||S.rt<10,build:S=>({id:'t-calote',tag:'Alarme: crise da dívida',t:'Risco de calote da dívida',d:'Credores recusam rolar títulos. O país está perto de não conseguir pagar o que deve.',o:[
 {t:'Reestruturar com os credores',h:'Economiza R$ 30 bi, nota melhora com o tempo e a recessão é dura.',e:{cost:-30,rat:6,gn:-.006,mood:{all:-5}}},
 {t:'Pedir socorro ao FMI',h:'Economiza R$ 20 bi, melhora a nota e exige austeridade.',e:{cost:-20,rat:4,gn:-.003,mood:{all:-3}}},
 {t:'Declarar moratória',h:'Alívio imediato e dano grande à credibilidade.',e:{rat:-10,inv:-2,infl:2,gn:-.01,mood:{all:-2}}}]})},
{id:'hiper',cool:10,when:S=>S.infl>12,build:S=>({id:'t-hiper',tag:'Alarme: inflação fora de controle',t:'Hiperinflação à vista',d:`A inflação chegou a ${f1(S.infl)}% ao ano e os preços mudam toda semana.`,o:[
 {t:'Choque monetário',h:'Derruba a inflação com recessão e desemprego.',e:{infl:-3,gn:-.008,unem:1.5,mood:{all:-5}}},
 {t:'Plano de estabilização',h:'Economiza R$ 15 bi, reduz a inflação e melhora a nota.',e:{infl:-2,cost:-15,mood:{all:-2},rat:2}},
 {t:'Controle de preços',h:'Alívio curto e dano ao investimento.',e:{infl:-1,inv:-2,mood:{all:1}}}]})});

const OL=[-2,-.5],OR=[.5,2],OC=[-.6,.6];
LAWS.push(
{id:'tlucros',only:OL,t:'Taxação de lucros e dividendos',tipo:'PL',b:-1.5,d:'Cobra imposto sobre lucros distribuídos a acionistas.',h:'Receita de 0,5% do PIB; investimento privado −0,4 p.p.',fx:{rev:.005,inv:-.4,mood:{all:-1}}},
{id:'fomento',only:OL,t:'Banco público de fomento ampliado',tipo:'PL',b:-1.2,d:'Crédito subsidiado a indústria e infraestrutura.',h:'+0,3 p.p. de crescimento ao ano e +0,6 p.p. de investimento privado; custa 0,2% do PIB e a nota de crédito cai 2',fx:{gn:.003,inv:.6,mand:.002,rat:-2}},
{id:'moradia',only:OL,t:'Programa de moradia popular',tipo:'PL',b:-1.4,d:'Financia habitação e urbanização para famílias de baixa renda.',h:'+0,6 ponto de assistência social e +0,4 de infraestrutura ao ano; custa 0,3% do PIB',fx:{idx:{social:.6,infra:.4},mand:.003,mood:{NE:2,N:2}}},
{id:'tcorp',only:OR,t:'Corte de impostos sobre empresas',tipo:'PL',b:1.4,d:'Reduz a carga sobre lucros e investimentos produtivos.',h:'+0,3 p.p. de crescimento ao ano e +0,8 p.p. de investimento privado; receita −0,4% do PIB',fx:{rev:-.004,gn:.003,inv:.8}},
{id:'abertura',only:OR,t:'Abertura comercial',tipo:'PL',b:1.3,d:'Reduz tarifas de importação e fecha acordos de livre comércio.',h:'+0,4 p.p. de crescimento ao ano e +0,5 p.p. de investimento privado; desgaste no Sul e no Sudeste industriais',fx:{gn:.004,inv:.5,mood:{SE:-2,S:-2}}},
{id:'desbur',only:OR,t:'Desburocratização e segurança jurídica',tipo:'PL',b:1,d:'Simplifica licenças e dá previsibilidade a contratos.',h:'+0,8 p.p. de investimento privado e nota de crédito +2; meio ambiente −0,5 ponto ao ano',fx:{inv:.8,rat:2,idx:{amb:-.5}}},
{id:'pacto2',only:OC,t:'Pacto de produtividade',tipo:'PL',b:0,d:'Acordo entre governo, empresas e sindicatos para elevar a produtividade.',h:'+0,3 p.p. de crescimento ao ano e +0,4 p.p. de investimento privado; relação com governadores +5',fx:{gn:.003,inv:.4,rel:5}},
{id:'cadunico',only:OC,t:'Revisão de gastos e eficiência',tipo:'PL',b:0,d:'Avalia programas públicos e corta os que não funcionam.',h:'Economiza cerca de R$ 22 bi ao ano sem cortar serviços',fx:{mand:-.002}});
LAWS.forEach(l=>{LAW[l.id]=l});
EV.push(
{id:'sindicatos',only:OL,t:'Centrais pedem aumento real',d:'Sindicatos cobram reajuste acima da inflação para o funcionalismo e o salário mínimo.',o:[
 {t:'Conceder o reajuste',h:'R$ 12 bi. Agrada, pressiona preços e a nota de crédito.',e:{cost:12,infl:.3,mood:{all:2},rat:-1}},
 {t:'Negociar metas de produtividade',h:'R$ 4 bi. Ganho moderado.',e:{cost:4,mood:{all:1},gn:.001}},
 {t:'Recusar',h:'Sem custo e a base de esquerda se afasta de você.',e:{mood:{all:-2},bloc:{own:-6}}}]},
{id:'ocupacoes',only:OL,t:'Movimentos ocupam terras',d:'Ocupações pressionam por reforma agrária enquanto proprietários reagem.',o:[
 {t:'Assentar famílias',h:'R$ 10 bi. Ajuda o Norte, desgasta o Centro-Oeste.',e:{cost:10,idx:{social:1},mood:{CO:-4,N:2}}},
 {t:'Mediar com proprietários',h:'R$ 3 bi. Evita o confronto.',e:{cost:3,mood:{CO:-1}}},
 {t:'Reprimir as ocupações',h:'Desgasta com a sua própria base.',e:{mood:{all:-2},bloc:{own:-6}}}]},
{id:'ruralista',only:OR,t:'Bancada ruralista cobra renegociação',d:'Produtores pedem alongar dívidas rurais após a safra.',o:[
 {t:'Renegociar as dívidas',h:'R$ 15 bi. Beneficia o Centro-Oeste e piora a nota de crédito.',e:{cost:15,gr:{CO:.004},rat:-1,mood:{CO:3}}},
 {t:'Crédito seletivo',h:'R$ 6 bi. Alívio parcial.',e:{cost:6,gr:{CO:.002}}},
 {t:'Negar',h:'Economiza e a base de direita reclama.',e:{mood:{CO:-4},bloc:{CD:-5,D:-5}}}]},
{id:'mercado',only:OR,t:'Mercado cobra privatizações',d:'Investidores esperam um pacote de venda de estatais.',o:[
 {t:'Anunciar o pacote',h:'Receita de R$ 30 bi, nota de crédito +3 e desgaste no Nordeste.',e:{cost:-30,rat:3,inv:.5,mood:{NE:-3}}},
 {t:'Fazer gradualmente',h:'Receita de R$ 10 bi e nota +1.',e:{cost:-10,rat:1}},
 {t:'Segurar',h:'Evita o desgaste e o mercado reage mal.',e:{rat:-1,inv:-.3}}]},
{id:'ancora',only:OC,t:'Aliados pressionam por cargos e emendas',d:'O Centrão ameaça trocar de lado se não for atendido.',o:[
 {t:'Atender',h:'R$ 8 bi. Centrão +10.',e:{cost:8,bloc:{C:10}}},
 {t:'Negociar a agenda',h:'Centrão +4 e algum desgaste.',e:{bloc:{C:4},mood:{all:-1}}},
 {t:'Resistir',h:'Centrão −8 e aprovação ligeiramente maior.',e:{bloc:{C:-8},mood:{all:2}}}]});
EV.forEach(e=>{EVm[e.id]=e});
const SCEN=[
{id:'estavel',n:'Herança estável',d:'O país está em equilíbrio e sem grandes urgências. Você começa com o que a história lhe deu.',fx:S=>{}},
{id:'fiscal',n:'Herança fiscal ruim',d:'Contas deterioradas, dívida alta e nota de crédito baixa. Os juros pesam desde o primeiro dia.',fx:S=>{S.debt+=.14*gdp(S);S.rt=32}},
{id:'inflacao',n:'Inflação alta',d:'Os preços corroem a renda e o Banco Central já subiu os juros.',fx:S=>{S.infl=8;S.rt=38;S.unem=6.8}},
{id:'exporta',n:'Boom de exportações',d:'Preços de commodities em alta e investidores otimistas. O país tem folga para decidir.',fx:S=>{S.reg={...REGS[0],left:14};S.I=16.5}},
{id:'recessao',n:'Recessão herdada',d:'A economia vem de dois anos de queda. Desemprego alto e empresas sem investir.',fx:S=>{S.unem=10;S.I=12.5;UF.forEach(u=>{S.st[u.uf].mood-=6})}},
{id:'hostil',n:'Congresso hostil',d:'Sua base é pequena. Cada projeto exigirá negociação.',fx:S=>{const o=S.party,t=S.party==='PLB'?'PT':S.x<0?'PLB':'PT',m=Math.min(45,Math.floor(S.seats[o].cd*.5)),n=Math.min(5,Math.floor(S.seats[o].sn*.5));S.seats[o].cd-=m;S.seats[t].cd+=m;S.seats[o].sn-=n;S.seats[t].sn+=n}},
{id:'infrad',n:'Infraestrutura deteriorada',d:'Estradas, portos e energia sofrem anos de abandono. O crescimento é limitado por gargalos logísticos.',fx:S=>{UF.forEach(u=>{S.st[u.uf].idx.infra=cl(S.st[u.uf].idx.infra-10);S.st[u.uf].i0.infra=S.st[u.uf].idx.infra})}}];

LAWS.push(
{id:'bol_edu',bold:1,pop:6,t:'Revolução educacional',tipo:'PEC',b:-.9,d:'Escola em tempo integral, carreira docente nacional e metas de alfabetização.',h:'+2 pontos de educação ao ano; custa 0,8% do PIB ao ano',fx:{idx:{edu:2},mand:.008,sched:[{t:24,pg:.004,evd:LATE.fruto('revolução educacional')}]}},
{id:'bol_infra',bold:1,pop:8,t:'Plano nacional de infraestrutura',tipo:'PEC',b:.5,d:'Programa de obras e concessões em rodovias, ferrovias, portos e energia.',h:'+2 pontos de infraestrutura ao ano, +1,5 p.p. de investimento privado e +0,3 p.p. de crescimento; custa 0,6% do PIB',fx:{idx:{infra:2},inv:1.5,gn:.003,mand:.006}},
{id:'bol_priv',bold:1,pop:-10,t:'Privatização ampla de estatais',tipo:'PEC',b:1.5,d:'Venda de grandes estatais de energia, petróleo, bancos e logística.',h:'Receita única de R$ 250 bi, +0,5 p.p. de crescimento, +1,5 p.p. de investimento privado e nota de crédito +6; forte rejeição no Nordeste e no Norte',fx:{once:-250,gn:.005,inv:1.5,rat:6,mood:{NE:-6,N:-3}}},
{id:'bol_trib',bold:1,pop:-4,t:'Reforma tributária radical (imposto único)',tipo:'PEC',b:.9,d:'Substitui dezenas de tributos por um imposto único sobre o consumo.',h:'+0,8 p.p. de crescimento ao ano e +2 p.p. de investimento privado; receita −0,6% do PIB',fx:{rev:-.006,gn:.008,inv:2}},
{id:'bol_renda',bold:1,pop:12,t:'Renda básica universal ampla',tipo:'PEC',b:-1.7,d:'Transferência mensal a todos os adultos de baixa renda, financiada pelo orçamento.',h:'+2,5 pontos de assistência social ao ano, aprovação +4 na hora; custa 1,5% do PIB, inflação +0,4 p.p. e nota de crédito −6',fx:{mand:.015,idx:{social:2.5},infl:.4,rat:-6,mood:{all:4}}},
{id:'bol_estado',bold:1,pop:-8,t:'Reforma do Estado',tipo:'PEC',b:1,d:'Reduz cargos, adota meritocracia e extingue órgãos duplicados.',h:'Economiza 1% do PIB ao ano, nota de crédito +6 e +0,2 p.p. de crescimento; forte desgaste no Distrito Federal',fx:{mand:-.010,rat:6,gn:.002,mood:{DF:-15,all:-2}}},
{id:'bol_prev',bold:1,pop:-14,t:'Previdência por capitalização',tipo:'PEC',b:1.6,d:'Troca o sistema de repartição por contas individuais de aposentadoria.',h:'Economiza 1,2% do PIB ao ano, nota de crédito +8 e +1 p.p. de investimento privado; enorme desgaste popular',fx:{mand:-.012,rat:8,inv:1,mood:{all:-4},sched:[{t:28,pg:.004,evd:LATE.fruto('previdência por capitalização')}]}},
{id:'bol_verde',bold:1,pop:2,t:'Pacto verde e transição energética',tipo:'PEC',b:-1,d:'Metas de baixo carbono, energias renováveis e bioeconomia.',h:'Meio ambiente +2 e infraestrutura +0,8 ao ano, +0,8 p.p. de investimento privado; custa 0,4% do PIB e o Centro-Oeste cresce menos',fx:{idx:{amb:2,infra:.8},inv:.8,mand:.004,vs:{agro:-.004,min:-.004,serv:.001}}},
{id:'bol_seg',bold:1,pop:4,t:'Reforma da segurança pública',tipo:'PEC',b:.8,d:'Integra as polícias, cria inteligência nacional e reforma o sistema prisional.',h:'+2,5 pontos de segurança ao ano e +0,6 p.p. de investimento privado; custa 0,4% do PIB',fx:{idx:{seg:2.5},inv:.6,mand:.004,mood:{S:2,CO:2,SE:2}}},
{id:'bol_saude',bold:1,pop:8,t:'SUS universal reformado',tipo:'PEC',b:-.8,d:'Reestrutura a rede, amplia a atenção primária e a regulação de leitos.',h:'+2,5 pontos de saúde ao ano; custa 0,8% do PIB',fx:{idx:{saude:2.5},mand:.008}},
{id:'bol_fed',bold:1,pop:2,t:'Novo pacto federativo',tipo:'PEC',b:0,d:'Redistribui receitas e competências entre União, estados e municípios.',h:'Relação com governadores +15, +0,3 p.p. de crescimento e nota +2; custa 0,3% do PIB',fx:{rel:15,gn:.003,mand:.003,rat:2}},
{id:'bol_fimreel',bold:1,pop:6,t:'Fim da reeleição',tipo:'PEC',b:-.3,d:'Mandato único de 4 anos para presidente, governadores e prefeitos, sem reeleição.',h:'Você não poderá disputar a reeleição: ao fim do mandato o sucessor assume. Relação com governadores +4 e leve ganho de imagem; boa aceitação popular',fx:{lim:1,mood:{all:1},rel:4}},
{id:'bol_reelilim',bold:1,pop:-16,t:'Reeleição ilimitada',tipo:'PEC',b:.4,d:'Permite disputar a reeleição sem limite de mandatos consecutivos.',h:'Elimina o limite de mandatos. Exige aprovação alta (cerca de 66% ou mais) e 3/5 do Congresso; sem apoio popular, provoca ampla rejeição e protestos',fx:{lim:99,mood:{all:-1}}});
LAWS.forEach(l=>{LAW[l.id]=l});
function newGame(x,diff,party,seed){seed=seed!=null?seed:Math.floor(Math.random()*1e9);seedStreams(seed,0);const S=newState(x);S.seed=seed;S.diff=diff;S.party=party||'PT';const sc=SCEN[Math.floor(RW()*SCEN.length)];sc.fx(S);S.scen=sc.id;
 UF.forEach(u=>{S.st[u.uf].appr=approval(S,u)});S.nb=Object.fromEntries(SEC.map(z=>[z.id,avgIdx(S,z.id)]));initCoal(S);pickRival(S);initGov(S);S.hist=[hrow(S,'T4/2026',2.5,S.debt/gdp(S)*100)];
 S.notice={id:'scen-'+sc.id,tag:'Cenário inicial',t:sc.n,d:sc.d,o:[{t:'Começar',h:'Dificuldade: '+['tranquila','normal','dura'][diff==null?1:diff]+'.',e:{}}]};return S}
// CORE-END
