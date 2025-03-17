module.exports = function validateReserva({
  fk_id_usuario,
  fk_id_sala,
  datahora_inicio,
  datahora_fim
}) {
  // Verifica se todos os campos obrigatórios estão preenchidos
  if (!fk_id_usuario || !fk_id_sala || !datahora_inicio || !datahora_fim) {
    return { error: "Todos os campos devem ser preenchidos" };
  }

  // Verifica se os IDs são números
  if (isNaN(fk_id_usuario) || isNaN(fk_id_sala)) {
    return { error: "IDs de usuário e sala devem ser numéricos" };
  }

  // Verifica se as datas estão em um formato válido
  const inicio = new Date(datahora_inicio);
  const fim = new Date(datahora_fim);

  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    return { error: "Data e hora devem estar em um formato válido" };
  }

  // Verifica se a data de início é anterior à data de fim
  if (inicio >= fim) {
    return { error: "A data/hora de início deve ser anterior à data/hora de fim" };
  }

  // Verifica se a reserva está dentro do horário permitido (7:00 - 21:00)
  const horaInicio = inicio.getHours();
  const horaFim = fim.getHours();
  if (horaInicio < 7 || horaInicio >= 21 || horaFim < 7 || horaFim >= 21) {
    return {
      error: "A reserva deve ser feita no horário de funcionamento do SENAI. Entre 7:00 e 21:00"
    };
  }

  // Verifica se a duração da reserva é exatamente 50 minutos
  const tempoReserva = fim - inicio;
  const limite = 50 * 60 * 1000; // 50 minutos em milissegundos
  if (tempoReserva !== limite) {
    return { error: "A reserva deve ter exatamente 50 minutos" };
  }

  return null; // Retorna null se não houver erro
};