// Garante que cada módulo do motor e o build final têm sintaxe válida.
const fs=require('fs'),path=require('path'),vm=require('vm');
const {files,source}=require('./engine');
for(const f of files)new vm.Script(fs.readFileSync(path.join(__dirname,'..','src',f),'utf8'),{filename:f}).runInContext?0:0;
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),m=html.match(/<script>([\s\S]*)<\/script>/);
new vm.Script(m[1],{filename:'index.html'});
console.log('sintaxe OK ('+files.length+' módulos do motor + build)');
