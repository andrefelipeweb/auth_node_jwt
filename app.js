const express = require("express");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); 
const app = express();
const axios = require('axios');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Use o cookie-parser

// models
const User = require("./models/User");

// Config JSON response
app.use(express.json());

// Open Route
app.get("/", (req, res) => {
  const loginButton = "<a href='/login'><button>Ir para a página de login</button></a>";
  const responseHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bem vindo à API</title>
    </head>
    <body>
      <h1>Bem vindo à API!</h1>
      ${loginButton}
    </body>
    </html>
  `;
  res.send(responseHTML);
});

app.get("/login", (req, res) => {
  // Renderize o formulário de login diretamente na rota /login
  res.send(`
    <form method="post" action="/auth/login">
      <label for="email">Email:</label>
      <input type="email" name="email" required><br>
      <label for="password">Senha:</label>
      <input type="password" name="password" required><br>
      <button type="submit">Login</button>
    </form>
    <p>Caso não tenha usuário e senha, favor entrar em contato com o admin.</p>
  `);
});

// Rota de Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // validations
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  // check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  // check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" }); 
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    // Defina o token como um cookie com o nome "token"
    //res.cookie("token", token, { httpOnly: true });

    res.status(201).json({ msg: "Login bem-sucedido" });
  } catch (error) {
    res.status(500).json({ msg: "Falha no login" });
  }
});

// Função para verificar o token
function checkToken(req, res, next) {
  const token = req.cookies.token; // Obtenha o token dos cookies

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}

// Rota privada protegida por autenticação JWT
app.get("/auth/index", checkToken, (req, res) => {
  res.redirect("/auth/index.html"); 
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.rbvdsvb.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conectou ao banco!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));


app.get("/register", (req, res) => {
  // Renderize o formulário de registro diretamente na rota /register
  res.send(`
    <form method="post" action="/auth/register">
      <label for="name">Nome:</label>
      <input type="text" name="name" required><br>
      <label for="email">Email:</label>
      <input type="email" name="email" required><br>
      <label for="password">Senha:</label>
      <input type="password" name="password" required><br>
      <label for="confirmpassword">Confirme a senha:</label>
      <input type="password" name="confirmpassword" required><br>
      <button type="submit">Registrar</button>
    </form>
  `);
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  const token = response.data.token;
  localStorage.setItem('token', token);

  // validations
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  if (password !== confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A senha e a confirmação precisam ser iguais!" });
  }

  // check if user exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
  }

  // create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // create user
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

