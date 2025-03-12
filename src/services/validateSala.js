module.exports = function validateSala({
  nome,
  descricao,
  bloco,
  tipo,
  capacidade
}) {
  if (!nome || !descricao || !bloco || !tipo || !capacidade ) {
    return { error: "Todos os campos devem ser preenchidos" };
  }

  if (isNaN(capacidade) || capacidade.length !== 40) {
    return {
      error: "Capacidade máxima atingida. Deve conter no máximo 40 alunos",
    };
  }


  return null; // Retorna null se não houver erro
};

