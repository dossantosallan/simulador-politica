const {JSDOM}=(()=>{try{return require('jsdom')}catch(e){return require('/home/claude/sim/node_modules/jsdom')}})();
const html=require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');const errs=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/',beforeParse(w){w.addEventListener('error',e=>errs.push(e.message));}});
const w=dom.window,d=w.document;const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));const q=s=>d.querySelector(s);
w.localStorage.setItem('simpol-tut','1');w.eval('showStart()');click(q('[data-act=start][data-k=PSB]'));
w.eval('S.consec=2');let log=[];
for(let i=0;i<200;i++){let g=0;while(!q('#modal').hidden&&q('[data-act=ev]')&&g++<6)click(q('[data-act=ev]'));if(!q('#modal').hidden&&q('[data-act=close]'))click(q('[data-act=close]'));
 click(q('#btnEnd'));
 for(const k of ['after','adv','interr','retc','rcamp','camp','next','fin','lose']){const e=q('#sheet [data-act='+k+']');if(e){log.push(k);click(e)}}
 if(q('.big')){break}}
console.log(log.join(' ').replace(/(after |adv )+/g,'· '));console.log(q('.big')&&q('.big').textContent,w.eval('S.ano+" "+S.consec+" "+S.nint+" "+S.mandato'),'errs',errs);
const tl=q('#tlsvg');console.log('tl',!!tl);
