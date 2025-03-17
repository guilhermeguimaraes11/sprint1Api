module.exports = function validateUser({
  cpf,
  email,
  senha,
  nome,
}) {
  if (!cpf || !email || !senha || !nome ) {
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

  if (nome.length < 2) {
    return { error: "O nome deve ter pelo menos 2 caracteres" };
  }

  if (senha.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres" };
  }


  return null; // Retorna null se não houver erro
};

