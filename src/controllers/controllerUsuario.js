const connect = require("../db/connect");
module.exports = class controllerUsuario {
  static async cadastraUsua(req, res) {
    const { nomecompleto, email, emailc, senha, senhac } = req.body;

    if (!nomecompleto || !email || !emailc || !senha || !senhac) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    if (email !== emailc) {
      return res
        .status(400)
        .json({ error: "Digite o mesmo email nos dois campos de email!" });
    }

    if (senha !== senhac) {
      return res
        .status(400)
        .json({ error: "Digite a mesma senha nos dois campos de senha!" });
    }

    if (!email.includes("@")) {
      return res
        .status(400)
        .json({ error: "O email deve ter '@' no final." });
    }

    // Construção da query INSERT
    const query = `INSERT INTO usuario(nomecompleto, email, senha) VALUES ('${nomecompleto}', '${email}', '${senha}');`;

    // Executando a query INSERT
    try {
      connect.query(query, function (err) {
        if (err) {
          console.error(err);
          console.error(err.code);
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "O email já está vinculado a outro usuário" });
          } else {
            return res
              .status(500)
              .json({ error: "Erro Interno Do Servidor" });
          }
        } else {
          return res
            .status(201)
            .json({ message: "Usuário criado com sucesso" });
        }
      });
    } catch (error) {
      console.error(error);
      return res
      .status(500)
      .json({ error: "Erro interno do servidor" });
    }
  }

  static async loginUsua(req, res) {
    const { email, senha } = req.body;

    const query = `SELECT * FROM usuario WHERE email = ? AND senha = ?`;
    const values = [email, senha];

    try{
      connect.query(query, values, function (err, results){
        if(err){
          console.error(err);
          console.error(err.code);
          return res
              .status(500)
              .json({ error: "Erro Interno Do Servidor" });
        }
        console.log(results);
        if(results.length < 1){
          return res.status(404).json({error:"Usuário Não Encontrado"});
        }
        return res.status(200).json({message:"Login Efetuado com Sucesso!"});
      });
    }catch(error){
      console.error(error);
      return res
      .status(500)
      .json({ error: "Erro interno do servidor" });
    }
  }

  static async mostraUsua(req, res) {
    const query = `SELECT * FROM usuario`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro Interno do Servidor" });
        }
        return res
          .status(200)
          .json({
            message: "Mostrando usuários: ",
            users: results,
          });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Um erro foi encontrado." });
    }
  }

  static async atualizaUsua(req, res) {
    const { id, nomecompleto, email, senha } = req.body;

    if (!id || !nomecompleto || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE usuario SET nomecompleto=?, email=?, senha=? WHERE id_usuario = ?`;
    const values = [nomecompleto, email, senha, id];
    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "E-mail já cadastrado por outro usuário." });
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro Interno do Servidor" });
          }
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado." });
        }
        return res
          .status(200)
          .json({ message: "Usuário atualizado com sucesso." });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro Interno de Servidor" });
    }
  }

  static async removeUsua(req, res){
    //Obtem o parametro Id da requisição, que é o cpf do user a ser deletado
    const userId = req.params.id;
    const query = `DELETE FROM usuario WHERE id_usuario = ?`;
    const values = [userId];
    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro Interno do Servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado." });
        }
        return res
          .status(200)
          .json({ message: "Usuário excluído com sucesso." });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro Interno de Servidor" });
    }
  }
};
