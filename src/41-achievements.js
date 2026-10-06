// ACH-START: conquistas (avaliação pura, sem DOM; a persistência fica na interface)
const ACH=[
{id:'idh',n:'Desenvolvimento humano',d:'IDH nacional acima de 0,85 em algum momento do jogo.',t:(S,sc)=>Math.max(...S.hist.map(h=>h.idh||0))>.85},
{id:'pov',n:'Fim dos bolsões',d:'Terminar com nenhum estado acima de 7% de pobreza.',t:(S,sc)=>Math.max(...UF.map(u=>indOf(S,u.uf).pov))<=7},
{id:'idh2',n:'Nível nórdico',d:'IDH nacional acima de 0,92 em algum momento do jogo.',t:(S,sc)=>Math.max(...S.hist.map(h=>h.idh||0))>.92},
{id:'ret',n:'De volta ao poder',d:'Voltar ao governo depois do interregno.',t:(S,sc)=>(S.log||[]).some(l=>/^Retorno ao governo/.test(l.t))},
{id:'coal',n:'Coalizão de ferro',d:'Governar por pelo menos 12 anos sem nenhum partido deixar a base.',t:(S,sc)=>S.hist.length>=49&&!(S.log||[]).some(l=>l.k==='coal'&&/deixa/.test(l.t))},
{id:'full',n:'Maratona',d:'Chegar ao fim de 2054 como governante (seu ou do sucessor que você elegeu).',t:(S,sc)=>S.ano>=END&&S.q===4},
{id:'t70',n:'Governo de transformação',d:'Nota final de 70 ou mais.',t:(S,sc)=>sc>=70},
{id:'est',n:'Estadista',d:'Nota final de 85 ou mais.',t:(S,sc)=>sc>=85},
{id:'inv',n:'Invicto nas urnas',d:'Vencer pelo menos 3 eleições sem uma derrota e sem sofrer impeachment.',t:(S,sc)=>{const L=S.log||[],w=L.filter(l=>l.k==='elec'&&/^(Reeleito|Retorno ao governo|Limite de mandatos: sucessor eleito)/.test(l.t)).length,d=L.some(l=>l.k==='elec'&&/^(Derrota|Limite de mandatos: oposição)/.test(l.t))||L.some(l=>/impeach/i.test(l.t));return w>=3&&!d}},
{id:'fisc',n:'Casa em ordem',d:'Terminar com dívida abaixo de 75% do PIB e nota de crédito BBB ou melhor.',t:(S,sc)=>S.debt/gdp(S)<.75&&S.rt>=58},
{id:'pib',n:'País multiplicado',d:'PIB per capita pelo menos 300% maior que em 2027.',t:(S,sc)=>legacy(S).pcg>=300},
{id:'cri',n:'Tempo de crise',d:'Atravessar 2 crises em fases (pandemia, energia, guerra tarifária, câmbio, petróleo).',t:(S,sc)=>(S.log||[]).filter(l=>l.k==='reg'&&/: (surto inicial|alerta|ameaça de tarifas|fuga de capitais|preço dispara)$/.test(l.t)).length>=2},
{id:'ext',n:'Escudo externo',d:'Passar por guerra tarifária ou crise cambial e terminar com nota de crédito BBB ou melhor.',t:(S,sc)=>(S.log||[]).some(l=>l.k==='reg'&&/^(Guerra tarifária|Crise cambial)/.test(l.t))&&S.rt>=58},
{id:'ref',n:'Reformador',d:'Aprovar 15 ou mais emendas constitucionais (PEC).',t:(S,sc)=>S.laws.filter(id=>LAW[id]&&LAW[id].tipo==='PEC').length>=15},
{id:'day',n:'Desafio do dia',d:'Terminar o desafio diário.',t:(S,sc)=>!!S.daily}
];
const achEval=(S,sc)=>ACH.filter(a=>{try{return a.t(S,sc)}catch(e){return false}}).map(a=>a.id);
// ACH-END
