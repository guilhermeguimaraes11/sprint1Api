module.exports = function validateSala({
  nome,
  descricao,
  bloco,
  tipo,
  capacidade
}) {
   // Valida se todos os campos obrigatórios estão preenchidos
   if (!nome || !descricao || !bloco || !tipo || !capacidade) {
    return{ error: "Todos os campos devem ser preenchidos" };
  }
  
  if (isNaN(capacidade) || capacidade > 200) {
    return {
      error: "Capacidade máxima atingida. Deve conter no máximo 200 alunos",
    };
  }

  if (bloco.length > 1) {
    return {
      error: "O bloco é definido por apenas um caractere.",
    };
  }


  return null; // Retorna null se não houver erro
};

