# Brasil Simulator

Jogo de política e economia do Brasil (2027 a 2054). Arquivo único em `index.html`.

## Desenvolvimento

O jogo é um único `index.html`, gerado a partir de `src/` (módulos numerados: estado, eventos, crises, motor, leis extras, sistemas, mapa, interface).

- `npm run build` — concatena `src/` em `index.html`
- `npm test` — build + sintaxe + calibração com bots (9 partidos × esperto/aleatório) + testes de ponta a ponta com jsdom (`npm run test:rapido` para a versão curta)
- `src/_disabled/` guarda as 41 leis do PDF original, fora do build
