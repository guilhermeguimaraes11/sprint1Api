const connect = require("../db/connect");
module.exports = class controllerReserva {
  //Cadastrar Reserva
  static async cadastraReserva(req, res) {
    const { data, horario_inicio, horario_fim, fk_id_sala, fk_id_usuario } =
      req.body;
    if (
      !data ||
      !horario_inicio ||
      !horario_fim ||
      !fk_id_sala ||
      !fk_id_usuario
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    if (horario_inicio >= horario_fim) {
      return res.status(400).json({
        error: "O horário de início deve ser menor que o horário de fim.",
      });
    }
    // Validação para verificar conflitos de horário
    const queryHorario = `SELECT horario_inicio, horario_fim FROM reserva_sala WHERE fk_id_sala = ? and not ((? < horario_inicio and ? <= horario_inicio) or (? >= horario_fim and ? > horario_fim))`;
    const horarioValues = [
      fk_id_sala,
      horario_inicio,
      horario_fim,
      horario_inicio,
      horario_fim,
    ];

    try {
      connect.query(queryHorario, horarioValues, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro Interno do Servidor" });
        }
        if (results.length > 0) {
          return res
            .status(400)
            .json({ error: "Já existe uma reserva para este horário." });
        }

        // Caso não haja conflito, insere a reserva
        const query = `INSERT INTO reserva_sala (data, horario_inicio, horario_fim, fk_id_sala, fk_id_usuario) VALUES (?, ?, ?, ?, ?)`;
        const values = [
          data,
          horario_inicio,
          horario_fim,
          fk_id_sala,
          fk_id_usuario,
        ];

        connect.query(query, values, function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro Interno do Servidor" });
          }
          return res
            .status(201)
            .json({ message: "Reserva criada com sucesso." });
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro Interno do Servidor" });
    }
  }
  //Mostrar reservas
  static async mostraReserva(req, res) {
    const query = `SELECT * from reserva_sala`;
    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro Interno do Servidor" });
        }
        return res.status(200).json({
          messagem: "Reservas listadas com sucesso!!",
          events: results,
        });
      });
    } catch (error) {
      console.log("Erro ao consultar a query: ", error);
      return res.status(500).json({ arror: "Erro interno do servidor :(" });
    }
  }
  static async atualizaReserva(req, res) {
    const { id_reserva, data, horario_inicio, horario_fim, fk_id_sala, fk_id_usuario } =
      req.body;

    if (
      !id_reserva ||
      !data ||
      !horario_inicio ||
      !horario_fim ||
      !fk_id_sala ||
      !fk_id_usuario
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos." });
    }

    if (horario_inicio >= horario_fim) {
      return res
        .status(400)
        .json({
          error: "O horário de início deve ser menor que o horário de fim.",
        });
    }

    // Validação para verificar conflitos de horário ao atualizar
    const queryHorario = `SELECT horario_inicio, horario_fim FROM reserva_sala WHERE fk_id_sala = ? and not ((? < horario_inicio and ? <= horario_inicio) or (? >= horario_fim and ? > horario_fim))`
    const horarioValues = [
        fk_id_sala,
        horario_inicio,
        horario_fim,
        horario_inicio,
        horario_fim
    ];

    try {
      connect.query(queryHorario, horarioValues, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro Interno do Servidor" });
        }
        if (results.length > 0) {
          return res
            .status(400)
            .json({ error: "Já existe uma reserva para este horário." });
        }

        // Caso não haja conflito, atualiza a reserva
        const query = `UPDATE reserva_sala SET data = ?, horario_inicio = ?, horario_fim = ?, fk_id_sala = ?, fk_id_usuario = ? WHERE id_reserva = ?`;
        const values = [
          data,
          horario_inicio,
          horario_fim,
          fk_id_sala,
          fk_id_usuario,
          id_reserva,
        ];

        connect.query(query, values, function (err, results) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro Interno do Servidor" });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Reserva não encontrada." });
          }
          return res
            .status(200)
            .json({ message: "Reserva atualizada com sucesso." });
        });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro Interno do Servidor" });
    }
  }
  static async deleteReserva(req, res) {
    const idReserva = req.params.id;
    const query = `delete from reserva_sala where id_reserva=?`;

    try {
      connect.query(query, idReserva, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro Interno do Servidor:" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Reserva não encontrada" });
        }
        return res.status(200).json({ message:"Reserva excluída com sucesso" });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
