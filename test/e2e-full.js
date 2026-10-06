const {JSDOM}=(()=>{try{return require('jsdom')}catch(e){return require('/home/claude/sim/node_modules/jsdom')}})();
const html=require('fs').readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const errs=[];process.on('uncaughtException',e=>console.log('UNC',e.message));
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://x.test/',beforeParse(w){w.addEventListener('error',e=>errs.push(e.message));}});
const w=dom.window,d=w.document;
w.addEventListener('error',e=>console.log('ERR',e.message));const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const q=s=>d.querySelector(s);
let tg=0;while(q('[data-act=tut]:not([data-i="0"]),[data-act=tutend]')&&tg++<10){const b=q('#sheet [data-act=tutend]')||q('#sheet [data-act=tut]:last-of-type');click(b)}
if(!q('[data-act=start][data-k=PSB]'))errs.push('nostart '+q('#sheet').textContent.slice(0,60));
click(q('[data-act=daily]'));if(!q('.tipbox'))errs.push('nodaily');
click(q('[data-act=start][data-k=PSB]'));
let n=0;
for(let i=0;i<120*1;i++){
 // resolve events
 let g=0;while(!q('#modal').hidden&&q('[data-act=ev]')&&g++<6)click(q('[data-act=ev]'));
 if(!q('#modal').hidden&&q('[data-act=close]'))click(q('[data-act=close]'));
 if(i==3){click(q('[data-act=tab][data-k=leis]'));click(q('[data-act=lfilter][data-k=bold]'));if(!q('#leisList .bill'))errs.push('noleis');click(q('#leisList [data-act=send]'));click(q('[data-act=tab][data-k=gov]'));}
 if(i==5){click(q('[data-act=tab][data-k=ind]'));if(!q('#indCards .k'))errs.push('noind');d.querySelectorAll('#indCards [data-act=ind]').forEach(b=>click(b));click(q('#iTable [data-act=isel]'));click(q('[data-act=isort][data-k=im]'));click(q('[data-act=tab][data-k=coal]'));if(!q('#coalList .crow'))errs.push('nocoal');const mn=q('[data-act=minadj][data-d="-1"]:not([disabled])');if(mn)click(mn);const ci=q('[data-act=coalin]:not([disabled])');if(ci)click(ci);const co=q('[data-act=coalout]');if(co)click(co);click(q('[data-act=tab][data-k=gov]'));}
 if(i%4==0&&q('[data-act=send]')){click(q('[data-act=send]'));}
 click(q('#btnEnd'));
 const a=q('[data-act=after]');if(a)click(a);
 const ad=q('[data-act=adv]');if(ad)click(ad);const c=q('[data-act=camp]');if(c)click(c);
 const nx=q('[data-act=next]');if(nx)click(nx);
 if(i==60){click(q('[data-act=menu]'));click(q('[data-act=cbtoggle]'));click(q('[data-act=cbtoggle]'));click(q('[data-act=close]'))}
 if(q('[data-act=lose]')||q('.big')){const lo=q('[data-act=lose]');if(lo){click(lo);console.log('lost -> final')}
 console.log('ended at',q('#eyebrow').textContent,q('.big')&&q('.big').textContent);break}
 n++;
}
// info clicks
d.querySelectorAll('[data-act=info]').forEach(b=>{click(b);if(!q('.tipbox'))errs.push('noinfo '+b.dataset.k);click(q('[data-act=close]'))});
Object.keys(w.SINFO||{}).length;
console.log('turns',n,'errs',errs.slice(0,5));
console.log(q('#eyebrow').textContent,'|',[...d.querySelectorAll('.k b')].map(b=>b.textContent).join(' '));
