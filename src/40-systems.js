// EXT-START
const logE=(S,k,t)=>{(S.log=S.log||[]).push({i:S.hist.length-1,k,t})};
// ---- vocações econômicas: agro, indústria, mineração e energia, serviços (% do PIB estadual) ----
const VK=['agro','ind','min','serv'],VN={agro:'Agropecuária',ind:'Indústria',min:'Mineração e energia',serv:'Serviços'};
const VOC={AC:[42,6,4,48],AP:[10,10,30,50],AM:[8,38,6,48],PA:[22,10,32,36],RO:[45,10,3,42],RR:[30,5,2,63],TO:[48,8,2,42],
AL:[18,22,2,58],BA:[22,20,10,48],CE:[10,24,2,64],MA:[24,14,12,50],PB:[10,20,2,68],PE:[10,24,2,64],PI:[22,10,3,65],RN:[10,16,14,60],SE:[10,22,12,56],
DF:[1,4,0,95],GO:[30,18,5,47],MT:[55,10,6,29],MS:[45,16,5,34],ES:[12,22,20,46],MG:[16,24,14,46],RJ:[2,16,26,56],SP:[4,28,2,66],
PR:[26,26,1,47],RS:[22,28,1,49],SC:[16,36,1,47]};
const vocG=(uf,vs)=>{if(!vs)return 0;const v=VOC[uf];return VK.reduce((a,k,i)=>a+(vs[k]||0)*v[i]/100,0)};
const vocMain=uf=>{const v=VOC[uf],i=v.indexOf(Math.max(...v));return VN[VK[i]]};
// ---- indicadores sociais e de desenvolvimento (derivados dos índices setoriais e da renda) ----
function indOf(S,uf){const g=S.st[uf],i=g.idx,pc=g.pib/g.pop,r=pc/S.pc0;
 const hc=.6*i.saude+.2*i.infra+.1*i.edu+.1*i.social;
 const le=cl(60.6+.25*hc+.04*(i.seg-50)-.05*Math.max(0,S.infl-8),55,86);
 const im=cl(3+60.8*Math.exp(-.032*hc),2,45);
 const mys=cl(3+.09*i.edu+.012*i.tech,2,14),eys=cl(9+.11*i.edu,8,18);
 const lit=cl(100-40*Math.exp(-.04*i.edu),70,99.8);
 const inc=cl(Math.log(pc*360/100)/Math.log(750),0,1),H=cl((le-20)/65,0,1),E=cl((mys/15+eys/18)/2,0,1);
 const idh=Math.cbrt(H*E*inc);
 const pov=cl(4+72*Math.exp(-1.5*r)*(1-.005*(i.social-50))+.8*(S.unem-7.5),2,80);
 const gini=cl(.545-.0018*(i.social-47)-.001*(i.edu-55)+.004*(S.unem-7.5),.3,.65);
 const hom=cl(75*Math.exp(-.02*i.seg-.004*(i.social-40))*(1+.02*(S.unem-7.5)),2,80);
 const san=cl(20+.8*i.infra,0,100);
 return{idh,le,im,hc,mys,lit,pov,gini,hom,san}}
const IND=[
{k:'idh',n:'IDH',d:3,hi:1,fmt:v=>fm(v,3),sc:v=>(v-.55)/.4*100,t:'Índice de Desenvolvimento Humano',d0:'Combina saúde (expectativa de vida), educação (anos de estudo) e renda por habitante. Vai de 0 a 1; acima de 0,80 é considerado muito alto.',how:'Sobe com saúde, educação e renda per capita. A renda tem retorno decrescente (logarítmico), enquanto saúde e educação movem o índice de forma mais firme.'},
{k:'le',n:'Expectativa de vida',d:1,hi:1,fmt:v=>fm(v,1)+' anos',sc:v=>(v-62)/22*100,t:'Expectativa de vida ao nascer',d0:'Anos que um recém-nascido deve viver nas condições atuais de saúde.',how:'Depende do índice de qualidade da saúde (SUS, saneamento, educação e proteção social) e da segurança. Inflação muito alta reduz um pouco.'},
{k:'im',n:'Mortalidade infantil',d:1,hi:-1,fmt:v=>fm(v,1)+' ‰',sc:v=>(30-v)/26*100,t:'Mortalidade infantil',d0:'Mortes de crianças com menos de 1 ano por mil nascidos vivos.',how:'Cai de forma exponencial com a qualidade da saúde: SUS (60%), saneamento e infraestrutura (20%), educação (10%) e assistência social (10%). Os primeiros pontos de melhoria rendem mais em estados atrasados.'},
{k:'hc',n:'Qualidade da saúde',d:0,hi:1,fmt:v=>fm(v,0),sc:v=>v,t:'Índice de qualidade da saúde',d0:'Índice de 0 a 100 que reúne acesso e resultados do sistema de saúde.',how:'Média ponderada de saúde (60%), infraestrutura e saneamento (20%), educação (10%) e assistência social (10%).'},
{k:'mys',n:'Anos de estudo',d:1,hi:1,fmt:v=>fm(v,1)+' anos',sc:v=>(v-4)/9*100,t:'Escolaridade média',d0:'Anos médios de estudo da população adulta.',how:'Segue o índice de educação, com pequena ajuda de ciência e tecnologia. Muda lentamente porque depende de gerações inteiras.'},
{k:'lit',n:'Alfabetização',d:1,hi:1,fmt:v=>fm(v,1)+'%',sc:v=>(v-85)/15*100,t:'Taxa de alfabetização',d0:'Parcela da população adulta que sabe ler e escrever.',how:'Depende do índice de educação; os últimos pontos são os mais difíceis de ganhar.'},
{k:'hom',n:'Homicídios',d:1,hi:-1,fmt:v=>fm(v,1)+'/100 mil',sc:v=>(45-v)/40*100,t:'Taxa de homicídios',d0:'Homicídios por 100 mil habitantes ao ano.',how:'Cai com o índice de segurança e, em menor grau, com assistência social e educação. Desemprego alto a empurra para cima.'},
{k:'pov',n:'Pobreza',d:1,hi:-1,fmt:v=>fm(v,1)+'%',sc:v=>(50-v)/45*100,t:'Taxa de pobreza',d0:'Parcela da população abaixo da linha de pobreza.',how:'Cai com a renda per capita do estado (crescimento) e com a assistência social; sobe com o desemprego. Estados acima de 35% são bolsões de pobreza.'},
{k:'gini',n:'Desigualdade (Gini)',d:3,hi:-1,fmt:v=>fm(v,3),sc:v=>(.62-v)/.3*100,t:'Índice de Gini',d0:'Mede a desigualdade de renda: 0 é igualdade total e 1 é concentração total.',how:'Cai com assistência social e educação e sobe com o desemprego.'},
{k:'san',n:'Saneamento',d:0,hi:1,fmt:v=>fm(v,0)+'%',sc:v=>v,t:'Cobertura de saneamento',d0:'Parcela dos domicílios com água tratada e esgoto adequados.',how:'Segue o índice de infraestrutura. É o canal pelo qual a infraestrutura melhora a saúde.'}];
const INDK=IND.map(x=>x.k),INDM=Object.fromEntries(IND.map(x=>[x.k,x]));
function indNat(S){const o={},pt=popSum(S);UF.forEach(u=>{const r=indOf(S,u.uf),p=S.st[u.uf].pop/pt;INDK.forEach(k=>{o[k]=(o[k]||0)+r[k]*p})});return o}
const indRow=S=>{const o=indNat(S);o.rv=rvPoll(S);return o};
// ---- coalizão, ministérios e fidelidade ----
const NMIN=20,inCoal=(S,id)=>!!S.coal&&S.coal.includes(id);
const freeMin=S=>NMIN-BL.reduce((a,b)=>a+(S.mins[b.id]||0),0);
function initCoal(S){const own=S.party;S.sat={};S.mins={};S.lowc={};BL.forEach(b=>{S.sat[b.id]=55;S.mins[b.id]=0;S.lowc[b.id]=0});
 const ord=[...BL].sort((a,b)=>Math.abs(a.pos-S.x)-Math.abs(b.pos-S.x)).map(b=>b.id).filter(id=>id!==own);S.coal=[own];let seats=S.seats[own].cd;
 for(const id of ord){if(seats>=240)break;S.coal.push(id);seats+=S.seats[id].cd;S.sat[id]=60}
 const others=S.coal.filter(id=>id!==own),tot=others.reduce((a,id)=>a+S.seats[id].cd,0)||1;S.mins[own]=others.length?7:6;let left=NMIN-S.mins[own]-(others.length?0:0);
 others.forEach(id=>{const n=Math.min(6,Math.max(1,Math.round(11*S.seats[id].cd/tot)));if(left>=n){S.mins[id]=n;left-=n}});S.news=[]}
function leaveCoal(S,id,why){if(!inCoal(S,id)||id===S.party)return;S.coal=S.coal.filter(x=>x!==id);S.mins[id]=0;S.lowc[id]=0;bonus(S,id,-22);(S.news=S.news||[]).push(`${BLI[id].sig} deixou a base do governo${why?' ('+why+')':''}.`);logE(S,'coal',`${BLI[id].sig} deixa a base`)}
function joinCoal(S,id){if(inCoal(S,id))return;S.coal.push(id);S.sat[id]=55;S.lowc[id]=0;bonus(S,id,8);logE(S,'coal',`${BLI[id].sig} entra na base`)}
function coalFx(S,c){for(const id in(c.sat||{}))S.sat[id]=cl(S.sat[id]+c.sat[id]);for(const id in(c.min||{}))S.mins[id]=Math.max(0,(S.mins[id]||0)+c.min[id]);(c.leave||[]).forEach(id=>leaveCoal(S,id,'ruptura'))}
function coalQuarter(S){const cs=S.coal,own=S.party,seats=cs.reduce((a,id)=>a+S.seats[id].cd,0)||1;
 [...cs].forEach(id=>{if(id===own){S.sat[id]=70;return}
  const fair=NMIN*S.seats[id].cd/seats,q=fair>0?(S.mins[id]||0)/fair:1;
  const tg=cl(54+26*cl(q-1,-1.2,1)-8*Math.abs(S.x-BLI[id].pos)+.3*(natAppr(S)-45),0,100);
  S.sat[id]=cl(S.sat[id]+.3*(tg-S.sat[id]));S.lowc[id]=S.sat[id]<22?(S.lowc[id]||0)+1:0;
  if(S.lowc[id]>=2)leaveCoal(S,id,'insatisfação com ministérios e cargos')});
 BL.forEach(b=>{if(!cs.includes(b.id))S.sat[b.id]=55})}
const scandalMins=S=>S.coal.reduce((a,id)=>a+(id===S.party?0:(S.mins[id]||0)*(GRP.C.includes(id)?1.3:1)),0);
const scandalP=S=>(.008+.0045*scandalMins(S))*(S.fl&&S.fl.anti?.5:1);
function scandalParty(S){const c=S.coal.filter(id=>id!==S.party&&(S.mins[id]||0)>0);if(!c.length)return null;const w=c.map(id=>(S.mins[id]||0)*(GRP.C.includes(id)?1.5:1)),t=w.reduce((a,v)=>a+v,0);let r=RE()*t;for(let i=0;i<c.length;i++){r-=w[i];if(r<=0)return c[i]}return c[0]}
const fid=(S,i)=>{const id=BL[i].id;return inCoal(S,id)?.1*(S.sat[id]-55)/45+(id===S.party?.03:0):-.02};
// ---- governadores como atores ----
function pickGov(S,u,prev){const w=BL.map(b=>{let v=Math.exp(-1.3*Math.abs(b.pos-u.lean))*(.5+S.seats[b.id].cd/100);if(b.id===S.party)v*=cl(1+(natAppr(S)-45)/50,.5,1.6);if(b.id===prev)v*=1.3;return v}),t=w.reduce((a,v)=>a+v,0);let r=RL()*t;for(let i=0;i<BL.length;i++){r-=w[i];if(r<=0)return BL[i].id}return BL[0].id}
function electGov(S,u){const g=S.st[u.uf];g.gov=pickGov(S,u,g.gov);g.gx=cl(BLI[g.gov].pos+(RL()-.5)*.3,-2,2)}
function initGov(S){UF.forEach(u=>{const g=S.st[u.uf];electGov(S,u);g.rel=relTarget(S,g,1);g.appr=approval(S,u)});S.govRes=govRes(S)}
function govRes(S){const o={own:0,coal:0,opp:0};UF.forEach(u=>{const p=S.st[u.uf].gov;if(p===S.party)o.own++;else if(inCoal(S,p))o.coal++;else o.opp++});return o}
function gvb(S,id){let b=0;for(let i=0;i<UF.length;i++){const g=S.st[UF[i].uf];if(g.gov===id)b+=(g.rel-50)/50*1.8}return cl(b,-9,9)}
// ---- rival e sucessão ----
const RNM=['Marina','Rafael','Camila','Eduardo','Helena','Gustavo','Beatriz','Henrique','Luiza','Fernando','Aline','Ricardo'],RSN=['Albuquerque','Tavares','Monteiro','Figueiredo','Carvalho','Nogueira','Prado','Siqueira','Vasconcelos','Barreto','Lacerda','Medeiros'];
function pickRival(S,keepName){const c=BL.filter(b=>b.id!==S.party&&Math.abs(b.pos-S.x)>=1.2);const pool=(c.length?c:BL.filter(b=>b.id!==S.party)).sort((a,b)=>S.seats[b.id].cd-S.seats[a.id].cd);
 const p=pool[0],nm=keepName&&S.rv&&S.rv.p===p.id?S.rv.n:RNM[Math.floor(RW()*RNM.length)]+' '+RSN[Math.floor(RW()*RSN.length)];S.rv={p:p.id,n:nm,b:S.rv?S.rv.b*.5:0}}
const rvPoll=S=>S.rv?cl(100-natShare(S)+S.rv.b,10,90):50;
function rvQuarter(S){if(!S.rv)return;const gA=S.hist.length>1?S.hist[S.hist.length-1].g:2;S.rv.b=cl(.9*S.rv.b+(RW()-.5)*4+.25*Math.max(0,1.5-gA)+.35*Math.max(0,(typeof natAppr==='function'?natAppr(S):50)-62)/10*2,-8,12)}
// ---- sucessão: o que acontece depois de você ----
function autoPick(S,e){const i=Math.floor(RE()*e.o.length);applyFx(S,e.o[i].e)}
function succession(S,mode){if(S.succ)return S.succ;const s0=legacy(S).score,lb=`T${S.q}/${S.ano}`;
 const endY=Math.min(END,S.ano+8),lose=mode==='lose';
 S.succ={mode,s0,from:lb,x0:S.x,rival:lose&&S.rv?{p:S.rv.p,n:S.rv.n}:null,hi0:S.hist.length,flips:0,note:[]};
 const own=BLI[S.party];S.x=lose&&S.rv?BLI[S.rv.p].pos:S.x;
 const who=lose&&S.rv?`${S.rv.n} (${BLI[S.rv.p].sig})`:'o sucessor do seu partido';
 S.succ.who=who;S.succ.sx=S.x;logE(S,'elec',lose?`Derrota. Assume ${who}`:`Você sai. Assume ${who}`);
 const sq=.97+RL()*.16+(lose?0:.03);let guard=0;
 while(!(S.ano===endY&&S.q===4)&&S.ano<=END&&guard++<40){
  const el=ELECT.includes(S.ano)&&S.q===4;
  S.q++;if(S.q>4){S.q=1;S.ano++}
  if(S.ano>END||(S.ano===END&&S.q>4))break;
  startTurn(S);S.queue.forEach(e0=>{const e=typeof e0==='string'?EVm[e0]:e0;autoPick(S,e)});S.queue=[];
  UF.forEach(u=>SEC.forEach(s=>{S.st[u.uf].m[s.id]=sq}));
  S.sent=[];simQuarter(S);S.hist[S.hist.length-1].suc=1;
  if(S.q===4&&ELECT.includes(S.ano)&&S.ano<endY){const r=election(S,'base');S.hist[S.hist.length-1].suc=1;if(!r.win){S.succ.flips++;const nx=S.x>=0?-1.2:1.2;S.x=nx;S.succ.note.push(`Em ${S.ano} a oposição venceu e o governo mudou de linha.`);logE(S,'elec',`Alternância de poder em ${S.ano}`)}else S.succ.note.push(`Em ${S.ano} o sucessor foi reeleito.`);reelect(S)}
 }
 S.succ.s1=legacy(S).score;S.succ.lbl=`T${S.q}/${S.ano}`;return S.succ}
// ---- limite de mandatos e interregno ----
const limOf=S=>S.lim==null?2:S.lim,termLimited=S=>(S.consec||1)>=limOf(S);
const limTxt=S=>limOf(S)===1?'sem reeleição':limOf(S)>=99?'reeleição ilimitada':'1 reeleição';
function interregnum(S){const lb=`T${S.q}/${S.ano}`,x0=S.x;if(S.rv)S.rv.b+=3;const res=election(S,'');reelect(S);
 const side=res.win?'own':'opp';if(!res.win&&S.rv)S.x=BLI[S.rv.p].pos;
 const who=res.win?`o candidato do seu partido (${BLI[S.party].sig})`:`${S.rv.n} (${BLI[S.rv.p].sig})`;
 const I={from:lb,x0,side,who,nat:res.nat,laws:[],evs:[],note:[],flip:!res.win,y0:S.ano};S.int=I;S.nint=(S.nint||0)+1;
 logE(S,'elec',res.win?`Limite de mandatos: sucessor eleito (${fm(res.nat,0)}%)`:`Limite de mandatos: oposição vence (${fm(100-res.nat,0)}%)`);
 const sq=.96+RL()*.16+(res.win?.03:0);
 for(let k=0;k<16;k++){S.q++;if(S.q>4){S.q=1;S.ano++}if(S.ano>END)break;
  startTurn(S);S.queue.forEach(e0=>{const e=typeof e0==='string'?EVm[e0]:e0;if(e.tag&&!/Cenário|Coalizão|Reação/.test(e.tag))I.evs.push(`T${S.q}/${S.ano}: ${e.t}`);autoPick(S,e)});S.queue=[];
  UF.forEach(u=>SEC.forEach(s=>{S.st[u.uf].m[s.id]=sq}));
  if(RE()<.13){const pool=LAWS.filter(l=>!S.laws.includes(l.id)&&!l.bold&&(!l.only||(S.x>=l.only[0]&&S.x<=l.only[1]))&&Math.abs(l.b-S.x)<1.5);if(pool.length){const l=pool[Math.floor(RE()*pool.length)];passLaw(S,l.id);I.laws.push(`T${S.q}/${S.ano}: ${l.t}`)}}
  S.sent=[];simQuarter(S);S.hist[S.hist.length-1].int=1;
  if(S.q===4&&MUN.includes(S.ano)){const m=munElection(S);I.note.push(`Municipais de ${S.ano}: ${m.own.id===S.party?'':''}${m.mood>=0?'o seu partido se fortaleceu':'o seu partido perdeu força'} nas prefeituras.`)}
  if(S.ano===END&&S.q===4)break}
 I.to=`T${S.q}/${S.ano}`;I.appr=natAppr(S);S.stage='ret';return I}
function returnElection(S,strat){const I=S.int,sx=S.x,x0=I.x0,sh={};let tot=0;seedStreams(S.seed,S.ano*10+5);
 UF.forEach(u=>{const g=S.st[u.uf];S.x=x0;let a=approval(S,u);const retro=(g.appr-45)*(I.side==='own'?.5:-.4);a=cl(a+retro,4,92);if(strat==='mod')a=.5*a+.5*approval({...S,x:x0*.6},u);
  let v=shareOf(S,u,a);if(strat==='ent')v+=3;if(strat==='base')v+=Math.abs(x0-u.lean)<1?4:-2;if(strat==='mod')v+=1;v=cl(v+(RL()-.5)*5-(S.rv?.2*S.rv.b:0),5,95);sh[u.uf]=v;tot+=v*g.pop});
 S.x=sx;const nat=tot/popSum(S);return{sh,nat,win:nat>50}}
function finalScore(S){const L=legacy(S);return S.succ?Math.round(.65*S.succ.s0+.35*L.score):L.score}
// ---- sementes e códigos de desafio ----
const mkCode=S=>'SP-'+(S.seed>>>0).toString(36).toUpperCase()+'-'+(S.diff==null?1:S.diff);
function parseCode(t){const m=/^\s*SP-([0-9A-Z]{1,8})-([0-2])\s*$/i.exec(t||'');return m?{seed:parseInt(m[1],36),diff:+m[2]}:null}
const dailySeed=d=>{d=d||new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()};
// EXT-END
