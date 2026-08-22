# Manga Reader — extensão de navegador

Transforma a página de um capítulo de mangá (uma sequência de `<img>`) em um
modo de leitura decente: página única ou rolagem contínua, zoom, RTL, tela
cheia, tema escuro, navegação entre capítulos e progresso salvo.

Feito para funcionar em qualquer site cuja página de capítulo seja
"um monte de imagens em sequência" (como blood-on-the-tracks.com), através
de um **parser genérico**. Sites específicos podem ganhar um adapter próprio
para maior confiabilidade (já incluído um para blood-on-the-tracks.com).

## Como testar agora no Firefox (extensão temporária)

1. Abra `about:debugging#/runtime/this-firefox` no Firefox.
2. Clique em **"Carregar extensão temporária..."** ("Load Temporary Add-on...").
3. Selecione o arquivo `manifest.json` dentro desta pasta.
4. Um ícone da extensão aparecerá na barra de ferramentas.

> Extensões temporárias são removidas quando o Firefox fecha. Para algo
> permanente, veja "Empacotar/assinar" mais abaixo.

## Como testar no Chrome, Helium ou outro navegador baseado em Chromium

O `manifest.json` agora declara `background.service_worker` (lido pelo
Chromium) *e* `background.scripts` (lido pelo Firefox), então o mesmo pacote
funciona nos dois. Helium é baseado em Chromium e usa as mesmas páginas
internas do Chrome.

1. Abra `chrome://extensions` (funciona também no Helium).
2. Ative **"Modo do desenvolvedor"** (canto superior direito).
3. Clique em **"Carregar sem compactação"** ("Load unpacked").
4. Selecione a pasta `manga-reader/` (a que contém `manifest.json`).
5. O ícone da extensão aparece na barra de ferramentas — permanece instalado
   entre reinícios do navegador (diferente do modo temporário do Firefox).

> Se editar o código-fonte em `src/`, rode `npm run build` de novo antes de
> clicar em "Recarregar" na página de extensões — o navegador lê os arquivos
> já compilados em `dist/` e `popup/popup.js`, não os `.ts`.

## Como usar

1. Vá até a página do capítulo (ex.:
   `https://blood-on-the-tracks.com/manga/blood-on-the-tracks-chapter-1/`).
2. Clique no ícone da extensão.
3. Clique em **"Abrir leitor nesta aba"** — ou cole qualquer URL de capítulo
   no campo e clique em **"Abrir link no leitor"** (abre uma nova aba e já
   ativa o leitor automaticamente).
4. Dentro do leitor:
   - `←` / `→` ou clique nas bordas esquerda/direita: página anterior/próxima
   - `Espaço`: próxima página
   - `F`: tela cheia
   - `Esc`: fechar o leitor
   - Botões no topo: alternar modo (página única / contínuo), direção
     (LTR/RTL), ajustar largura, zoom, tema, tela cheia
   - Botões embaixo: capítulo anterior/próximo, navegação de página, slider

O progresso (última página lida de cada capítulo) e as preferências (modo,
zoom, tema etc.) ficam salvos localmente (`browser.storage.local`) e
persistem entre sessões.

## Estrutura do projeto

```
manga-reader/
├── manifest.json          # Manifest V3 (Firefox + Chromium/Helium)
├── src/
│   ├── background.ts      # injeta o content script sob demanda, abre URLs
│   ├── content.ts          # ponto de entrada injetado na aba do capítulo
│   ├── reader.ts            # UI do leitor (Shadow DOM, todos os modos)
│   ├── storage.ts           # progresso + configurações (storage.local)
│   └── adapters/
│       ├── types.ts
│       ├── generic.ts       # heurística: maior cluster de <img> grandes
│       ├── bloodOnTheTracks.ts  # adapter específico do site
│       └── index.ts         # tenta adapters específicos, cai no genérico
├── popup/
│   ├── popup.html / .css / .ts
├── icons/
├── build.mjs               # bundler (esbuild)
└── dist/                   # JS já compilado (pronto para carregar)
```

### Por que a extensão não roda em todas as páginas o tempo todo

O leitor só é ativado quando você clica no popup — isso evita rodar código em
todo site que você visita e mantém a extensão "silenciosa" por padrão.

### Adicionando suporte a outro site

Crie um novo arquivo em `src/adapters/`, exportando um objeto que implementa
`Adapter` (veja `bloodOnTheTracks.ts` como exemplo) e registre-o em
`src/adapters/index.ts`. Se o site já for "só uma sequência de imagens
grandes", o `generic.ts` provavelmente já funciona sem precisar de nada novo.

## Rebuild depois de editar o código

```bash
npm install
npm run build       # compila TS + tipa + gera dist/*.js e popup/popup.js
npm run watch        # recompila automaticamente a cada mudança
```

## Próximos passos sugeridos

- Botão flutuante opcional que auto-detecta páginas de mangá sem precisar
  abrir o popup.
- Publicar/assinar no addons.mozilla.org para instalação permanente sem
  modo de desenvolvedor.
