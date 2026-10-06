EV.push(
{id:'emendas',t:'Parlamentares cobram emendas',d:'Deputados e senadores da base condicionam votos à liberação de recursos para suas regiões.',o:[
 {t:'Liberar R$ 12 bi',h:'Centrão, centro-direita e centro-esquerda ficam mais favoráveis por alguns trimestres.',e:{cost:12,bloc:{C:12,CD:5,CE:5}}},
 {t:'Liberar R$ 5 bi',h:'Apoio menor, custo menor.',e:{cost:5,bloc:{C:5}}},
 {t:'Recusar e defender austeridade',h:'O Centrão se afasta. A imagem de austeridade ajuda um pouco.',e:{bloc:{C:-10},mood:{all:1}}}]},
{id:'cpi',t:'CPI no Senado investiga o governo',d:'A oposição reúne assinaturas para investigar contratos do Executivo.',o:[
 {t:'Cooperar com a investigação',h:'Desgaste moderado e relação preservada com o Senado.',e:{mood:{all:-2},bloc:{C:3}}},
 {t:'Usar emendas para barrar',h:'R$ 8 bi. Segura a CPI, mas a imagem sofre.',e:{cost:8,bloc:{C:10},mood:{all:-3}}},
 {t:'Confrontar publicamente',h:'Mobiliza sua base e radicaliza a oposição.',e:{bloc:{own:8,C:-6},mood:{all:-1},ideo:.1}}]},
{id:'coalizao',t:'Crise na coalizão',d:'Partidos aliados ameaçam deixar a base por causa de cargos e ministérios.',o:[
 {t:'Ceder ministérios',h:'O Centrão volta a apoiar, mas sua linha política se dilui.',e:{bloc:{C:14}}},
 {t:'Fechar questão e defender a agenda',h:'Sua base fica mais coesa e o Centrão reage mal.',e:{bloc:{own:8,C:-8}}},
 {t:'Convocar reunião de líderes',h:'Ganho pequeno nos blocos mais próximos.',e:{bloc:{C:5,CE:3,CD:3}}}]},
{id:'govopo',t:'Governadores de oposição pedem recursos',d:'Governadores distantes da sua linha cobram repasses e ameaçam obstruir o governo.',o:[
 {t:'Liberar repasses extras',h:'R$ 10 bi. A relação melhora com os governadores mais distantes.',e:{cost:10,rel:{opp:8}}},
 {t:'Manter as regras',h:'Sem custo. A relação com os governadores de oposição piora.',e:{rel:{opp:-6}}},
 {t:'Premiar apenas os aliados',h:'R$ 6 bi aos aliados. A oposição reage mal.',e:{cost:6,rel:{ally:8,opp:-8}}}]},
{id:'apagao',t:'Apagão atinge vários estados',d:'Falha na transmissão deixa milhões sem energia por horas.',o:[
 {t:'Investir na rede de transmissão',h:'R$ 14 bi. Infraestrutura melhora em todo o país.',e:{cost:14,idx:{infra:2},mood:{all:1}}},
 {t:'Pressionar as concessionárias',h:'Sem custo. Resposta política com ganho pequeno.',e:{idx:{infra:.5},mood:{all:-1}}},
 {t:'Minimizar o episódio',h:'Sem custo e com desgaste.',e:{mood:{all:-4},gn:-.001}}]},
{id:'safra',t:'Safra recorde de grãos',d:'Produção acima do esperado empurra exportações e a arrecadação.',o:[
 {t:'Investir em armazenagem e logística',h:'R$ 8 bi. Infraestrutura sobe no Centro-Oeste e no Sul.',e:{cost:8,gn:.003,ridx:{CO:{infra:3},S:{infra:2}}}},
 {t:'Aproveitar a receita extra',h:'R$ 20 bi a mais no caixa.',e:{gn:.003,cost:-20}},
 {t:'Zerar impostos sobre alimentos',h:'Preços caem e o governo perde receita.',e:{gn:.003,cost:10,infl:-.5,mood:{all:2}}}]},
{id:'protestos',t:'Protestos nas ruas',d:'Manifestações em capitais cobram custo de vida e serviços públicos.',o:[
 {t:'Anunciar pacote social',h:'R$ 12 bi. Acalma as ruas.',e:{cost:12,idx:{social:1},mood:{all:2}}},
 {t:'Dialogar com lideranças',h:'Sem custo, resultado incerto.',e:{mood:{all:-1}}},
 {t:'Endurecer a resposta',h:'Sem custo. Agrada parte do país e irrita outra.',e:{mood:{all:-3,S:1,CO:1},ideo:.3}}]},
{id:'alimentos',t:'Alta dos alimentos',d:'Choques de oferta elevam o preço da cesta básica.',o:[
 {t:'Subsidiar a cesta básica',h:'R$ 10 bi. Segura os preços.',e:{cost:10,infl:-.4,mood:{all:2},ideo:-.1}},
 {t:'Importar para forçar a queda',h:'Sem custo. Efeito parcial e reação do agro.',e:{infl:-.2,mood:{CO:-3}}},
 {t:'Aguardar a normalização',h:'Sem custo e com inflação maior.',e:{infl:.5,mood:{all:-3}}}]},
{id:'cambio',t:'Disparada do dólar',d:'O câmbio pressiona preços e a dívida.',o:[
 {t:'Vender reservas',h:'Estabiliza o câmbio. Custa R$ 15 bi.',e:{cost:15,infl:-.2}},
 {t:'Sinalizar compromisso fiscal',h:'Economiza R$ 10 bi em cortes pontuais. Desgasta a base.',e:{cost:-10,mood:{all:-2},ideo:.1}},
 {t:'Deixar o câmbio flutuar',h:'Mais inflação no curto prazo.',e:{infl:.6}}]}
);
