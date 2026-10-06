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
 end:S=>null},
tarifa:{n:'Guerra tarifária',ext:1,ph:[
 {n:'ameaça de tarifas',reg:S=>RG0({n:'Guerra tarifária: ameaça',d:'Grandes parceiros ameaçam sobretaxar produtos brasileiros.',left:2,gn:-.003,vs:{agro:-.01,ind:-.006}}),
  ev:S=>({id:'t-t1',tag:'Mundo externo: guerra tarifária (fase 1 de 3)',t:'Grandes parceiros ameaçam sobretaxar exportações',d:'Uma potência anuncia tarifas sobre carnes, grãos e aço brasileiros. O agro e a indústria exportadora sentem o risco; serviços ficam menos expostos.',o:[
   {t:'Negociar diretamente',h:'R$ 2 bi em diplomacia. Reduz a chance de tarifas altas.',e:{cost:2,mood:{all:-1},crise:{sev:-1}}},
   {t:'Retaliar com tarifas recíprocas',h:'Agrada ao eleitor nacionalista (+2), encarece importados e agrava a guerra.',e:{mood:{all:2},infl:.3,crise:{sev:1}}},
   {t:'Diversificar mercados (Ásia, África, UE)',h:'R$ 8 bi em promoção comercial. Mercados novos amortecem a fase seguinte.',e:{cost:8,inv:.2,crise:{vac:1}}}]})},
 {n:'tarifas em vigor',reg:S=>RG0({n:'Guerra tarifária: tarifas em vigor',d:'Exportações em queda; agro e indústria são os mais atingidos.',left:3,gn:-.008*(1+.25*sv(S))+(S.crise.vac?.003:0),infl:.2,vs:sc({agro:-.03,ind:-.016,min:-.006,serv:.002},S)}),
  ev:S=>({id:'t-t2',tag:'Mundo externo: guerra tarifária (fase 2 de 3)',t:'As tarifas entram em vigor',d:'Pedidos externos caem e cadeias produtivas param. Produtores e industriais cobram socorro.',o:[
   {t:'Crédito subsidiado a exportadores',h:'R$ 14 bi. Preserva empregos na indústria e no agro; pressiona as contas.',e:{cost:14,unem:-.3,inv:.3}},
   {t:'Compensar produtores rurais',h:'R$ 10 bi. Agro estabiliza; o resto da economia paga a conta.',e:{cost:10,mood:{all:1},gn:.001}},
   {t:'Levar o caso à OMC e esperar',h:'R$ 1 bi. Custo baixo e efeito lento: o desemprego sobe.',e:{cost:1,unem:.6,mood:{all:-2}}}]})},
 {n:'acordo ou isolamento',reg:S=>RG0({n:'Guerra tarifária: desfecho',d:'Mercados voltam a se abrir, ou o país se isola.',left:3,gn:S.crise.sev>0?-.002:.004,vs:{agro:S.crise.sev>0?-.006:.012,ind:.004}}),
  ev:S=>({id:'t-t3',tag:'Mundo externo: guerra tarifária (fase 3 de 3)',t:'Hora de fechar acordo ou ficar isolado',d:S.crise.sev>0?'A retaliação endureceu as posições; a saída é mais cara.':'O diálogo abre espaço para um acordo.',o:[
   {t:'Acordo comercial amplo',h:'Mais mercado para agro e serviços; a indústria perde proteção. Crescimento sobe.',e:{perm:{g:.002},mood:{all:-1},idx:{tech:-.3}}},
   {t:'Acordo parcial, com proteção à indústria',h:'R$ 6 bi em reconversão. Ganho menor e mais distribuído.',e:{cost:6,perm:{g:.001},unem:-.2}},
   {t:'Fechar a economia',h:'Protege setores ineficientes por um tempo, mas reduz o crescimento no longo prazo.',e:{perm:{g:-.002},mood:{all:2},inv:-.4}}]})}],
 end:S=>null},
cambio:{n:'Crise cambial',ext:1,ph:[
 {n:'fuga de capitais',reg:S=>RG0({n:'Crise cambial: fuga de capitais',d:'Dólar dispara; exportadores ganham competitividade e importadores sofrem.',left:2,gn:-.004,infl:.5,rat:-1,vs:{ind:.004,agro:.006,serv:-.006}}),
  ev:S=>({id:'t-c1',tag:'Mundo externo: crise cambial (fase 1 de 3)',t:'O dólar dispara e o capital foge',d:'Juros nos EUA sobem e investidores deixam mercados emergentes. A moeda se desvaloriza rápido.',o:[
   {t:'Vender reservas para conter o câmbio',h:'R$ 12 bi. Acalma o mercado e limita a inflação.',e:{cost:12,rat:1,crise:{sev:-1}}},
   {t:'Subir os juros',h:'Segura a moeda e a inflação, mas esfria a atividade e o emprego.',e:{infl:-.3,gn:-.002,unem:.4,crise:{sev:-1}}},
   {t:'Deixar o câmbio flutuar',h:'Sem custo fiscal agora, com mais inflação e piora de nota de crédito.',e:{infl:.5,rat:-1,crise:{sev:1}}}]})},
 {n:'pressão inflacionária',reg:S=>RG0({n:'Crise cambial: inflação',d:'Preços importados sobem e a renda real cai.',left:3,gn:-.005*(1+.25*sv(S)),infl:.6*(1+.25*sv(S)),vs:sc({serv:-.008,ind:-.004},S)}),
  ev:S=>({id:'t-c2',tag:'Mundo externo: crise cambial (fase 2 de 3)',t:'A inflação corrói a renda',d:'Combustíveis, alimentos e insumos sobem em reais. A população pressiona o governo.',o:[
   {t:'Congelar preços de itens essenciais',h:'Alivia o bolso (+3), mas afasta investimento e distorce preços.',e:{mood:{all:3},inv:-.4,infl:-.3}},
   {t:'Ajuste fiscal para recuperar a confiança',h:'Economiza R$ 10 bi e melhora a nota de crédito, com custo político.',e:{cost:-10,mood:{all:-3},rat:2}},
   {t:'Reajuste do salário mínimo acima da inflação',h:'R$ 12 bi. Protege a renda dos mais pobres e alimenta a inflação.',e:{cost:12,mood:{all:2},idx:{social:1},infl:.3}}]})},
 {n:'normalização',reg:S=>RG0({n:'Crise cambial: normalização',d:'O câmbio se estabiliza em novo patamar.',left:3,gn:.003,vs:{ind:.004}}),
  ev:S=>({id:'t-c3',tag:'Mundo externo: crise cambial (fase 3 de 3)',t:'O câmbio se acomoda',d:'A turbulência passa, mas o país percebe a vulnerabilidade externa.',o:[
   {t:'Recompor reservas e reduzir dívida em dólar',h:'R$ 10 bi. Melhora a nota de crédito e reduz risco futuro.',e:{cost:10,rat:3}},
   {t:'Aproveitar o câmbio para exportar mais',h:'R$ 8 bi em financiamento. Indústria e agro ganham fôlego.',e:{cost:8,inv:.5,gn:.002}},
   {t:'Voltar à rotina',h:'Sem custo. A vulnerabilidade permanece.',e:{mood:{all:1}}}]})}],
 end:S=>null},
petroleo:{n:'Choque do petróleo',ext:1,ph:[
 {n:'preço dispara',reg:S=>RG0({n:'Choque do petróleo: preço em alta',d:'Conflito no exterior eleva o petróleo. Estados produtores ganham; o resto sofre.',left:3,gn:-.004*(1+.25*sv(S)),infl:.7,vs:sc({min:.02,ind:-.008,serv:-.006,agro:-.004},S)}),
  ev:S=>({id:'t-o1',tag:'Mundo externo: choque do petróleo (fase 1 de 2)',t:'Conflito geopolítico dispara o petróleo',d:'Uma guerra em região produtora eleva os combustíveis. Transportes e alimentos ficam mais caros; estados de mineração e petróleo ganham receita.',o:[
   {t:'Subsidiar combustíveis',h:'R$ 18 bi. Segura os preços e a aprovação, com custo fiscal.',e:{cost:18,infl:-.5,mood:{all:3},crise:{sev:-1}}},
   {t:'Repassar o preço ao consumidor',h:'Sem custo fiscal, com mais inflação e desgaste político.',e:{mood:{all:-4},infl:.3,crise:{sev:1}}},
   {t:'Taxar o lucro extraordinário das petroleiras',h:'Receita de R$ 10 bi; investimentos do setor caem.',e:{cost:-10,inv:-.3,mood:{all:1}}}]})},
 {n:'normalização',reg:S=>RG0({n:'Choque do petróleo: normalização',d:'Preços recuam e a atividade se recompõe.',left:3,gn:.003,vs:{min:-.01,ind:.006,serv:.004}}),
  ev:S=>({id:'t-o2',tag:'Mundo externo: choque do petróleo (fase 2 de 2)',t:'O petróleo recua. E agora?',d:'A dependência de combustíveis mostrou o risco; há espaço para investir em alternativas.',o:[
   {t:'Investir em energia renovável e biocombustíveis',h:'R$ 12 bi. Meio ambiente e infraestrutura sobem; crescimento mais firme.',e:{cost:12,idx:{amb:1.5,infra:1},perm:{g:.001}}},
   {t:'Ampliar a exploração de petróleo',h:'R$ 8 bi. Mais receita futura e mais emissões.',e:{cost:8,inv:.4,idx:{amb:-1.5}}},
   {t:'Nada a fazer',h:'Sem custo. O risco volta no próximo choque.',e:{mood:{all:1}}}]})}],
 end:S=>null},
acordo:{n:'Acordo comercial',ext:1,ph:[
 {n:'negociação',reg:S=>RG0({n:'Acordo comercial: negociação',d:'Mercosul e blocos estrangeiros negociam um grande acordo.',left:2,gn:.002,vs:{agro:.004}}),
  ev:S=>({id:'t-ac1',tag:'Mundo externo: acordo comercial (fase 1 de 2)',t:'Janela para um grande acordo comercial',d:'Um bloco de países oferece abrir seus mercados em troca de redução de tarifas. Agro e serviços ganham; a indústria teme a concorrência.',o:[
   {t:'Assinar o acordo amplo',h:'Mais exportações para agro e serviços; a indústria perde proteção.',e:{mood:{all:-1},crise:{ac:1}}},
   {t:'Acordo parcial protegendo a indústria',h:'R$ 4 bi em reconversão industrial. Ganho menor, distribuído.',e:{cost:4,crise:{ac:.5}}},
   {t:'Recusar e manter o mercado fechado',h:'Agrada à indústria nacional; o país perde oportunidades.',e:{mood:{all:1},inv:-.2,crise:{ac:-.5}}}]})},
 {n:'implementação',reg:S=>{const a=S.crise.ac||0;return RG0({n:'Acordo comercial: implementação',d:a>0?'Exportações crescem, mas a indústria sente a concorrência.':'Sem acordo, o mercado externo segue restrito.',left:4,gn:a>0?.004*a:-.001,vs:{agro:.012*a,serv:.006*a,ind:-.01*a+(a<0?.003:0)}})},
  ev:S=>({id:'t-ac2',tag:'Mundo externo: acordo comercial (fase 2 de 2)',t:'Os efeitos do acordo chegam à economia',d:S.crise.ac>0?'Agro e serviços exportam mais, enquanto fábricas enfrentam importados baratos.':'O país mantém a proteção tradicional.',o:[
   {t:'Programa de requalificação de trabalhadores',h:'R$ 10 bi. Reduz o desemprego estrutural e fortalece a educação.',e:{cost:10,idx:{edu:1.5},unem:-.4}},
   {t:'Financiar modernização industrial',h:'R$ 12 bi. A indústria ganha produtividade e investimento privado sobe.',e:{cost:12,inv:.5,gn:.002}},
   {t:'Deixar o mercado se ajustar',h:'Sem custo. O ajuste é mais duro nas regiões industriais.',e:{unem:.4,mood:{all:-1}}}]})}],
 end:S=>null}
};
function crisisStep(S){const dm=[.6,1,1.4][S.diff==null?1:S.diff];
 if(!S.crise){if(S.hist.length<13||(S.cd.crise>0)||RE()>=.032*dm)return null;{const w=[['pand',2],['apagao',1.5],['tarifa',1.5],['cambio',1.5],['petroleo',1],['acordo',1]],tot=w.reduce((a,x)=>a+x[1],0);let r=RE()*tot,id='pand';for(const x of w){if(r<x[1]){id=x[0];break}r-=x[1]}S.crise={id,ph:0,sev:0,vac:0,ac:0}}}
 else if(S.reg)return null;
 const C=CRISES[S.crise.id],ph=C.ph[S.crise.ph];
 if(!ph){S.cd.crise=32;S.crise=null;return null}
 S.crise.ph++;S.reg=ph.reg(S);logE(S,'reg',`${C.n}: ${ph.n}`);return ph.ev(S)}
// CRISES-END
