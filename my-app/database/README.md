# Firebase Authentication

O app usa o Firebase Authentication para criar contas com e-mail e senha. O nome informado é salvo no perfil do usuário no Firebase Authentication.

## Configuração

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e adicione um app Web para obter os dados de configuração.
2. Em **Authentication → Sign-in method**, habilite **E-mail/senha**.
3. Copie `.env.example` para `.env` na raiz de `my-app` e preencha os valores do app Web.
4. Reinicie o Expo para carregar as variáveis: `npx expo start -c`.

O `.env` é ignorado pelo Git. Os valores `EXPO_PUBLIC_*` são incorporados no app cliente; não coloque senhas de serviço ou chaves privadas nesse arquivo.

As contas ficam em **Authentication → Users** no Firebase Console. O cadastro ainda não cria documentos no Cloud Firestore.
