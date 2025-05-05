module.exports = function validateSchedule({
  data,
  horario_inicio,
  horario_fim,
  fk_id_sala,
  fk_id_usuario
}) {
  // Verificar se todos os campos estão preenchidos
  if (!data || !horario_inicio || !horario_fim || !fk_id_sala || !fk_id_usuario) {
    return { error: "Todos os campos devem ser preenchidos" };
  }

  const isWithinTimeRange = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes >= 7.5 * 60 && totalMinutes <= 23 * 60;
  };

  // Verificar se o tempo de início e término está dentro do intervalo permitido
  if (!isWithinTimeRange(horario_inicio) || !isWithinTimeRange(horario_fim)) {
    return { error: "A sala de aula só pode ser reservada dentro do intervalo de 7:30 às 23:00" };
  }

  // Validar se horário de início é menor que o horário de fim
  const horaInicio = new Date(`1970-01-01T${horario_inicio}:00`);
  const horaFim = new Date(`1970-01-01T${horario_fim}:00`);

  if (horaInicio >= horaFim) {
    return { error: "O horário de início deve ser menor que o horário de fim" };
  }

  // Se tudo estiver correto, retorna null (sem erro)
  return null;
};