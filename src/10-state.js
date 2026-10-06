// CORE-START
const mb=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
let RW=Math.random,RE=Math.random,RV=Math.random,RL=Math.random;
function seedStreams(seed,n){RW=mb(seed*7+n*1013+1);RE=mb(seed*11+n*577+2);RV=mb(seed*13+n*331+3);RL=mb(seed*17+n*211+4)}
const cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const RG={N:'Norte',NE:'Nordeste',CO:'Centro-Oeste',SE:'Sudeste',S:'Sul'};
const SEC=[{id:'edu',nome:'Educação',w:.24},{id:'saude',nome:'Saúde',w:.28},{id:'infra',nome:'Infraestrutura',w:.14},{id:'seg',nome:'Segurança',w:.12},{id:'tech',nome:'Ciência e tecnologia',w:.05},{id:'social',nome:'Assistência social',w:.13},{id:'amb',nome:'Meio ambiente',w:.04}];
// uf, nome, região, pop (mi, Censo 2022), PIB (R$ bi, escala relativa), perfil do eleitorado (-2 esq a +2 dir), desenvolvimento 0-100, deputados, coluna e linha no mapa
const ST0=[
['AC','Acre','N',.83,17,1.5,38,8,0,2],['AP','Amapá','N',.73,22,-.1,38,8,3,0],['AM','Amazonas','N',3.94,131,.4,46,8,2,1],['PA','Pará','N',8.12,262,-.3,40,17,3,1],['RO','Rondônia','N',1.58,56,1.5,50,8,1,2],['RR','Roraima','N',.64,18,1.6,42,8,2,0],['TO','Tocantins','N',1.61,52,.1,48,8,3,2],
['AL','Alagoas','NE',3.13,66,-.5,34,9,6,3],['BA','Bahia','NE',14.14,352,-1.4,48,39,4,3],['CE','Ceará','NE',8.79,194,-1.5,48,22,5,1],['MA','Maranhão','NE',6.78,130,-1.4,32,18,4,1],['PB','Paraíba','NE',3.97,76,-1.2,44,12,6,2],['PE','Pernambuco','NE',9.06,214,-1.3,46,25,5,2],['PI','Piauí','NE',3.27,63,-1.8,36,10,4,2],['RN','Rio Grande do Norte','NE',3.3,80,-.9,46,8,6,1],['SE','Sergipe','NE',2.21,51,-1,44,8,5,3],
['DF','Distrito Federal','CO',2.82,273,1,85,8,3,4],['GO','Goiás','CO',7.06,269,1.1,66,17,3,3],['MT','Mato Grosso','CO',3.66,233,1.4,62,8,2,2],['MS','Mato Grosso do Sul','CO',2.76,142,1,62,8,2,3],
['ES','Espírito Santo','SE',3.83,189,.6,64,10,5,4],['MG','Minas Gerais','SE',20.54,857,0,62,53,4,4],['RJ','Rio de Janeiro','SE',16.06,949,.5,72,46,4,5],['SP','São Paulo','SE',44.04,2719,.7,80,70,3,5],
['PR','Paraná','S',11.44,549,1.1,72,30,2,5],['RS','Rio Grande do Sul','S',10.88,554,.8,74,31,2,7],['SC','Santa Catarina','S',7.61,433,1.7,82,16,2,6]];
const GDPK=10900/ST0.reduce((a,r)=>a+r[4],0);
const UF=ST0.map(r=>({uf:r[0],nome:r[1],reg:r[2],pop:r[3],pib:r[4]*GDPK,lean:r[5],dev:r[6],dep:r[7],c:r[8],r:r[9]}));
const UFI=Object.fromEntries(UF.map(u=>[u.uf,u]));
const G0={N:.019,NE:.015,CO:.019,SE:.011,S:.013},POPG={N:.009,NE:.002,CO:.008,SE:.003,S:.003};
const ROFF={N:{edu:-6,saude:-4,infra:-14,seg:-6,amb:20},NE:{edu:-4,saude:-2,infra:-8,seg:-12,amb:6},CO:{edu:-2,saude:-2,infra:-2,seg:-4,amb:-6},SE:{edu:0,saude:0,infra:6,seg:-2,amb:-8},S:{edu:2,saude:2,infra:2,seg:4,amb:4}};
function idx0(u){const o=ROFF[u.reg],b=25+.55*u.dev;return{edu:cl(b+o.edu),saude:cl(b+o.saude),infra:cl(b+o.infra),seg:cl(b+o.seg),tech:cl(.9*u.dev-8),social:cl(28+.4*u.dev),amb:cl(45+o.amb)}}
const BL=[
{id:'SOL',sig:'SOL',n:'Socialismo e Liberdade',pos:-1.9,cd:12,sn:1,col:'#c0392b'},
{id:'PT',sig:'PT',n:'Partido do Trabalho',pos:-1.6,cd:70,sn:9,col:'#e5484d'},
{id:'PSB',sig:'PSB',n:'Partido Socialista do Brasil',pos:-.9,cd:16,sn:4,col:'#f0883e'},
{id:'PDT',sig:'PDT',n:'Partido Democrata Trabalhista',pos:-.6,cd:17,sn:3,col:'#f5b73b'},
{id:'MDB',sig:'MDB',n:'Movimento Democrático do Brasil',pos:0,cd:44,sn:10,col:'#9aa7b3'},
{id:'PSD',sig:'PSD',n:'Partido Social Democrata',pos:.1,cd:46,sn:15,col:'#7f8fa0'},
{id:'OUT',sig:'Outros',n:'Pequenos partidos',pos:.1,cd:53,sn:2,col:'#5e6a75'},
{id:'PSDB',sig:'PSDB',n:'Partido da Social Democracia do Brasil',pos:.4,cd:15,sn:3,col:'#3cc7f0'},
{id:'UB',sig:'UB',n:'União do Brasil',pos:.5,cd:55,sn:9,col:'#35a7d6'},
{id:'PPN',sig:'PPN',n:'Partido Progressista Nacional',pos:.8,cd:48,sn:7,col:'#4d8bd8'},
{id:'REP',sig:'REP',n:'Partido Republicano',pos:1,cd:42,sn:4,col:'#5b6fe0'},
{id:'PLB',sig:'PLB',n:'Partido Liberal Brasil',pos:1.7,cd:95,sn:14,col:'#7b5be0'}];
const GRP={E:['SOL','PT'],CE:['PSB','PDT'],C:['MDB','PSD','OUT','UB','PPN'],CD:['PSDB','REP'],D:['PLB']};
const GRPN={E:'Esquerda',CE:'Centro-esquerda',C:'Centrão',CD:'Centro-direita',D:'Direita'};
const BLI=Object.fromEntries(BL.map(b=>[b.id,b]));
const IDEO=[
{k:'PT',d:'Estado indutor e foco social. Educação, saúde, assistência e meio ambiente rendem até 17% mais por real investido. Base forte no Nordeste, alta rejeição no Sul e no Centro-Oeste. Maior bancada de esquerda, mas o Congresso é difícil.'},
{k:'PSB',d:'Esquerda moderada com pragmatismo fiscal. Bônus em educação, saúde e assistência. Boa aceitação no Nordeste, Minas e Norte; rejeição no Sul. Bancada pequena.'},
{k:'PDT',d:'Trabalhismo com ênfase em educação e indústria. Aceitação moderada no Sul e no Nordeste. Bancada pequena, dependente do Centrão.'},
{k:'MDB',d:'Pragmático e de centro. Pequena vantagem em todas as áreas, pouca rejeição em qualquer região e boa relação com o Centrão. Sem base fiel.'},
{k:'PSD',d:'Centro de gestão, forte em prefeituras e com boa relação com governadores. Pouca rejeição e pouca paixão do eleitorado.'},
{k:'UB',d:'Centro-direita de grande capilaridade. Foco em infraestrutura e disciplina fiscal. Boa aceitação no Sul, Centro-Oeste e Sudeste.'},
{k:'PSDB',d:'Centro-direita técnico, com foco em responsabilidade fiscal e reformas. Boa imagem no mercado e bancada pequena.'},
{k:'REP',d:'Direita conservadora e evangélica, com base forte em periferias urbanas e no Norte. Prioriza segurança e infraestrutura.'},
{k:'PLB',d:'Direita liberal e conservadora. Estado enxuto, infraestrutura, segurança e tecnologia rendem até 17% mais. Base forte no Sul e no Centro-Oeste, alta rejeição no Nordeste. Maior bancada da Câmara.'}].map(o=>({...o,x:BL.find(b=>b.id===o.k).pos,n:BL.find(b=>b.id===o.k).n,sig:o.k}));
const ELECT=[2030,2034,2038,2042,2046,2050],MUN=[2028,2032,2036,2040,2044,2048,2052],END=2054;
const ideoName=x=>x<-1.2?'Esquerda':x<-.35?'Centro-esquerda':x<.35?'Centro':x<1.2?'Centro-direita':'Direita';
const popSum=S=>UF.reduce((a,u)=>a+S.st[u.uf].pop,0);
const gdp=S=>UF.reduce((a,u)=>a+S.st[u.uf].pib,0);
const wavg=(S,f)=>UF.reduce((a,u)=>a+S.st[u.uf].pop*f(u,S.st[u.uf]),0)/popSum(S);
const avgIdx=(S,k)=>wavg(S,(u,g)=>g.idx[k]);
const natAppr=S=>wavg(S,(u,g)=>g.appr);
const natRej=S=>wavg(S,(u,g)=>rejOf(S,u,g.appr));
const natShare=S=>wavg(S,(u,g)=>shareOf(S,u,g.appr));
const base=(S,u,s)=>.04*gdp(S)*s.w*S.st[u.uf].pop/popSum(S);
function eff(x,sid){const l=Math.max(0,-x)/2*.2,rr=Math.max(0,x)/2*.2,c=(1-Math.abs(x)/2)*.05;return 1+(['edu','saude','social','amb'].includes(sid)?l:rr)+c}
function approval(S,u){const g=S.st[u.uf],i=g.idx,d=Math.abs(S.x-u.lean),al=Math.pow(Math.max(0,1-d/3.4),1.2),svc=(i.edu+i.saude+i.seg+i.social+i.infra)/5;
 return cl(18-12*Math.max(0,1-Math.abs(S.x)/1.2)+46*al+.35*(svc-50)+400*(g.g-.02)-2*(S.infl-4.5)-1.5*(S.unem-7)-250*(S.tax-.19)+g.mood+.12*(g.rel-50),4,92)}
const rejOf=(S,u,a)=>cl(100-a-(12-5*Math.abs(S.x-u.lean)/3.4),3,95);
const shareOf=(S,u,a)=>a/(a+rejOf(S,u,a))*100;
const relTarget=(S,g,tr)=>cl(35+45*(1-Math.abs(S.x-g.gx)/3.4)+60*(tr-1)+(S.coal&&g.gov&&S.coal.includes(g.gov)?8:0),0,100);
const LATE={
 audit:w=>({id:'t-late-aud',tag:'Efeito tardio',t:`Auditoria questiona ${w}`,d:`Órgãos de controle encontram irregularidades em ${w}, decididas há alguns anos. A imprensa cobra explicações.`,o:[{t:'Abrir investigação e responsabilizar',h:'R$ 4 bi. Desgaste agora e credibilidade depois.',e:{cost:4,mood:{all:-2},rat:1}},{t:'Defender a legalidade do processo',h:'Sem custo. A opinião pública pune e o mercado desconfia.',e:{mood:{all:-5},rat:-2}},{t:'Renegociar os contratos',h:'R$ 10 bi. Limita o dano e preserva o investimento.',e:{cost:10,mood:{all:-1},inv:.3}}]}),
 fruto:w=>({id:'t-late-fr',tag:'Sinal positivo: reforma',t:`A ${w} começa a render frutos`,d:`Anos depois da votação e do desgaste, os efeitos da ${w} aparecem na economia. O crescimento estrutural sobe.`,o:[{t:'Capitalizar politicamente',h:'Aprovação e nota de crédito sobem.',e:{mood:{all:4},rat:1}},{t:'Reinvestir o ganho em capital humano',h:'R$ 12 bi. Educação e saúde sobem.',e:{cost:12,idx:{edu:1.5,saude:1}}},{t:'Reduzir tributos',h:'R$ 15 bi. Crescimento e aprovação sobem.',e:{cost:15,gn:.003,mood:{all:2}}}]})};

function newState(x){
 const S={ano:2027,q:1,mandato:1,x,tax:.19,debt:.76*10900,infl:4.5,unem:7.5,ap:3,pend:{gn:0,gr:{},infl:0,cost:0},used:[],feed:[],hist:[],st:{},bl:{},seats:{},laws:[],sent:[],pauta:[],queue:[],curId:null,selLaw:null,pc0:0,fails:0,acts:[],I:15,rt:44,cd:{},tctx:null,anos:0,log:[],late:[],crise:null,fl:{},sched:[],msgs:[],inst:0,xg:0,xi:0,xu:0,xinv:0,sp:0,consec:1,lim:2,stage:null,int:null,nint:0,retWin:false,news:[],seed:1,coal:[],sat:{},mins:{},lowc:{},rv:null,succ:null};
 UF.forEach(u=>{S.st[u.uf]={pop:u.pop,pib:u.pib,idx:idx0(u),i0:idx0(u),d:{},m:Object.fromEntries(SEC.map(s=>[s.id,1])),mood:8,g:.02,appr:50,gx:cl(u.lean+(RW()-.5)*1.4,-2,2),rel:50}});
 UF.forEach(u=>{const g=S.st[u.uf];g.rel=relTarget(S,g,1)});
 UF.forEach(u=>{S.st[u.uf].appr=approval(S,u)});
 BL.forEach(b=>{S.bl[b.id]={b:0};S.seats[b.id]={cd:b.cd,sn:b.sn}});
 S.pc0=gdp(S)/popSum(S);
 S.party='PT';S.nb=Object.fromEntries(SEC.map(x=>[x.id,avgIdx(S,x.id)]));S.hist.push(hrow(S,'T4/2026',2.5,76));
 return S}
function hrow(S,lbl,g,dr){return{lbl,appr:natAppr(S),rej:natRej(S),share:natShare(S),g,infl:S.infl,unem:S.unem,dr,pc:gdp(S)/popSum(S),I:S.I,rt:S.rt,rate:ratePct(S),pib:gdp(S),...indRow(S)}}
const ratePct=S=>cl(.045+(43-S.rt)*.0007,.02,.12)*100;
const ratingLetter=r=>r>=70?'A':r>=58?'BBB':r>=42?'BB':r>=28?'B':'CCC';
