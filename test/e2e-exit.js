const {JSDOM}=(()=>{try{return require('jsdom')}catch(e){return require('/home/claude/sim/node_modules/jsdom')}})();
const html=require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const errs=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/',beforeParse(w){w.addEventListener('error',e=>errs.push(e.message));}});
const w=dom.window,d=w.document;const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));const q=s=>d.querySelector(s);
for(const mode of process.argv.slice(2)){
 w.localStorage.setItem('simpol-tut','1');
 w.eval('showStart()');click(q('[data-act=start][data-k=PLB]'));
 for(let i=0;i<30;i++){let g=0;while(!q('#modal').hidden&&q('[data-act=ev]')&&g++<6)click(q('[data-act=ev]'));if(!q('#modal').hidden&&q('[data-act=close]'))click(q('[data-act=close]'));click(q('#btnEnd'));const a=q('[data-act=after]');if(a)click(a);const ad=q('[data-act=adv]');if(ad)click(ad);if(q('[data-act=quit]'))break;}
 if(mode==='quit')click(q('[data-act=quit]'));
 else if(mode==='lose'){click(q('[data-act=camp][data-k=mod]'));}
 else if(mode==='resign'){const cc=q('[data-act=close]');if(cc)click(cc);click(q('[data-act=menu]'));click(q('[data-act=resign]'))}
 const lo=q('[data-act=lose]');if(lo)click(lo);
 const t=q('#sheet').textContent;
 console.log(mode,'|',q('.big')&&q('.big').textContent,'|',q('#tlsvg')?'timeline':'NO TL','|',(t.match(/Depois de você[^.]*\./)||[''])[0].slice(0,160),'|',(t.match(/código SP-\w+-\d/)||[''])[0]);
 const tl=q('#tlsvg');if(tl)console.log(' markers',tl.querySelectorAll('circle,path,rect').length);
}
console.log('errs',errs);
