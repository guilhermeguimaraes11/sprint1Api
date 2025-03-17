const connect = require("../db/connect");
const validateUser  = require("../services/validateUser");

module.exports = class userController {
  static async createUser (req, res) {
    const { cpf, email, senha, nome } = req.body;

    const validationError = validateUser (req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    try {
      const query = `INSERT INTO usuario (cpf, email, senha, nome) VALUES (?, ?, ?, ?)`;
      connect.query(query, [cpf, email, senha, nome], (err) => {
        if (err) {
          console.error(err); // Log do erro para depuração
          if (err.code === "ER_DUP_ENTRY") {
            if (err.message.includes("email")) {
              return res.status(400).json({ error: "Email já cadastrado" });
            }
            if (err.message.includes("cpf")) {
              return res.status(400).json({ error: "CPF já cadastrado" });
            }
          } else {
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        return res.status(201).json({ message: "Usuário criado com sucesso" });
      });
    } catch (error) {
      console.error(error); // Log do erro para depuração
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        return res
          .status(200)
          .json({ message: "Obtendo todos os usuários", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  static async updateUser(req, res) {
    const { cpf, email, senha, name, id } = req.body;

    const validationError = validateUser(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    try {
      const query =
        "UPDATE usuario SET cpf = ?, email = ?, senha = ?, name = ? WHERE id_usuario = ?";
      connect.query(
        query,
        [cpf, email, senha, name, id],
        (err, results) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              if (err.message.includes("email")) {
                return res.status(400).json({ error: "Email já cadastrado" });
              }
            } else {
              return res
                .status(500)
                .json({ error: "Erro interno do servidor", err });
            }
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
          }
          return res
            .status(200)
            .json({ message: "Usuário atualizado com sucesso" });
        }
      );
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
  static async deleteUser(req, res) {
    const userId = req.params.id;
    const query = `DELETE FROM usuario WHERE id_usuario = ?`;
    const values = [userId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res
          .status(200)
          .json({ message: "Usuário excluído com ID: " + userId });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Método de Login - Implementar
  static async loginUser(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const query = `SELECT * FROM usuario WHERE email = ?`;

    try {
      connect.query(query, [email], (err, results) => {
        if (err) {
          console.error("Erro ao executar a consulta:", err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Usuário não encontrado" });
        }

        const user = results[0];

        if (user.senha !== senha) {
          return res.status(401).json({ error: "Senha incorreta" });
        }

        return res.status(200).json({ message: "Login bem-sucedido", user });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
