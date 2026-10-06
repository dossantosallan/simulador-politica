// Concatena src/ (ordem numérica) em um único index.html. Uso: node build.js [saida]
const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'src'),out=process.argv[2]||path.join(__dirname,'index.html');
const files=fs.readdirSync(dir).filter(f=>/\.(js|html)$/.test(f)).sort();
let s=files.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n')+'\n</script>\n</body>\n</html>\n';
fs.writeFileSync(out,s);console.log('build:',files.length,'módulos ->',out,(s.length/1024).toFixed(0)+' KB');
