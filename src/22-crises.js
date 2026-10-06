// CRISES-START
const RG0=o=>Object.assign({gn:0,infl:0,rat:0,inv:0,rate:0,gr:{}},o);
const sv=S=>cl(S.crise?S.crise.sev:0,-2,3),sc=(v,S)=>Object.fromEntries(Object.entries(v).map(([k,x])=>[k,x*(1+.25*sv(S))]));
const CRISES={
pand:{n:'Pandemia',ph:[
 {n:'surto inicial',reg:S=>RG0({n:'Pandemia: surto inicial',d:'Casos crescem rápido em várias regiões.',left:2,gn:-.004,vs:{serv:-.01,ind:-.004}}),
  ev:S=>({id:'t-p1',tag:'Crise: pandemia (fase 1 de 4)',t:'Surto de uma nova doença respiratória',d:'Os primeiros casos se espalham e hospitais pedem orientação. A forma de responder agora define a gravidade das próximas fases.',o:[
   {t:'Restrições rígidas de circulação',h:'R$ 10 bi. Reduz a gravidade do pico, com custo econômico e político agora.',e:{cost:10,mood:{all:-3},crise:{sev:-1}}},
   {t:'Medidas focalizadas e testagem em massa',h:'R$ 6 bi. Equilíbrio entre saúde e atividade.',e:{cost:6,crise:{sev:0},idx:{saude:.5}}},
   {t:'Manter as atividades',h:'Sem custo. Agrada no curto prazo e agrava o pico.',e:{mood:{all:1},crise:{sev:1}}}]})},
 {n:'pico de casos',reg:S=>RG0({n:'Pandemia: pico de casos',d:'Hospitais lotados e atividade em queda.',left:3,gn:-.012*(1+.25*sv(S)),infl:.2,vs:sc({serv:-.02,ind:-.01},S)}),
  ev:S=>({id:'t-p2',tag:'Crise: pandemia (fase 2 de 4)',t:'Hospitais no limite',d:'A rede de saúde está saturada. É a hora de decidir onde colocar recursos.',o:[
   {t:'Ampliar leitos e UTIs',h:'R$ 20 bi. Saúde sobe e o pico fica menos letal.',e:{cost:20,idx:{saude:3},crise:{sev:-1}}},
   {t:'Comprar vacinas antecipadamente',h:'R$ 15 bi. A fase de recuperação começa mais cedo e mais forte.',e:{cost:15,crise:{vac:1}}},
   {t:'Apenas orientar a população',h:'Sem custo. A saúde se deteriora e a população reage.',e:{mood:{all:-4},idx:{saude:-2},crise:{sev:1}}}]})},
 {n:'vacinação e reabertura',reg:S=>RG0({n:'Pandemia: reabertura',d:'Vacinação avança e a atividade volta aos poucos.',left:S.crise.vac?2:4,gn:S.crise.vac?.004:-.003,vs:{serv:S.crise.vac?.01:-.005}}),
  ev:S=>({id:'t-p3',tag:'Crise: pandemia (fase 3 de 4)',t:'A economia tenta reabrir',d:S.crise.vac?'As vacinas antecipadas aceleram a reabertura.':'Sem vacinas suficientes, a reabertura é lenta e incerta.',o:[
   {t:'Auxílio emergencial amplo',h:'R$ 25 bi. Aprovação e assistência sobem; pressiona inflação.',e:{cost:25,mood:{all:4},idx:{social:1.5},infl:.4}},
   {t:'Crédito e apoio às empresas',h:'R$ 15 bi. Preserva empregos e investimento.',e:{cost:15,inv:.6,unem:-.4,gn:.002}},
   {t:'Retomada sem apoio extra',h:'Sem custo. O desemprego e a desigualdade crescem.',e:{unem:.8,mood:{all:-2},idx:{social:-1}}}]})},
 {n:'sequelas',reg:S=>RG0({n:'Pandemia: sequelas',d:'Efeitos duradouros sobre trabalho e educação.',left:3,gn:.003,vs:{serv:.006}}),
  ev:S=>({id:'t-p4',tag:'Crise: pandemia (fase 4 de 4)',t:'Sequelas da pandemia',d:'Aprendizado perdido, doenças crônicas e empresas fechadas pedem uma resposta de longo prazo.',o:[
   {t:'Plano de recuperação de aprendizagem e saúde',h:'R$ 18 bi. Educação e saúde sobem.',e:{cost:18,idx:{edu:2.5,saude:2}}},
   {t:'Foco na retomada econômica',h:'R$ 10 bi. Crescimento maior; deixa a perda social.',e:{cost:10,gn:.003,inv:.4}},
   {t:'Encerrar as medidas',h:'Economiza R$ 8 bi. Sequelas permanentes no crescimento.',e:{cost:-8,perm:{g:-.002},mood:{all:-1}}}]})}],
 end:S=>null},
apagao:{n:'Crise hídrica e de energia',ph:[
 {n:'alerta',reg:S=>RG0({n:'Crise hídrica: alerta',d:'Reservatórios baixos e risco de apagões.',left:2,gn:-.003,vs:{ind:-.006,agro:-.006}}),
  ev:S=>({id:'t-a1',tag:'Crise: energia (fase 1 de 3)',t:'Reservatórios em nível crítico',d:'Chuvas abaixo da média ameaçam energia e abastecimento de água.',o:[
   {t:'Campanha de economia e bandeira tarifária',h:'R$ 3 bi. Reduz o risco com custo moderado.',e:{cost:3,infl:.2,mood:{all:-1},crise:{sev:-1}}},
   {t:'Acionar usinas térmicas de emergência',h:'R$ 12 bi. Garante energia, aumenta custos e polui.',e:{cost:12,idx:{amb:-1.5},infl:.3,crise:{sev:-1}}},
   {t:'Esperar a chuva chegar',h:'Sem custo. Se não chover, a crise piora.',e:{crise:{sev:1}}}]})},
 {n:'racionamento',reg:S=>RG0({n:'Crise hídrica: racionamento',d:'Cortes de energia afetam a indústria e o dia a dia.',left:3,gn:-.01*(1+.25*sv(S)),infl:.4,vs:sc({ind:-.02,agro:-.012,serv:-.006},S)}),
  ev:S=>({id:'t-a2',tag:'Crise: energia (fase 2 de 3)',t:'Racionamento de energia',d:'Há cortes programados e a produção industrial cai.',o:[
   {t:'Racionamento obrigatório com metas',h:'R$ 4 bi. Distribui o custo e evita apagões.',e:{cost:4,mood:{all:-3},crise:{sev:-1}}},
   {t:'Subsídio a grandes consumidores',h:'R$ 14 bi. Protege a indústria, com risco fiscal.',e:{cost:14,inv:.3,crise:{sev:0}}},
   {t:'Priorizar o mercado livre',h:'Sem custo. Apagões atingem as famílias mais pobres.',e:{mood:{all:-5},idx:{social:-1},crise:{sev:1}}}]})},
 {n:'recuperação',reg:S=>RG0({n:'Crise hídrica: recuperação',d:'Reservatórios se recompõem e a atividade volta.',left:3,gn:.003,vs:{ind:.008}}),
  ev:S=>({id:'t-a3',tag:'Crise: energia (fase 3 de 3)',t:'Reconstruir a segurança energética',d:'Chuvas voltam, mas o sistema precisa de investimentos para que isso não se repita.',o:[
   {t:'Expandir energias renováveis e transmissão',h:'R$ 20 bi. Infraestrutura e meio ambiente sobem; crescimento mais firme.',e:{cost:20,idx:{infra:2,amb:1},perm:{g:.002}}},
   {t:'Concessões ao setor privado',h:'Receita de R$ 6 bi e investimento privado maior.',e:{cost:-6,inv:.6,idx:{infra:1}}},
   {t:'Voltar ao normal',h:'Sem custo. O risco volta no futuro.',e:{mood:{all:1}}}]})}],
 end:S=>null}};
function crisisStep(S){const dm=[.6,1,1.4][S.diff==null?1:S.diff];
 if(!S.crise){if(S.hist.length<13||(S.cd.crise>0)||RE()>=.025*dm)return null;S.crise={id:RE()<.6?'pand':'apagao',ph:0,sev:0,vac:0}}
 else if(S.reg)return null;
 const C=CRISES[S.crise.id],ph=C.ph[S.crise.ph];
 if(!ph){S.cd.crise=40;S.crise=null;return null}
 S.crise.ph++;S.reg=ph.reg(S);logE(S,'reg',`${C.n}: ${ph.n}`);return ph.ev(S)}
// CRISES-END
