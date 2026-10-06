// Carrega os módulos do motor (src/10..40) para uso nos testes sem DOM.
const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'..','src');
exports.files=fs.readdirSync(dir).filter(f=>/^[1-4]\d-.*\.js$/.test(f)).sort();
exports.source=()=>exports.files.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n');
