module.exports = function validateSala({
  nome,
  descricao,
  bloco,
  tipo,
  capacidade
}) {
   // Valida se todos os campos obrigatórios estão preenchidos
   if (!nome || !descricao || !bloco || !tipo || !capacidade) {
    return res
      .status(400)
      .json({ error: "Todos os campos devem ser preenchidos" });
  }
  
  if (isNaN(capacidade) || capacidade.length !== 40) {
    return {
      error: "Capacidade máxima atingida. Deve conter no máximo 40 alunos",
    };
  }


  return null; // Retorna null se não houver erro
};

