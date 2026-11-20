# Livroei

Aplicativo mobile para doação e troca de livros entre pessoas da comunidade, feito com **Expo**, **React Native** e **TypeScript**. Usa **Firebase** (autenticação e Firestore), **Cloudinary** (upload de imagens) e **Google Maps** (seleção de localização).

## Instalação

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO> biblioteca_react_native
```

### 2. Entrar na pasta do app

O projeto Expo (onde fica o `app.json`) está dentro de:

```bash
cd biblioteca_react_native
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na pasta **`biblioteca_react_native`**. O `app.config.js` lê o arquivo a partir desse local.

```
Arquivo .env disponibilizado somente para pessoal autorizado.
```

## Executando o projeto

Dentro da pasta do app, inicie o servidor de desenvolvimento:

```bash
npx expo start
```

Depois, escolha como abrir:

- **Celular (Recomendado):** escaneie o QR Code exibido no terminal. Veja os requisitos na seção [Mobile](#mobile).
- **Web:** pressione `w` no terminal.

Se o app não carregar após alterar o `.env` ou instalar algo novo, reinicie limpando o cache:

```bash
npx expo start -c
```

## Scripts úteis

```bash
npx tsc --noEmit      # verifica erros de tipagem
npx expo lint         # verifica problemas de lint
npm run check         # tipagem + lint, se o script existir no package.json
```

## Mobile

Para testar o aplicativo no celular, leia o QR Code exibido pelo `npx expo start` com o app **Expo Go** (Android) ou com a câmera (iOS). Para isso funcionar:

- **Suporte ao SDK 58 do Expo:** o app instalado no celular (Expo Go) precisa suportar a `versão 58 do SDK do Expo`. Se a versão do Expo Go for incompatível, o projeto não abrirá. Mantenha o Expo Go atualizado pela loja de aplicativos.
- **Mesma rede Wi-Fi:** o computador em que o projeto está rodando e o celular que fará a leitura do QR Code precisam estar `conectados à mesma rede Wi-Fi`. Em redes diferentes, o celular não consegue acessar o servidor de desenvolvimento.

## Como testar

O projeto já possui **2 usuários pré-criados**, cada um com **2 livros classificados para troca** e **1 livro classificado para doação**.

Para testar o sistema de trocas no aplicativo, realize ações entre os acessos abaixo:

| Usuário   | E-mail            | Senha     |
| --------- | ----------------- | --------- |
| Usuário 1 | `user1@teste.com` | `Teste1!` |
| Usuário 2 | `user2@teste.com` | `Teste2!` |

Ou, se preferir, crie um novo acesso através da tela de login.

## Estrutura de branches

- `hml`: homologação
- `hml-bkp`: backup da homologação
- `dev-*`: branches de desenvolvimento de cada pessoa do time (lucas, felipe e guilherme)
- `add-troca-livro`: branch à parte para aplicação individual da funcionalidade de trade
- `fix-add-image-web`: branch à parte para aplicação individual da biblioteca de upload de imagens para Desktop
