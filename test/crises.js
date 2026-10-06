// Cada crise em fases roda de ponta a ponta, com qualquer sequência de opções, sem erros e sem NaN.
const {source}=require('./engine');
new Function(source()+`
let bad=0;
for(const id of Object.keys(CRISES)){for(let opt=0;opt<3;opt++){
 const S=newGame(0,2,'MDB',77);S.ano=2027;S.q=1;startTurn(S);S.crise={id,ph:0,sev:0,vac:0,ac:0};S.reg=null;S.cd.crise=0;let ph=0,seen=0;
 for(let n=0;n<40&&S.crise;n++){S.queue=[];S.reg=S.reg&&S.reg.left>0?S.reg:null;const e=crisisStep(S);if(e){seen++;applyFx(S,e.o[opt].e)}S.queue=[];simQuarter(S);if(S.reg)S.reg.left--;if(S.reg&&S.reg.left<=0)S.reg=null;S.q++;if(S.q>4){S.q=1;S.ano++}S.hist.length>0}
 const g=[S.infl,S.unem,S.rt,S.I,S.debt].every(Number.isFinite);if(!g||seen!==CRISES[id].ph.length){bad++;console.log('FALHA',id,opt,'fases',seen,'/',CRISES[id].ph.length,g)}}}
console.log(bad?'FALHAS: '+bad:'crises OK ('+Object.keys(CRISES).length+' tipos)');process.exit(bad?1:0)`)();
