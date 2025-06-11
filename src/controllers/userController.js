const connect = require("../db/connect");
const validateUser = require("../services/validateUser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, senha, nomecompleto } = req.body;

    const validationError = validateUser(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

    try {
      const query = `INSERT INTO usuario (cpf, email, senha, nomecompleto) VALUES (?, ?, ?, ?)`;
      connect.query(query, [cpf, email, hashedPassword, nomecompleto], (err) => {
        if (err) {
          console.error(err);
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
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;

    try {
      if (!req.userId) {
        return res.status(403).json({ error: "Acesso não autorizado" });
      }

      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        return res.status(200).json({ message: "Obtendo todos os usuários", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  static async updateUser(req, res) {
    const { cpf, email, nomecompleto } = req.body;
    const { id_usuario } = req.params;

    if (id_usuario != req.userId) {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }

    const validationError = validateUser(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    try {
      const query =
        "UPDATE usuario SET cpf = ?, email = ?, nomecompleto = ? WHERE id_usuario = ?";
      connect.query(
        query,
        [cpf, email, nomecompleto, id_usuario],
        (err, results) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              if (err.message.includes("email")) {
                return res.status(400).json({ error: "Email já cadastrado" });
              }
            } else {
              return res.status(500).json({ error: "Erro interno do servidor", err });
            }
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
          }
          return res.status(200).json({ message: "Usuário atualizado com sucesso" });
        }
      );
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async deleteUser(req, res) {
    const userId = req.params.id_usuario;

    if (userId != req.userId) {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }

    const query = `DELETE FROM usuario WHERE id_usuario = ?`;
    const values = [userId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_ROW_IS_REFERENCED_2") {
            console.error("Erro de chave estrangeira:", err);
            return res.status(400).json({
              error: "Não é possível excluir este usuário, pois ele possui uma reserva.",
            });
          }

          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json({
          message: "Usuário excluído com ID: " + userId,
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

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

        // Comparar a senha enviada na requisiçao com a hash do banco 
        const passwordOK = bcrypt.compareSync(senha,user.senha);

        if (!passwordOK) {
          return res.status(401).json({ error: "Senha incorreta" });
        }

        const token = jwt.sign({ id: user.id_usuario }, process.env.SECRET, {
          expiresIn: "1h",
        });

        delete user.senha;

        return res.status(200).json({
          message: "Login bem-sucedido",
          user,
          token,
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async listUserReservations(req, res) {
    const userId = req.params.id_usuario;

    if (userId != req.userId) {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }

    const query = `CALL listar_reservas_por_usuario(?)`;

    try {
      connect.query(query, [userId], (err, results) => {
        if (err) {
          console.error("Erro ao executar a procedure:", err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        const reservations = results[0];

        if (reservations.length === 0) {
          return res.status(404).json({ message: "Nenhuma reserva encontrada para este usuário." });
        }

        return res.status(200).json({
          message: `Reservas para o usuário ID: ${userId}`,
          reservations: reservations,
        });
      });
    } catch (error) {
      console.error("Erro ao listar as reservas do usuário:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
