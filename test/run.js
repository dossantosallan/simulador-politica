// Uso: node test/run.js [rapido]   — constrói e roda todos os testes
const {spawnSync}=require('child_process'),path=require('path');
const root=path.join(__dirname,'..');let fail=0;
const step=(n,cmd,args,env)=>{console.log('\n▶',n);const r=spawnSync(cmd,args,{cwd:root,encoding:'utf8',maxBuffer:1<<26,env:Object.assign({},process.env,env||{}),timeout:600000});const o=(r.stdout||'')+(r.stderr||'');process.stdout.write(o.split('\n').slice(-8).join('\n'));if(r.status!==0||/errs \[[^\]]/.test(o)||/UNC|ERR /.test(o)){fail++;console.log('✗ FALHOU:',n)}};
step('build','node',['build.js']);
step('sintaxe','node',['test/syntax.js']);
step('calibração','node',['test/calibration.js'],{N:process.argv[2]==='rapido'?'4':'8'});
step('crises em fases','node',['test/crises.js']);
step('e2e jogo completo','node',['test/e2e-full.js']);
step('e2e saída/sucessão','node',['test/e2e-exit.js','quit']);
step('e2e interregno','node',['test/e2e-interregnum.js']);
console.log(fail?`\n${fail} etapa(s) falharam`:'\nTudo OK');process.exit(fail?1:0);
