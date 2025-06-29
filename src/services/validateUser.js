module.exports = function validateUser({
  cpf,
  email,
  senha,
  nomecompleto,
}) {
  if (!cpf || !email || !nomecompleto ) {
    return { error: "Todos os campos devem ser preenchidos" };
  }

  if (isNaN(cpf) || cpf.length !== 11) {
    return {
      error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
    };
  }

  if (!email.includes("@")) {
    return { error: "Email inválido. Deve conter @" };
  }

  if (nomecompleto.length < 2) {
    return { error: "O nome deve ter pelo menos 2 caracteres" };
  }


  return null; // Retorna null se não houver erro
};

