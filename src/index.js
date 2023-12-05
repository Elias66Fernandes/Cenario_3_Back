//importações necessárias para o projeto
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

//rota que listar todos os usuários cadastrados
app.get("/users", async (req, res) => {
  try{
    const users = await prisma.user.findMany();

    if (users.length > 0){
      return res.status(200).send(users);
    }else{
      return res.status(404).send("Nenhum usuário foi encontrado");}
  }catch(error){
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).send("Erro Interno do Servidor");
  }
});

//rota que cadastra um usuário
app.post("/user", async (req, res) => {
  try{
    const dados = req.body;
    await prisma.user.create({
      data: {
        name: dados.name,
        email: dados.email,
      },
    });
    return res.sendStatus(201);
  }catch(error){
    console.error("Erro ao cadastrar usuários:", error);
    return res.status(500).send("Erro Interno do Servidor");
  }
});

//rota que apaga um usuário, passando o id
app.delete("/user/:id", async (req, res) => {
  try{
    const { id } = req.params;
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    return res.sendStatus(200);
  }catch{
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).send("Erro Interno do Servidor");
  }

});

//rota que atualiza um usuário, pelo id
app.put("/user/:id", async (req, res) => {
  try{
    const { id } = req.params;
    const dados = req.body;
    await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name: dados.name,
      email: dados.email,
    },
  });
  return res.sendStatus(200);
  }catch{
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).send("Erro Interno do Servidor");
  }
});

//rota que lista usuários que contenham o nome específico
app.get("/users/:name", async (req, res) => {
  try{
    const name = req.params.name;
    const user = await prisma.user.findMany({
      where: {
        name: name,
      },
    });
    if (user.length > 0){
      return res.status(200).send(user);
    }else{
      return res.status(404).send("Usuário não encontrado");
    }
  }catch{
    console.error("Erro ao listar usuários que contenham o nomes específicos:", error);
    return res.status(500).send("Erro Interno do Servidor");
  }

});

//rota que lista um usuário pelo id
app.get("/user/:id", async (req, res) => {
  
  try{
    const { id } = req.params;
    const user = await prisma.user.findMany({
      where: {
        id: Number(id),
      },
    });
    if (user.length > 0){
      return res.status(200).send(user);
    }else{
      return res.status(404).send("Usuário não encontrado");
    }
  }catch{
    console.error("Erro ao listar um usuário pelo id:", error);
    return res.status(500).send("Erro Interno do Servidor");
  }
});

// Inicie o servidor na porta especificada
const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = { app, server };

// Versão final