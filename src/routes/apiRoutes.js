const router = require("express").Router();

const reservaController = require("../controllers/reservaController");
const usuarioController = require("../controllers/userController");
const salaController = require("../controllers/salaController");
const userController = require("../controllers/userController");

router.post("/user", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/user", userController.getAllUsers);
router.put("/user/:id_usuario", userController.updateUser);
router.delete("/user/:id_usuario", userController.deleteUser);

router.get("/reserva", reservaController.createReservas);
router.post("/reserva", reservaController.createReservas);
router.get("/reservas", reservaController.getAllReservas);
router.put("/reserva/:id_reserva", reservaController.updateReserva);
router.delete("/reserva/:id_reserva", reservaController.deleteReserva);

router.post("/sala", salaController.createSalas);
router.get("/salas", salaController.getAllSalasTabela);
router.put("/sala/:id_sala", salaController.updateSala);
router.delete("/sala/:id_sala", salaController.deleteSala);

router.get("/salasdisponivelhorario", salaController.getSalasDisponiveisHorario);
router.get("/salasdisponiveldata", salaController.getSalasDisponiveisData);
router.get("/salasdisponiveis", salaController.getSalasDisponiveis);

module.exports = router;

//Exportândo a instância de express configurada, para que seja acessada em outros arquivos
