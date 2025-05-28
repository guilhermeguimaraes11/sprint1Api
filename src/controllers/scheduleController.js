const connect = require("../db/connect");
const validateSchedule = require("../services/validateSchedule");

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
    const { data, horario_inicio, horario_fim, fk_id_sala, fk_id_usuario } = req.body;
  
    try {
      const now = new Date();
      const [year, month, day] = data.split("-").map(Number);
      const [startHour, startMinute] = horario_inicio.split(":").map(Number);
      const dataHoraAgendamento = new Date(year, month - 1, day, startHour, startMinute);
  
      if (dataHoraAgendamento < now) {
        return res.status(400).json({
          error: "Não é possível reservar para um horário que já passou.",
        });
      }
  
      // Verificação de conflito
      const overlapQuery = `
        SELECT 1 FROM reserva_sala
        WHERE fk_id_sala = ?
          AND data = ?
          AND (
            (horario_inicio < ? AND horario_fim > ?)  -- sobreposição
          )
        LIMIT 1
      `;
  
      connect.query(
        overlapQuery,
        [fk_id_sala, data, horario_fim, horario_inicio],
        function (err, results) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Erro ao verificar agendamento existente" });
          }
  
          if (results.length > 0) {
            return res
              .status(409)
              .json({ error: "Já existe uma reserva nesse horário para esta sala." });
          }
  
          // Inserção da reserva
          const insertQuery = `
            INSERT INTO reserva_sala (data, fk_id_sala, horario_inicio, horario_fim, fk_id_usuario)
            VALUES (?, ?, ?, ?, ?)
          `;
  
          connect.query(
            insertQuery,
            [data, fk_id_sala, horario_inicio, horario_fim, fk_id_usuario],
            function (err) {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ error: "Erro ao cadastrar agendamento" });
              }
              return res
                .status(201)
                .json({ message: "Agendamento cadastrado com sucesso" });
            }
          );
        }
      );
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  

  static async getreserva_salasByIdfk_id_salaRanges(req, res) {
    const fk_id_salaID = req.params.id;
    const { weekStart, weekEnd } = req.query; // Variavel para armazenar a semana selecionada
    console.log(weekStart + " " + weekEnd);
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
                reserva_salasByDayAndTimeRange[day][timeRange].push(
                  reserva_sala
                );
              }
            });
          });
        });

        // Ordena os agendamentos dentro de cada lista com base no horario_inicio
        Object.keys(reserva_salasByDayAndTimeRange).forEach((day) => {
          Object.keys(reserva_salasByDayAndTimeRange[day]).forEach(
            (timeRange) => {
              reserva_salasByDayAndTimeRange[day][timeRange].sort((a, b) => {
                const horario_inicioA = new Date(
                  `1970-01-01T${a.horario_inicio}`
                );
                const horario_inicioB = new Date(
                  `1970-01-01T${b.horario_inicio}`
                );
                return horario_inicioA - horario_inicioB;
              });
            }
          );
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
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        // Retorna os agendamentos organizados por dia da semana e ordenados por horario_inicio
        return res
          .status(200)
          .json({ message: "Consulta das reservas: ", reserva_sala: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAvailability(req, res) {
    const { fk_id_sala, data_inicio, data_fim } = req.body;

    if (!fk_id_sala || !data_inicio || !data_fim) {
      return res.status(400).json({
        error: "Campos 'fk_id_sala', 'data_inicio' e 'data_fim' são obrigatórios.",
      });
    }

    const intervalosPadrao = [
      "07:30 - 09:30",
      "09:30 - 11:30",
      "12:30 - 15:30",
      "15:30 - 17:30",
      "19:00 - 22:00",
    ];

    try {
      const query = `
        SELECT data, horario_inicio, horario_fim 
        FROM reserva_sala 
        WHERE fk_id_sala = ? AND data BETWEEN ? AND ?
      `;

      connect.query(query, [fk_id_sala, data_inicio, data_fim], (err, reservas) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar reservas." });
        }

        // Agrupa reservas por data
        const reservasPorData = {};
        reservas.forEach((res) => {
          const dataFormatada = res.data.toISOString().split("T")[0];
          if (!reservasPorData[dataFormatada]) reservasPorData[dataFormatada] = [];
          reservasPorData[dataFormatada].push({
            inicio: res.horario_inicio,
            fim: res.horario_fim,
          });
        });

        // Gera as datas entre o intervalo
        const dias = [];
        let atual = new Date(data_inicio);
        const fim = new Date(data_fim);
        while (atual <= fim) {
          dias.push(atual.toISOString().split("T")[0]);
          atual.setDate(atual.getDate() + 1);
        }

        // Monta a disponibilidade
        const disponibilidade = dias.map((data) => {
          const reservasDoDia = reservasPorData[data] || [];

          const disponiveis = intervalosPadrao.filter((intervalo) => {
            const [start, end] = intervalo.split(" - ");
            const [startH, startM] = start.split(":").map(Number);
            const [endH, endM] = end.split(":").map(Number);
            const intervaloInicio = startH * 60 + startM;
            const intervaloFim = endH * 60 + endM;

            return !reservasDoDia.some((res) => {
              const [resStartH, resStartM] = res.inicio.split(":").map(Number);
              const [resEndH, resEndM] = res.fim.split(":").map(Number);
              const resInicio = resStartH * 60 + resStartM;
              const resFim = resEndH * 60 + resEndM;

              // Conflito se a reserva existente começa antes do fim do novo
              // e termina depois do início do novo
              return resInicio < intervaloFim && resFim > intervaloInicio;
            });
          });

          return {
            data,
            horarios_disponiveis: disponiveis,
          };
        });

        return res.status(200).json({ disponibilidade });
      });
    } catch (error) {
      console.error("Erro geral:", error);
      return res.status(500).json({ error: "Erro interno ao verificar disponibilidade." });
    }
  }

  static async updatereserva_sala(req, res) {
    const idReserva = req.params.id_reserva;
    const { data, horario_inicio, horario_fim, fk_id_sala, fk_id_usuario } = req.body;
  
    try {
      // Converte a string data para o formato YYYY-MM-DD esperado pelo MySQL
      const date = new Date(data);
      const ano = date.getFullYear();
      const mes = (date.getMonth() + 1).toString().padStart(2, "0");
      const dia = date.getDate().toString().padStart(2, "0");
      const dataFormatada = `${ano}-${mes}-${dia}`;
  
      // Cria Date para comparar data e horário local
      const now = new Date();
      const [startHour, startMinute] = horario_inicio.split(":").map(Number);
      const dataHoraAgendamento = new Date(ano, date.getMonth(), dia, startHour, startMinute);
  
      if (dataHoraAgendamento < now) {
        return res.status(400).json({
          error: "Não é possível atualizar para um horário que já passou.",
        });
      }
  
      const overlapQuery = `
        SELECT 1 FROM reserva_sala
        WHERE fk_id_sala = ?
          AND data = ?
          AND id_reserva != ?
          AND (
            (horario_inicio < ? AND horario_fim > ?)
          )
        LIMIT 1
      `;
  
      connect.query(
        overlapQuery,
        [fk_id_sala, dataFormatada, idReserva, horario_fim, horario_inicio],
        function (err, results) {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao verificar conflitos." });
          }
  
          if (results.length > 0) {
            return res.status(409).json({ error: "Já existe uma reserva nesse horário para esta sala." });
          }
  
          const updateQuery = `
            UPDATE reserva_sala
            SET data = ?, horario_inicio = ?, horario_fim = ?, fk_id_sala = ?, fk_id_usuario = ?
            WHERE id_reserva = ?
          `;
  
          connect.query(
            updateQuery,
            [dataFormatada, horario_inicio, horario_fim, fk_id_sala, fk_id_usuario, idReserva],
            function (err, result) {
              if (err) {
                console.log(err);
                return res.status(500).json({ error: "Erro ao atualizar reserva." });
              }
  
              if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Reserva não encontrada." });
              }
  
              return res.status(200).json({ message: "Reserva atualizada com sucesso." });
            }
          );
        }
      );
    } catch (error) {
      console.error("Erro ao atualizar reserva:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  
  static async getReservas_id(req, res) {
    const id = req.params.id;
    const query = `SELECT * FROM schedule WHERE user = ${id};`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res.status(200).json({
          message: "Agendamentos obtidos com sucesso para o usuário: " + id,
          results,
        });
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
        return res.status(200).json({ message: "Reserva cancelada com sucesso!" });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
