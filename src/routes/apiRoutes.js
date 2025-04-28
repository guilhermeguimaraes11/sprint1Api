const router = require("express").Router();

// Controllers
const salaController = require("../controllers/salaController");
const userController = require("../controllers/userController");
const scheduleController = require("../controllers/scheduleController");

// Rotas de Usuário
router.post("/user", userController.createUser); // Cadastrar usuário
router.post("/login", userController.loginUser); // Login de usuário
router.get("/user", userController.getAllUsers); // Listar todos usuários
router.put("/user/:id_usuario", userController.updateUser); // Atualizar usuário
router.delete("/user/:id_usuario", userController.deleteUser); // Deletar usuário

// Rotas de Sala
router.post("/sala", salaController.createSalas); // Cadastrar sala
router.get("/salas", salaController.getAllSalasTabela); // Listar todas as salas
router.put("/sala/:id_sala", salaController.updateSala); // Atualizar sala
router.delete("/sala/:id_sala", salaController.deleteSala); // Deletar sala

// Consultas de Disponibilidade de Sala
router.get("/salasdisponivelhorario", salaController.getSalasDisponiveisHorario); // Verificar disponibilidade por horário
router.get("/salasdisponiveldata", salaController.getSalasDisponiveisData); // Verificar disponibilidade por data
router.get("/salasdisponiveis", salaController.getSalasDisponiveis); // Ver todas salas disponíveis

// Rotas de Reserva de Sala
router.post("/reservaschedule", scheduleController.createreserva_sala); // Criar reserva
router.get("/reservaschedule", scheduleController.getAllreserva_salas); // Listar todas reservas
router.delete("/reservaschedule/:id_reserva", scheduleController.deletereserva_sala); // Deletar reserva

// Exportando a instância de express configurada
module.exports = router;
