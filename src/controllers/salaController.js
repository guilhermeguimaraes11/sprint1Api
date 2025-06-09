
const connect = require("../db/connect");
const validateSala = require("../services/validateSala");

module.exports = class salaController {
  static async createSalas(req, res) {
    const { nome, descricao, bloco, tipo, capacidade } = req.body;

    const validationError = validateSala(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const query = `INSERT INTO sala (nome, descricao, bloco, tipo, capacidade) VALUES (?, ?, ?, ?, ?)`;
    const values = [nome, descricao, bloco, tipo, capacidade];

    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.error(err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "O nome da sala já existe" });
          }
          return res.status(500).json({ error: "Erro Interno do Servidor" });
        }
        return res.status(201).json({ message: "Sala Criada com Sucesso!" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro Interno do Servidor" });
    }
  }

  static async getAllSalasTabela(req, res) {
    const query = `SELECT * FROM sala`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro Interno do Servidor" });
        }
        return res
          .status(200)
          .json({ message: "Obtendo todas as salas", salas: results });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro Interno do Servidor" });
    }
  }

  static async getSalasDisponiveisData(req, res) {
    const data_inicio = req.params.data_inicio; // Pegando as datas de início e fim do corpo da requisição
    const data_fim = req.params.data_fim;
    console.log(data_inicio, data_fim);

    if (!data_inicio || !data_fim) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    if (isNaN(Date.parse(data_inicio)) || isNaN(Date.parse(data_fim))) {
      return res
        .status(400)
        .json({ error: "Formato de data inválido. Use YYYY-MM-DD" });
    }

    const querySalasDisponiveis = `SELECT s.id_sala, s.nome, s.descricao, s.bloco, s.tipo, s.capacidade FROM sala s`;
    const queryConflitoReserva = `
      SELECT 1 FROM reserva_sala
      WHERE fk_id_sala = ?
        AND (
          (STR_TO_DATE(CONCAT(data, ' ', horario_inicio), '%Y-%m-%d %H:%i:%s') < ? AND STR_TO_DATE(CONCAT(data, ' ', horario_fim), '%Y-%m-%d %H:%i:%s') > ?)
          OR
          (STR_TO_DATE(CONCAT(data, ' ', horario_inicio), '%Y-%m-%d %H:%i:%s') < ? AND STR_TO_DATE(CONCAT(data, ' ', horario_fim), '%Y-%m-%d %H:%i:%s') > ?)
          OR
          (STR_TO_DATE(CONCAT(data, ' ', horario_inicio), '%Y-%m-%d %H:%i:%s') >= ? AND STR_TO_DATE(CONCAT(data, ' ', horario_inicio), '%Y-%m-%d %H:%i:%s') < ?)
          OR
          (STR_TO_DATE(CONCAT(data, ' ', horario_fim), '%Y-%m-%d %H:%i:%s') > ? AND STR_TO_DATE(CONCAT(data, ' ', horario_fim), '%Y-%m-%d %H:%i:%s') <= ?)
        )
    `;

    try {
      const salasDisponiveis = await new Promise((resolve, reject) => {
        connect.query(querySalasDisponiveis, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      const salasDisponiveisFinal = [];

      for (const sala of salasDisponiveis) {
        const conflito = await new Promise((resolve, reject) => {
          connect.query(
            queryConflitoReserva,
            [
              sala.id_sala,
              data_inicio,
              data_inicio,
              data_fim,
              data_fim,
              data_inicio,
              data_fim,
              data_inicio,
              data_fim,
            ],
            (err, rows) => {
              if (err) return reject(err);
              resolve(rows.length > 0);
            }
          );
        });

        if (!conflito) salasDisponiveisFinal.push(sala);
      }

      if (salasDisponiveisFinal.length === 0) {
        return res.status(404).json({
          message: "Não há salas disponíveis para o período solicitado",
        });
      }
      console.log(salasDisponiveisFinal);
      return res
        .status(200)
        .json({ message: "Lista de salas na data selecionada", salasDisponiveisFinal });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao obter as salas disponíveis" });
    }
  }

  static async getSalaDetails(req, res) {
    const salaId = req.params.id_sala;

    const querySala = `SELECT * FROM sala WHERE id_sala = ?`;
    const queryTotalReservas = `SELECT total_reservas_por_sala(?) AS total_reservas`;

    try {
      // Obter detalhes da sala
      const salaResult = await new Promise((resolve, reject) => {
        connect.query(querySala, [salaId], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });

      if (salaResult.length === 0) {
        return res.status(404).json({ error: "Sala não encontrada" });
      }

      const sala = salaResult[0];

      // Obter o total de reservas para esta sala usando a função MySQL
      const totalReservasResult = await new Promise((resolve, reject) => {
        connect.query(queryTotalReservas, [salaId], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });

      const totalReservas = totalReservasResult[0].total_reservas;

      // Combinar os resultados e enviar
      return res.status(200).json({
        message: "Detalhes da sala obtidos com sucesso",
        sala: {
          ...sala,
          total_reservas: totalReservas,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateSala(req, res) {
    const { nome, descricao, bloco, tipo, capacidade } = req.body;
    const salaId = req.params.id_sala;

    if (!nome || !descricao || !bloco || !tipo || !capacidade) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `UPDATE sala SET nome = ?, descricao = ?, bloco = ?, tipo = ?, capacidade = ? WHERE id_sala = ?`;
    const values = [nome, descricao, bloco, tipo, capacidade, salaId];

    try {
      connect.query(query, values, (err, results) => {
        if (err) {
          console.error(err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "O nome da sala já existe" });
          }
          return res.status(500).json({ error: "Erro interno no servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }
        return res.status(200).json({ message: "Sala atualizada com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteSala(req, res) {
    const salaId = req.params.id_sala;
    const query = `DELETE FROM sala WHERE id_sala = ?`;

    try {
      connect.query(query, [salaId], (err, results) => {
        if (err) {
          if (err.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(400).json({
              error:
                "A sala está vinculada a uma reserva, e não pode ser excluida",
            });
          }
          console.error(err);
          return res.status(500).json({ error: "Erro interno no servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Sala não encontrada" });
        }
        return res.status(200).json({ message: "Sala excluída com sucesso" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};