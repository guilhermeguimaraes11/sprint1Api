const express = require('express');
const router = express.Router();
const verifyJWT = require('../services/verifyJWT');

// Controllers
const salaController = require("../controllers/salaController");
const userController = require("../controllers/userController");
const scheduleController = require("../controllers/scheduleController");

// Rotas de Usuário
router.post("/user", userController.createUser); // Cadastrar usuário - **não protegida**
router.post("/login", userController.loginUser); // Login de usuário - **não protegida**
router.get("/user", verifyJWT, userController.getAllUsers); // Listar todos usuários - **protegida**
router.put("/user/:id_usuario", verifyJWT, userController.updateUser); // Atualizar usuário - **protegida**
router.delete("/user/:id_usuario", verifyJWT, userController.deleteUser); // Deletar usuário - **protegida**


// Rotas de Sala
router.post("/sala", salaController.createSalas); // Cadastrar sala - ** protegida**
router.get("/salas", salaController.getAllSalasTabela); // Listar todas as salas - ** protegida**
router.put("/sala/:id_sala",  salaController.updateSala); // Atualizar sala - **protegida**
router.delete("/sala/:id_sala",  salaController.deleteSala); // Deletar sala - **protegida**


// Consultas de Disponibilidade de Sala
router.get("/salasdisponivelhorario",  salaController.getSalasDisponiveisHorario); // Verificar disponibilidade por horário - ** protegida**
router.get("/salasdisponiveldata",  salaController.getSalasDisponiveisData); // Verificar disponibilidade por data - ** protegida**
router.get("/salasdisponiveis",  salaController.getSalasDisponiveis); // Ver todas salas disponíveis - **protegida**


// Rotas de Reserva de Sala
router.post("/reservaschedule", scheduleController.createreserva_sala); // Criar reserva - **protegida**
router.get("/reservaschedule", scheduleController.getAllreserva_salas); // Listar todas reservas - **protegida**
router.delete("/reservaschedule/:id_reserva", scheduleController.deletereserva_sala); // Deletar reserva - **protegida**


// Exportando a instância de express configurada
module.exports = router;
