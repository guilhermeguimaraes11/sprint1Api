const connect = require("../db/connect");
const validateSchudule = require("../services/validateSchedule")

// Verificar se o horário de início de um agendamento está dentro de um intervalo de tempo
function isInTimeRange(horario_inicio, timeRange) {
  const [start, end] = timeRange.split(" - ");
  const startTime = new Date(`1970-01-01T${start}`).getTime();
  const endTime = new Date(`1970-01-01T${end}`).getTime();
  const reserva_salaTime = new Date(`1970-01-01T${horario_inicio}`).getTime();
  return reserva_salaTime >= startTime && reserva_salaTime < endTime;
}

module.exports = class reserva_salaController {
  static async createreserva_sala(req, res) {
    const { data, horario_inicio, horario_fim, fk_id_sala, fk_id_usuario } =
      req.body;
    console.log(req.body);
    // Verificar se todos os campos estão preenchidos
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

    // Verificar se o tempo está dentro do intervalo permitido
    const isWithinTimeRange = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      return totalMinutes >= 7.5 * 60 && totalMinutes <= 23 * 60;
    };

    // Verificar se o tempo de início e término está dentro do intervalo permitido
    if (!isWithinTimeRange(horario_inicio) || !isWithinTimeRange(horario_fim)) {
      return res.status(400).json({
        error:
          "A sala de aula só pode ser reservada dentro do intervalo de 7:30 às 23:00",
      });
    }

    try {
        const overlapQuery = `
        SELECT * FROM reserva_sala
        WHERE 
            fk_id_sala = '${fk_id_sala}'
            AND data = '${data}'
            AND (
                (horario_inicio < '${horario_fim}' AND horario_fim > '${horario_inicio}')
            )
        `;
    

      connect.query(overlapQuery, function (err, results) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Erro ao verificar agendamento existente" });
        }

        // Se a consulta retornar algum resultado, significa que já existe um agendamento
        if (results.length > 0) {
          return res.status(400).json({
            error:
              "Já existe um agendamento para os mesmos dias, sala e horários",
          });
        }

        // Caso contrário, prossegue com a inserção na tabela
        const insertQuery = `
                INSERT INTO reserva_sala (data, fk_id_sala, horario_inicio, horario_fim, fk_id_usuario)
                VALUES (
                    '${data}',
                    '${fk_id_sala}',
                    '${horario_inicio}',
                    '${horario_fim}',
                    '${fk_id_usuario}'
                )
            `;

        // Executa a consulta de inserção
        connect.query(insertQuery, function (err) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Erro ao cadastrar agendamento" });
          }
          console.log("Agendamento cadastrado com sucesso");
          return res
            .status(201)
            .json({ message: "Agendamento cadastrado com sucesso" });
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getreserva_salasByIdfk_id_salaRanges(req, res) {
    const fk_id_salaID = req.params.id;
    const { weekStart, weekEnd } = req.query; // Variavel para armazenar a semana selecionada
    console.log(weekStart+' '+weekEnd)
    // Consulta SQL para obter todos os agendamentos para uma determinada sala de aula
    const query = `
    SELECT reserva_sala.*, usuario.nomecompleto AS userName
    FROM reserva_sala
    JOIN usuario ON reserva_sala.usuario = usuario.id_usuario
    WHERE fk_id_sala = '${fk_id_salaID}'
    AND (data <= '${weekEnd}' AND horario_fim >= '${weekStart}')
`;



    try {
      // Executa a consulta
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Objeto para armazenar os agendamentos organizados por dia da semana e intervalo de horário
        const reserva_salasByDayAndTimeRange = {
          Seg: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Ter: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Qua: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Qui: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Sex: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Sab: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
        };

        // Organiza os agendamentos pelos dias da semana e intervalo de horário
        results.forEach((reserva_sala) => {
          const days = reserva_sala.days.split(", ");
          const timeRanges = [
            "07:30 - 09:30",
            "09:30 - 11:30",
            "12:30 - 15:30",
            "15:30 - 17:30",
            "19:00 - 22:00",
          ];
          days.forEach((day) => {
            timeRanges.forEach((timeRange) => {
              if (isInTimeRange(reserva_sala.horario_inicio, timeRange)) {
                reserva_salasByDayAndTimeRange[day][timeRange].push(reserva_sala);
              }
            });
          });
        });

        // Ordena os agendamentos dentro de cada lista com base no horario_inicio
        Object.keys(reserva_salasByDayAndTimeRange).forEach((day) => {
          Object.keys(reserva_salasByDayAndTimeRange[day]).forEach((timeRange) => {
            reserva_salasByDayAndTimeRange[day][timeRange].sort((a, b) => {
              const horario_inicioA = new Date(`1970-01-01T${a.horario_inicio}`);
              const horario_inicioB = new Date(`1970-01-01T${b.horario_inicio}`);
              return horario_inicioA - horario_inicioB;
            });
          });
        });

        // Retorna os agendamentos organizados por dia da semana e intervalo de horário
        return res.status(200).json({ reserva_salasByDayAndTimeRange });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getreserva_salasByIdfk_id_sala(req, res) {
    const fk_id_salaID = req.params.id;

    // Consulta SQL para obter todos os agendamentos para uma determinada sala de aula
    const query = `
  SELECT reserva_sala.*, usuario.nomecompleto AS userName
  FROM reserva_sala
  JOIN usuario ON reserva_sala.usuario = usuario.id_usuario
  WHERE fk_id_sala = '${fk_id_salaID}'
`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Objeto para armazenar os agendamentos organizados por dia da semana
        const reserva_salasByDay = {
          Seg: [],
          Ter: [],
          Qua: [],
          Qui: [],
          Sex: [],
          Sab: [],
        };

        // Organiza os agendamentos pelos dias da semana
        results.forEach((reserva_sala) => {
          const days = reserva_sala.days.split(", ");
          days.forEach((day) => {
            reserva_salasByDay[day].push(reserva_sala);
          });
        });

        // Ordena os agendamentos dentro de cada lista com base no horario_inicio
        Object.keys(reserva_salasByDay).forEach((day) => {
          reserva_salasByDay[day].sort((a, b) => {
            const horario_inicioA = new Date(`1970-01-01T${a.horario_inicio}`);
            const horario_inicioB = new Date(`1970-01-01T${b.horario_inicio}`);
            return horario_inicioA - horario_inicioB;
          });
        });

        // Retorna os agendamentos organizados por dia da semana e ordenados por horario_inicio
        return res.status(200).json({ reserva_salasByDay });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllreserva_salas(req, res) {
    try {
      // Consulta SQL para obter todos os agendamentos
      const query = `
        SELECT reserva_sala.*, usuario.nomecompleto AS userName
        FROM reserva_sala
        JOIN usuario ON reserva_sala.fk_id_usuario = usuario.id_usuario
        `;
;

      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        // Retorna os agendamentos organizados por dia da semana e ordenados por horario_inicio
        return res.status(200).json({ message: "Consulta das reservas: ", reserva_sala: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deletereserva_sala(req, res) {
    const reserva_salaId = req.params.id_reserva;
    const query = `DELETE FROM reserva_sala WHERE id_reserva = ?`;
    const values = [reserva_salaId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Agendamento não encontrado" });
        }

        return res
          .status(200)
          .json({ message: "Agendamento excluído com ID: " + reserva_salaId });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};