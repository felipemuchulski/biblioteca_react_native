# Firebase Authentication

O app usa o Firebase Authentication para criar contas com e-mail e senha. O nome é salvo no perfil do Authentication e o perfil, incluindo o WhatsApp, é salvo em `users/{uid}` no Cloud Firestore. O número é normalizado para E.164; se não houver código de país, o app assume Brasil (`+55`).

## Configuração

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e adicione um app Web para obter os dados de configuração.
2. Em **Authentication → Sign-in method**, habilite **E-mail/senha**.
3. Crie o banco em **Firestore Database**.
4. Publique as regras do arquivo `firestore.rules` deste diretório em **Firestore Database → Rules**.
5. Copie `.env.example` para `.env` na raiz de `my-app` e preencha os valores do app Web.
6. Reinicie o Expo para carregar as variáveis: `npx expo start -c`.

O `.env` é ignorado pelo Git. Os valores `EXPO_PUBLIC_*` são incorporados no app cliente; não coloque senhas de serviço ou chaves privadas nesse arquivo.

As contas ficam em **Authentication → Users** e os perfis em **Firestore Database → Data → users**. Caso o Auth crie a conta, mas o Firestore rejeite o perfil, a tela informa que a conta já foi criada; confira se o banco e as regras foram configurados.

## Criação e visualização do perfil

O ícone de usuário na tela inicial abre `/profile` (Meu perfil). Sem uma sessão autenticada, essa tela oferece o acesso ao cadastro. Ao concluir o cadastro, o app abre o perfil com nome, e-mail e WhatsApp. Os dados são acompanhados em tempo real em `users/{uid}`, com leitura restrita ao próprio usuário pelas regras existentes.

Para validar com o Firebase configurado:

1. Abra Meu perfil sem uma sessão: deve aparecer a opção Criar perfil.
2. Cadastre um usuário com nome, e-mail, WhatsApp e senha válidos: o app deve abrir Meu perfil com os dados cadastrados.
3. Volte ao início e toque no ícone de usuário: os mesmos dados devem aparecer.
4. Altere o nome ou WhatsApp do documento pelo Firebase Console: a tela aberta deve atualizar os dados.
5. Interrompa o acesso ao Firestore para verificar a mensagem de erro e o botão Tentar novamente.

A visualização depende da sessão disponível no Firebase Authentication; o login de contas existentes ainda não faz parte deste fluxo.

## Endereço e edição

O cadastro e a edição de perfil aceitam endereço opcional: CEP, rua, número (ou S/N), complemento, bairro, cidade e UF. Ao completar o CEP, os campos disponíveis são consultados no ViaCEP. Se algum campo for preenchido, o endereço deve estar completo, exceto o complemento. O CEP é salvo com 8 dígitos e a UF em maiúsculas, dentro do mapa `address` do perfil. Perfis antigos sem esse mapa continuam funcionando.

Em Meu perfil → Editar perfil, o usuário pode alterar nome, WhatsApp e endereço, salvar ou cancelar. O e-mail permanece somente para leitura. O nome exibido no app vem do Firestore; o nome do Authentication é definido durante o cadastro. Se a conta foi criada sem o documento de perfil, salvar a edição também cria esse documento.

Publique novamente `database/firestore.rules` após esta alteração. As regras validam os campos e mantêm o endereço completo restrito ao próprio usuário.

## Livros cadastrados e histórico de trocas

As telas `/profile-books` e `/profile-trades` são acessíveis pelo perfil e consultam coleções reais do Firestore, em lotes de 20 com a opção Carregar mais. Não utilizam os livros simulados da página inicial.

Contrato dos documentos:

- `books/{id}`: `ownerId` (UID do dono), `title`, `author`, `type` (`donation` ou `exchange`) e `available` (boolean).
- `trades/{id}`: `participantIds` (lista de UIDs dos participantes), `offeredBookTitle`, `requestedBookTitle`, `status` (`pending`, `accepted`, `completed`, `cancelled` ou `rejected`) e `createdAt` (timestamp).

As consultas usam respectivamente `ownerId == uid` e `participantIds array-contains uid`, sem exigir índices compostos. As regras permitem ler somente livros próprios e trocas das quais o usuário participa. Escritas nessas coleções pelo cliente permanecem bloqueadas: ainda não existe cadastro persistente de livros nem fluxo de troca implementado no app. Para integração, esses fluxos precisarão produzir os documentos acima, com suas próprias validações e permissões. Até lá, é possível preparar documentos de teste pelo Firebase Console, que usa acesso administrativo.

## Validação das novas telas

1. Cadastre um perfil com endereço e confira os campos em Meu perfil.
2. Edite nome, WhatsApp e endereço; salve e reabra a tela para confirmar a persistência. Teste também Cancelar e a remoção de todos os campos opcionais de endereço.
3. Tente salvar CEP ou UF inválidos, nome vazio e endereço parcial: a operação deve ser recusada.
4. No Console, crie um livro com `ownerId` igual ao UID da conta e uma troca com esse UID em `participantIds`. Verifique as duas listas pelo perfil.
5. Confirme que documentos de outra conta não aparecem e teste mais de 20 documentos para verificar Carregar mais.
6. Em ambiente de teste com o emulador de regras, confirme que outra conta não consegue ler o perfil/endereço e que o cliente não consegue alterar UID, e-mail ou registrar trocas diretamente.

Os testes locais de endereço podem ser executados em Node com suporte a TypeScript nativo:

```bash
node --experimental-strip-types --test tests/address.test.mjs
```
