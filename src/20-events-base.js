const EV=[
{id:'seca',t:'Seca severa no Sul e no Centro-Oeste',d:'A safra encolhe e os produtores pedem socorro ao governo federal.',o:[
 {t:'Auxílio emergencial ao produtor',h:'R$ 18 bi. Amortece a queda do PIB agrícola e agrada as duas regiões.',e:{cost:18,gr:{S:-.005,CO:-.005},mood:{S:3,CO:3}}},
 {t:'Crédito rural subsidiado',h:'R$ 8 bi. Alívio parcial, perda de PIB maior.',e:{cost:8,gr:{S:-.009,CO:-.009},mood:{S:1,CO:1}}},
 {t:'Deixar o mercado resolver',h:'Sem custo. Queda forte do PIB regional e desgaste político.',e:{gr:{S:-.016,CO:-.016},mood:{S:-6,CO:-6},ideo:.2}}]},
{id:'caminhao',t:'Greve dos caminhoneiros',d:'Rodovias bloqueadas e prateleiras vazias em algumas capitais.',o:[
 {t:'Atender as reivindicações',h:'R$ 12 bi em subsídio ao diesel. Pressiona a inflação.',e:{cost:12,infl:.6,mood:{all:1},ideo:-.1}},
 {t:'Negociar o frete mínimo',h:'R$ 4 bi. Solução intermediária.',e:{cost:4,infl:.3}},
 {t:'Enfrentar a greve',h:'Sem custo fiscal. O PIB sofre e o governo se desgasta.',e:{gn:-.004,mood:{all:-2},ideo:.3}}]},
{id:'commodities',t:'Alta das commodities',d:'Soja, minério e petróleo sobem no mercado internacional e a arrecadação extra chega.',o:[
 {t:'Poupar em fundo soberano',h:'Receita extra de R$ 25 bi reduz o déficit.',e:{gn:.004,cost:-25}},
 {t:'Investir em obras',h:'Infraestrutura sobe em todas as regiões. Não gera receita extra.',e:{gn:.005,idx:{infra:3}}},
 {t:'Devolver à população',h:'R$ 15 bi em benefícios. Melhora a popularidade, aquece os preços.',e:{gn:.005,cost:15,infl:.3,mood:{all:3}}}]},
{id:'greveprof',t:'Greve de professores',d:'Redes estaduais param por reajuste do piso e melhores condições.',cond:S=>avgIdx(S,'edu')<54,o:[
 {t:'Reajustar o piso nacional',h:'R$ 14 bi. Educação melhora e a base aprova.',e:{cost:14,idx:{edu:2},mood:{all:1},ideo:-.2}},
 {t:'Plano de carreira com metas',h:'R$ 6 bi. Ganho menor, custo menor.',e:{cost:6,idx:{edu:1}}},
 {t:'Recusar a negociação',h:'Sem custo. Educação piora e a popularidade cai.',e:{idx:{edu:-2},mood:{all:-3},ideo:.2}}]},
{id:'enchentes',t:'Enchentes históricas no Sul',d:'Cidades alagadas, estradas destruídas e milhares de desabrigados.',o:[
 {t:'Reconstrução ampla',h:'R$ 30 bi. Infraestrutura do Sul volta melhor do que antes.',e:{cost:30,ridx:{S:{infra:4}},mood:{S:5}}},
 {t:'Parceria com o setor privado',h:'R$ 10 bi. Reconstrução mais lenta.',e:{cost:10,mood:{S:1},ideo:.3,gr:{S:-.004}}},
 {t:'Resposta mínima',h:'Sem custo. Perda de PIB e revolta no Sul.',e:{gr:{S:-.012},mood:{S:-8}}}]},
{id:'escandalo',t:'Escândalo de corrupção',d:'Reportagem liga um aliado do governo a desvios em contratos públicos.',o:[
 {t:'Demitir e colaborar com a investigação',h:'Custo político curto e imagem preservada.',e:{mood:{all:-3}}},
 {t:'Aprovar pacote anticorrupção',h:'R$ 2 bi. Desgaste menor e resposta institucional.',e:{cost:2,mood:{all:-1}}},
 {t:'Blindar o aliado',h:'O desgaste cresce muito se o caso avançar.',e:{mood:{all:-8},ideo:.1}}]},
{id:'surto',t:'Surto respiratório sobrecarrega hospitais',d:'Leitos de UTI lotados e filas nas emergências em várias capitais.',o:[
 {t:'Reforço emergencial ao SUS',h:'R$ 20 bi. Saúde melhora em todas as regiões.',e:{cost:20,idx:{saude:3},mood:{all:2}}},
 {t:'Contratação temporária focal',h:'R$ 8 bi. Efeito menor.',e:{cost:8,idx:{saude:1}}},
 {t:'Esperar a curva cair',h:'Sem custo. Saúde piora, o PIB perde um pouco.',e:{idx:{saude:-3},mood:{all:-5},gn:-.002}}]},
{id:'previdencia',t:'Pressão por reforma da previdência',d:'O mercado cobra um ajuste das regras de aposentadoria.',o:[
 {t:'Reforma ampla',h:'Economiza R$ 20 bi e melhora a confiança, mas custa votos.',e:{cost:-20,gn:.002,mood:{all:-4},ideo:.3}},
 {t:'Reforma suave',h:'Economiza R$ 8 bi com desgaste pequeno.',e:{cost:-8,mood:{all:-1}}},
 {t:'Adiar',h:'Sem desgaste agora. Os preços sentem a incerteza.',e:{infl:.2}}]},
{id:'datacenter',t:'Big techs propõem polos de data centers e IA',d:'Empresas globais buscam onde instalar a próxima geração de infraestrutura digital.',cond:S=>avgIdx(S,'tech')>33,o:[
 {t:'Incentivos fiscais no Sudeste e no Sul',h:'R$ 6 bi. Tecnologia sobe onde já existe base.',e:{cost:6,ridx:{SE:{tech:3},S:{tech:2}},gn:.002}},
 {t:'Exigir interiorização',h:'R$ 8 bi. Polos no Nordeste, Centro-Oeste e Norte.',e:{cost:8,ridx:{NE:{tech:3},CO:{tech:3},N:{tech:3}},mood:{NE:2}}},
 {t:'Recusar o pacote',h:'Sem custo e sem ganho.',e:{ideo:-.1}}]},
{id:'amazonia',t:'Pressão internacional contra o desmatamento',d:'Parceiros comerciais ameaçam restrições a produtos da Amazônia e do Cerrado.',o:[
 {t:'Fiscalização reforçada',h:'R$ 6 bi. Meio ambiente melhora, mas o agro reclama.',e:{cost:6,ridx:{N:{amb:4},CO:{amb:3}},mood:{N:-1,CO:-3}}},
 {t:'Pacto da bioeconomia',h:'R$ 10 bi. Ganha o Norte e preserva o apoio do agro.',e:{cost:10,idx:{amb:2},ridx:{N:{tech:2}},mood:{N:3}}},
 {t:'Flexibilizar licenças',h:'PIB sobe e o agro aprova, mas a floresta perde.',e:{gn:.002,ridx:{N:{amb:-4},CO:{amb:-3}},mood:{CO:3},ideo:.3}}]},
{id:'sertao',t:'Seca prolongada no sertão nordestino',d:'Reservatórios no limite e cidades abastecidas por carros-pipa.',o:[
 {t:'Obras hídricas permanentes',h:'R$ 14 bi. Infraestrutura do Nordeste melhora.',e:{cost:14,ridx:{NE:{infra:4}},mood:{NE:5},ideo:-.1}},
 {t:'Carros-pipa emergenciais',h:'R$ 4 bi. Resolve o curto prazo.',e:{cost:4,mood:{NE:1}}},
 {t:'Cortar auxílios regionais',h:'Economiza R$ 3 bi. Rejeição forte no Nordeste.',e:{cost:-3,mood:{NE:-7},ideo:.3}}]},
{id:'violencia',t:'Onda de violência nas capitais',d:'Homicídios sobem e a segurança vira o assunto principal do país.',o:[
 {t:'Operações de choque',h:'R$ 8 bi. Resposta rápida, ganho limitado a Sudeste e Nordeste.',e:{cost:8,ridx:{SE:{seg:2},NE:{seg:2}},mood:{SE:2},ideo:.3}},
 {t:'Inteligência e prevenção',h:'R$ 10 bi. Segurança e assistência social melhoram em todas as regiões.',e:{cost:10,idx:{seg:3,social:1},ideo:-.1}},
 {t:'Federalizar investigações',h:'R$ 5 bi. Ganho moderado e atrito com os estados.',e:{cost:5,idx:{seg:1},mood:{all:-1}}}]},
{id:'externa',t:'Crise financeira internacional',d:'Fuga de capitais e queda das bolsas pressionam o câmbio.',o:[
 {t:'Ajuste fiscal',h:'Economiza R$ 20 bi, derruba o PIB e custa popularidade.',e:{cost:-20,gn:-.003,mood:{all:-3},ideo:.2}},
 {t:'Política anticíclica',h:'R$ 25 bi. Segura o PIB e pressiona os preços.',e:{cost:25,gn:.003,infl:.5,ideo:-.2}}]},
{id:'acordo',t:'Acordo comercial com bloco asiático',d:'Abertura de mercado para carnes, grãos e minérios em troca de produtos industriais.',o:[
 {t:'Assinar o texto atual',h:'PIB sobe. Agro aprova, indústria reclama.',e:{gn:.004,mood:{CO:4,S:3,N:-1},ideo:.2}},
 {t:'Incluir cláusulas ambientais e sociais',h:'Ganho menor, com apoio mais amplo.',e:{gn:.002,idx:{amb:1},mood:{all:1},ideo:-.2}},
 {t:'Rejeitar o acordo',h:'Sem mudança no PIB, com desgaste no agro.',e:{mood:{CO:-3,S:-2},ideo:-.1}}]},
{id:'privatiza',t:'Proposta de privatizar estatais de infraestrutura',d:'Portos, aeroportos e distribuidoras de energia entram na pauta.',o:[
 {t:'Privatizar',h:'Receita de R$ 40 bi e ganho de PIB. Rejeição no Nordeste.',e:{cost:-40,gn:.003,mood:{NE:-4},ideo:.4}},
 {t:'Concessões com metas',h:'R$ 15 bi de receita e infraestrutura melhor.',e:{cost:-15,gn:.002,idx:{infra:2},ideo:.1}},
 {t:'Manter públicas',h:'Sem receita. Apoio no Nordeste.',e:{mood:{NE:2},ideo:-.4}}]},
{id:'renda',t:'Debate sobre renda básica ampliada',d:'Parlamentares propõem ampliar o programa de transferência de renda.',o:[
 {t:'Ampliar o programa',h:'R$ 35 bi. Proteção social sobe e a popularidade também.',e:{cost:35,idx:{social:4},mood:{all:4},infl:.3,ideo:-.4}},
 {t:'Focalizar nos mais pobres',h:'R$ 15 bi. Ganho menor, custo menor.',e:{cost:15,idx:{social:2},mood:{all:1}}},
 {t:'Rejeitar a proposta',h:'Sem custo. Proteção social cai.',e:{idx:{social:-1},mood:{all:-2},ideo:.3}}]}];
