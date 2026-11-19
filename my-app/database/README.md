# Firebase Authentication

O app usa o Firebase Authentication para criar contas com e-mail e senha. O nome é salvo no perfil do Authentication e o perfil, incluindo o WhatsApp, é salvo em `users/{uid}` no Cloud Firestore. O número é normalizado para E.164; se não houver código de país, o app assume Brasil (`+55`).

## Localização e distância entre pessoas

O cadastro e a edição salvam o ponto escolhido no mapa em `users/{uid}.coordinates`, no formato `{ latitude: number, longitude: number }`, ou `null` quando removido/não informado. Perfis antigos sem coordenadas continuam válidos. Publique novamente `database/firestore.rules` para permitir e validar esse campo. A localização é opcional e representa o ponto escolhido, sem rastreamento por GPS. Alterar o endereço textual não reposiciona o ponto automaticamente.

`src/utils/distance.ts` expõe `calculateDistance(origin, destination)`, que retorna a distância em **metros**, usando Haversine, ou `null` se faltar um ponto válido. `formatDistance` apresenta metros ou quilômetros em português. Exemplo:

```ts
calculateDistance(
  { latitude: -23.5505, longitude: -46.6333 },
  { latitude: -22.9068, longitude: -43.1729 },
); // aproximadamente 361.150 metros
```

O contexto de livros calcula a distância entre `users/{uid}.coordinates` do perfil autenticado e `books/{id}.ownerCoordinates` e fornece o resultado à página inicial e aos detalhes, em `distanceMeters` e `distance`. É uma estimativa em linha reta, não a extensão de uma rota de carro ou a pé.

Ao cadastrar um livro, o app grava `ownerCoordinates` com a localização atual do perfil do dono. Livros antigos que não possuem esse campo mostram “Distância indisponível” até serem recadastrados ou terem o campo atualizado manualmente no Firestore. Os perfis continuam privados: o cliente não recebe permissão para consultar `users/{outroUid}`.

O catálogo inicial lê a coleção `books` do Firestore em tempo real. A leitura pública de livros é permitida pelas regras, mesmo para visitantes deslogados, enquanto a coleção `users` continua restrita ao próprio usuário.

Com o Firebase configurado, escolha um ponto no cadastro, confira `coordinates` no perfil no Console, cadastre um novo livro e confirme que o documento contém `ownerCoordinates`. Verifique também a edição/removal da localização pela tela de perfil.

## Configuração

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e adicione um app Web para obter os dados de configuração.
2. Em **Authentication → Sign-in method**, habilite **E-mail/senha**.
3. Crie o banco em **Firestore Database**.
4. Publique as regras do arquivo `firestore.rules` deste diretório em **Firestore Database → Rules**.
5. Copie `.env.example` para `.env` na raiz de `my-app` e preencha os valores do app Web.
6. Reinicie o Expo para carregar as variáveis: `npx expo start -c`.

O `.env` é ignorado pelo Git. Os valores `EXPO_PUBLIC_*` são incorporados no app cliente; não coloque senhas de serviço ou chaves privadas nesse arquivo.

### Upload das imagens dos livros

O cadastro envia as fotos selecionadas diretamente ao Cloudinary e grava no Firestore as URLs HTTPS retornadas em `images` e `thumbnail`. Para configurar:

1. Crie um produto no Cloudinary e copie o **Cloud name**.
2. Em **Settings → Upload → Upload presets**, crie um preset com modo **Unsigned**. Restrinja-o a imagens (`jpg`, `jpeg`, `png` e `webp`) e, se possível, limite o tamanho máximo do arquivo.
3. Preencha `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` e `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` no `.env` usado pelo Expo.
4. Reinicie o Expo com `npx expo start -c`.

O Cloud name e o nome do preset unsigned ficam visíveis no app. Não coloque o API Secret no cliente. O preset unsigned pode ser usado por terceiros que conheçam seu nome, então mantenha os formatos e limites de upload restritos no painel Cloudinary.

As contas ficam em **Authentication → Users** e os perfis em **Firestore Database → Data → users**. Caso o Auth crie a conta, mas o Firestore rejeite o perfil, a tela informa que a conta já foi criada; confira se o banco e as regras foram configurados.

## Criação e visualização do perfil

O ícone de usuário na tela inicial abre `/profile` (Meu perfil). Sem uma sessão autenticada, essa tela oferece o acesso ao cadastro. Ao concluir o cadastro, o app abre o perfil com nome, e-mail e WhatsApp. Os dados são acompanhados em tempo real em `users/{uid}`, com leitura restrita ao próprio usuário pelas regras existentes.

Para validar com o Firebase configurado:

1. Abra Meu perfil sem uma sessão: deve aparecer a opção Criar perfil.
2. Cadastre um usuário com nome, e-mail, WhatsApp e senha válidos: o app deve abrir Meu perfil com os dados cadastrados.
3. Volte ao início e toque no ícone de usuário: os mesmos dados devem aparecer.
4. Altere o nome ou WhatsApp do documento pelo Firebase Console: a tela aberta deve atualizar os dados.
5. Interrompa o acesso ao Firestore para verificar a mensagem de erro e o botão Tentar novamente.

A visualização do perfil depende da sessão disponível no Firebase Authentication; visitantes podem continuar navegando pelos livros da página inicial sem login.

## Endereço e edição

O cadastro e a edição de perfil aceitam endereço opcional: CEP, rua, número (ou S/N), complemento, bairro, cidade e UF. Ao completar o CEP, os campos disponíveis são consultados no ViaCEP. Se algum campo for preenchido, o endereço deve estar completo, exceto o complemento. O CEP é salvo com 8 dígitos e a UF em maiúsculas, dentro do mapa `address` do perfil. Perfis antigos sem esse mapa continuam funcionando.

Em Meu perfil → Editar perfil, o usuário pode alterar nome, WhatsApp e endereço, salvar ou cancelar. O e-mail permanece somente para leitura. O nome exibido no app vem do Firestore; o nome do Authentication é definido durante o cadastro. Se a conta foi criada sem o documento de perfil, salvar a edição também cria esse documento.

Publique novamente `database/firestore.rules` após esta alteração. As regras validam os campos e mantêm o endereço completo restrito ao próprio usuário.

## Livros cadastrados e histórico de trocas

### Arrays de livros no perfil

Novos documentos `users/{uid}` são criados com `books: []` (livros cadastrados) e `likedBooks: []` (livros curtidos). Esses campos são arrays destinados a objetos de livros; os campos internos de cada objeto serão definidos no futuro cadastro. Exemplo de estrutura futura, apenas ilustrativo:

```json
{
  "books": [{ "id": "livro-1", "title": "Torto Arado" }],
  "likedBooks": [{ "id": "livro-2", "title": "O Pequeno Príncipe" }]
}
```

As regras permitem criar e atualizar os arrays somente no perfil do próprio usuário e recusam campos `books`/`likedBooks` que não sejam listas (como texto, mapa ou `null`). Perfis antigos podem continuar sem esses campos e são lidos como listas vazias. A edição de nome/endereço não substitui as listas; repetir o cadastro de uma conta já autenticada também preserva os livros existentes. Se a edição precisar criar um perfil ausente, as duas listas são inicializadas vazias.

Neste estágio, as regras validam o tipo externo `list`, sem validar o formato de cada item. As regras do Firestore não oferecem um laço genérico para verificar todos os elementos de uma lista; o contrato e a validação dos objetos precisarão acompanhar a implementação do cadastro de livros. A leitura pelo app aceita somente itens que sejam objetos.

Esses arrays não alimentam a página inicial nem `/profile/my-books`; a coleção `books` continua separada dos campos no perfil.

Para ativar, publique o arquivo completo `database/firestore.rules` em **Firebase Console → Firestore Database → Regras**. As regras permitem os campos; é o código do cadastro que cria os arrays. Elas não adicionam campos automaticamente aos usuários antigos.

Para validar, cadastre uma conta e confira os dois arrays vazios em `users/{uid}`. No simulador de regras, usando uma conta autenticada como dona do documento, confirme que atualizar com arrays de objetos é permitido e que texto/mapa/`null` são recusados. Uma conta diferente e uma requisição sem autenticação devem ser recusadas. Confira também que editar o perfil preserva listas preenchidas e que alterações de `uid`, `email` e `createdAt` continuam proibidas. O Console usa acesso administrativo e não serve para validar recusas das regras.

As telas oficiais `/profile/my-books` e `/profile/my-trades` consultam os registros do usuário em lotes de 20, com a opção Carregar mais. `/profile/my-books` usa cards em grade e permite excluir os livros próprios. `/profile/my-trades` mostra solicitações enviadas e recebidas e permite realizar as ações disponíveis para o estado atual da troca. A página inicial lê a coleção `books` em tempo real e exibe os livros disponíveis aos visitantes e usuários autenticados.

Contrato dos documentos:

- `books/{id}`: `ownerId`, `owner`, `title`, `author`, `images`, `thumbnail`, `category`, `type`, `available`, `bookCondition`, informações opcionais da condição e da troca relacionada, `ownerCoordinates` e `createdAt`.
- `trades/{id}`: `participantIds`, remetente e destinatário (UID e nome de exibição), `offeredBooks` (até 20 snapshots com ID, título, autor e miniatura), `requestedBook`, `status`, `successConfirmedBy` e `createdAt`.
- `trades/{id}/contacts/{uid}`: `email` e `whatsapp` do participante. Os contatos são disponíveis apenas aos participantes após iniciar ou concluir a negociação.

Os estados reconhecidos pelo fluxo são `pending`, `negotiating`, `cancelled`, `rejected` e `completed`. O remetente pode cancelar uma solicitação pendente. O destinatário pode recusá-la ou aceitá-la. Após o aceite, a troca fica em negociação e ambos os participantes podem confirmar sucesso ou declinar. Quando ambos confirmam, a troca fica `completed` e os livros envolvidos recebem `available: false`, `traded: true` e `completedTradeId`.

A tela de livros cadastrados consulta `ownerId == uid`; a tela de trocas usa `participantIds array-contains uid`. A página inicial lê a coleção de livros publicamente, enquanto as trocas continuam visíveis apenas aos participantes. O cadastro cria documentos de livros pelo app; as regras permitem que o dono os exclua e permitem marcar livros como negociados apenas durante a conclusão de uma troca válida.

O fluxo cria solicitações pendentes, permite ao remetente cancelar ou ao destinatário recusar/aceitar, iniciar a negociação, declinar ou confirmar sucesso por ambos os participantes. Os contatos só podem ser criados pelo próprio participante e são exibidos em `negotiating` ou `completed`. Publique `database/firestore.rules` para habilitar esse fluxo e a leitura condicional dos contatos.

## Validação das novas telas

1. Cadastre um perfil com endereço e confira os campos em Meu perfil.
2. Edite nome, WhatsApp e endereço; salve e reabra a tela para confirmar a persistência. Teste também Cancelar e a remoção de todos os campos opcionais de endereço.
3. Tente salvar CEP ou UF inválidos, nome vazio e endereço parcial: a operação deve ser recusada.
4. No Console, crie um livro com `ownerId` igual ao UID da conta e `ownerCoordinates` igual às coordenadas desse perfil. Crie uma troca com esse UID em `participantIds`. Verifique as duas listas pelo perfil.
5. Confirme que documentos de outra conta não aparecem e teste mais de 20 documentos para verificar Carregar mais.
6. Em ambiente de teste com o emulador de regras, confirme que outra conta não consegue ler o perfil/endereço, visitantes podem ler livros, o cliente não consegue alterar UID/e-mail e apenas participantes autorizados podem alterar uma troca.

Os testes locais de endereço podem ser executados em Node com suporte a TypeScript nativo:

```bash
node --experimental-strip-types --test tests/address.test.mjs
```
