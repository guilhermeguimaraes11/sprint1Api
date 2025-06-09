const express = require('express');
const router = express.Router();
const verifyJWT = require('../services/verifyJWT');

// Controllers
const salaController = require("../controllers/salaController");
const userController = require("../controllers/userController");
const scheduleController = require("../controllers/scheduleController"); // Certifique-se de que este é o nome correto do seu controller de reservas

// Rotas de Usuário
router.post("/user", userController.createUser); // Cadastrar usuário - **não protegida**
router.post("/login", userController.loginUser); // Login de usuário - **não protegida**
router.get("/user", verifyJWT, userController.getAllUsers); // Listar todos usuários - **protegida**
router.put("/user/:id_usuario", verifyJWT, userController.updateUser); // Atualizar usuário - **protegida**
router.delete("/user/:id_usuario", verifyJWT, userController.deleteUser); // Deletar usuário - **protegida**


// Rotas de Sala
router.post("/sala", salaController.createSalas); // Cadastrar sala
router.get("/salas", salaController.getAllSalasTabela); // Listar todas as salas

// NOVO: Rota para obter detalhes de uma sala específica, incluindo o total de reservas
router.get("/sala/:id_sala", salaController.getSalaDetails); 

router.put("/sala/:id_sala", salaController.updateSala); // Atualizar sala
router.delete("/sala/:id_sala", salaController.deleteSala); // Deletar sala


// Consultas de Disponibilidade de Sala
router.get("/salasdisponiveldata/:data_inicio/:data_fim", salaController.getSalasDisponiveisData);


// Rotas de Reserva de Sala
router.post("/reservaschedule", verifyJWT, scheduleController.createreserva_sala); // Criar reserva - **protegida**
router.put("/reservaschedule/:id_reserva", verifyJWT, scheduleController.updatereserva_sala);
router.get("/reservaschedule", verifyJWT,scheduleController.getAllreserva_salas); // Listar todas reservas - **protegida**
router.delete("/reservaschedule/:id_reserva", verifyJWT, scheduleController.deletereserva_sala); // Deletar reserva - **protegida**


// Exportando a instância de express configurada
module.exports = router;