const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  if (users.length > 0) return res.status(200).send(users);
  return res.status(404).send("No users found");
});

app.post("/user", async (req, res) => {
  const data = req.body;
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
    },
  });
  return res.sendStatus(201);
});

app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  return res.sendStatus(200);
});

app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name: data.name,
      email: data.email,
    },
  });
  return res.sendStatus(200);
});

app.get("/users/:name", async (req, res) => {
  const name = req.params.name;
  const user = await prisma.user.findMany({
    where: {
      name: name,
    },
  });
  if (user.length > 0) return res.status(200).send(user);
  return res.status(404).send("No users found");
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findMany({
    where: {
      id: Number(id),
    },
  });
  if (user.length > 0) return res.status(200).send(user);
  return res.status(404).send("No user found");
});

// Inicie o servidor na porta especificada
const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = { app, server };

/*
//importações necessárias para o projeto
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cors = require("cors");

//configuração de json e cors
app.use(bodyParser.json());
app.use(cors());

//rota que listar todos os usuários cadastrados
app.get("/users", async (req, res) => {
  try {
    // Consulta todos os usuários no banco de dados
    const users = await prisma.user.findMany();

    if(users.length > 0){
      // Retorna a lista de usuários como resposta
      res.send(users);
    }else{
      res.send("Sem usuários cadastrados!")
    }
  } catch (error) {
    // Se houver um erro, envia uma resposta de erro
    console.error("Erro ao listar todos os usuários cadastrados", error);
  }
});

//rota que cadastra um usuário
app.post("/users", async (req, res) => {
  try {
    
    const data = req.body;

    // Validar os dados recebidos
    if (!data || !data.name || !data.email) {
      return res.status(400).send("Nome e email são obrigatórios.");
    }

    // Crie um novo usuário no banco de dados
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });

    // Desconecte do Prisma após a operação
    await prisma.$disconnect();

    // Responda com um código de status 201 (Created)
    return res.sendStatus(201);

  } catch (error) {
    // Se houver um erro, envie uma resposta de erro
    console.error("Erro ao criar usuário",error);
  }
});

//rota que apaga um usuário, passando o id
app.delete("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Verifica se o ID é um número válido
    if (isNaN(userId)) {
      res.send('ID inválido.');
      return;
    }

    // Tenta apagar o usuário com o ID fornecido
    const deletedUser = await prisma.users.delete({
      where: {
        id: userId,
      },
    });

    // Verifica se o usuário foi apagado com sucesso
    if (deletedUser) {
      res.send("Usuário apagado com sucesso.");
    } else {
      res.send("Usuário não encontrado.");
    }
  } catch (error) {
    // Se houver um erro, envia uma resposta de erro
    console.error("Erro ao apagar um usuário passando o id", error);
    res.send("Erro ao apagar usuário.");
  }
});

//rota que atualiza um usuário, pelo id
app.put("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Verifica se o ID é um número válido
    if (isNaN(userId)) {
      res.send('ID inválido.');
      return;
    }

    const { name, email } = req.body; // Obtém os dados do corpo da requisição

    // Tenta atualizar o usuário com o ID fornecido
    const updatedUser = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
      },
    });

    // Verifica se o usuário foi atualizado com sucesso
    if (updatedUser) {
      res.send('Usuário atualizado com sucesso.');
    } else {
      res.send('Usuário não encontrado.');
    }
  } catch (error) {
    // Se houver um erro, envie uma resposta de erro
    console.error('Erro ao atualizar usuário.', error);
  }
});

//rota que lista usuários que contenham o nome específico
app.get("/users/:name", async (req, res) => {
  try {
    const userName = req.params.name; // Obtém o parâmetro de nome da URL

    // Consulta usuários no banco de dados com o nome específico
    const usersWithSpecificName = await prisma.users.findMany({
      where: {
        name: {
          contains: userName,
        },
      },
    });

    // Retorna a lista de usuários com o nome específico como resposta
    res.send(usersWithSpecificName);
  } catch (error) {
    // Se houver um erro, envie uma resposta de erro
    console.error('Erro ao buscar usuários.', error);
  }
});

//rota que lista um usuário pelo id
app.get("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Verifica se o ID é um número válido
    if (isNaN(userId)) {
      res.send('ID inválido.');
      return;
    }

    // Consulta um usuário no banco de dados pelo ID
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    // Verifica se o usuário foi encontrado
    if (user) {
      // Retorna o usuário como resposta
      res.send(user);
    } else {
      res.send('Usuário não encontrado.');
    }
  } catch (error) {
    // Se houver um erro, envie uma resposta de erro
    console.error('Erro ao buscar usuário.', error);
  }
});

// Inicie o servidor na porta especificada
const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = { app, server };*/