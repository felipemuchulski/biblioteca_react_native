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
