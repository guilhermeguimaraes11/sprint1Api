const connect = require("../db/connect");

module.exports = class controllerSala {
  //Cadastrar Sala
  static async cadastraSala(req, res) {
    const { nomesala, descricao, bloco, categoria, andar } = req.body;

    if (!nomesala || !descricao || !bloco || !categoria || !andar) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    // Construção da query INSERT
    const query = `INSERT INTO sala (nomesala, descricao, bloco, categoria, andar) VALUES (?, ?, ?, ?, ?)`;
    const values = [nomesala, descricao, bloco, categoria, andar];

    try {
      connect.query(query, values, function (err) {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Erro Interno do Servidor" });
        } else {
          return res
            .status(201)
            .json({ message: "Sala cadastrada com sucesso" });
        }
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro Interno do Servidor" });
    }
  }

  static async mostraSalas(req, res) {
    const query = `SELECT * FROM sala`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro Interno do Servidor" });
        }
        return res.status(200).json({
          message: "Listando salas cadastradas:",
          salas: results,
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro Interno do Servidor" });
    }
  }

  static async atualizaSala(req, res) {
    const { id_sala, nomesala, descricao, bloco, categoria, andar } = req.body;

    if (!id_sala || !nomesala || !descricao || !bloco || !categoria || !andar) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `UPDATE sala SET nomesala = ?, descricao = ?, bloco = ?, categoria = ?, andar = ? WHERE id_sala = ?`;
    const values = [nomesala, descricao, bloco, categoria, andar, id_sala];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Erro Interno do Servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Sala não encontrada." });
        }
        return res
          .status(200)
          .json({ message: "Sala atualizada com sucesso." });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro Interno do Servidor" });
    }
  }

  static async removeSala(req, res) {
    const id_sala = req.params.id;
    const query = `DELETE FROM sala WHERE id_sala = ?`;

    try {
      connect.query(query, [id_sala], function (err, results) {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Erro Interno do Servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Sala não encontrada." });
        }
        return res
          .status(200)
          .json({ message: "Sala removida com sucesso." });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro Interno do Servidor" });
    }
  }
};
