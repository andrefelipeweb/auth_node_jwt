# Interface de Autenticação em Node.js

Esta é uma interface de autenticação desenvolvida em Node.js, oferecendo funcionalidades de cadastro de usuário, login, redefinição de senha e integração com MongoDB. A autenticação é realizada utilizando tokens de acesso JWT (JSON Web Tokens).

## Funcionalidades

- Cadastro de usuário: permite que novos usuários se registrem fornecendo informações básicas.
- Login: autenticação de usuários registrados, fornecendo acesso seguro às funcionalidades protegidas.
- Redefinição de senha: oferece aos usuários a capacidade de redefinir suas senhas por meio de um processo seguro.
- Integração com MongoDB: armazena e gerencia dados de usuário de forma eficiente em um banco de dados MongoDB.
- Autenticação com JWT: utiliza tokens de acesso JWT para autenticar usuários de forma segura e eficaz.

## Requisitos

- Node.js
- MongoDB

## Instalação

1. Clone o repositório:
git clone https://github.com/andrefelipeweb/auth_node_jwt.git

2. Instale as dependências:
cd seu-projeto
npm install

3. Configure as variáveis de ambiente:
PORT=3000
MONGODB_URI=sua-url-de-conexão-com-o-mongodb
JWT_SECRET=sua-chave-secreta-para-assinar-o-JWT
Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis:

4. Inicie o servidor:
npm start


## Uso

Após iniciar o servidor, você pode acessar a interface de autenticação por meio de um navegador ou consumir as rotas da API utilizando ferramentas como Postman ou cURL.

## Contribuindo

Contribuições são bem-vindas! Se você tiver sugestões, correções de bugs ou novas funcionalidades, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a [Licença MIT](https://github.com/andrefelipeweb/auth_node_jwt/blob/main/LICENSE).

