const router = require("express").Router();

const salaController = require("../controllers/salaController");
const userController = require("../controllers/userController");
const scheduleController = require("../controllers/scheduleController")

router.post("/user", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/user", userController.getAllUsers);
router.put("/user/:id_usuario", userController.updateUser);
router.delete("/user/:id_usuario", userController.deleteUser);

router.post("/sala", salaController.createSalas);
router.get("/salas", salaController.getAllSalasTabela);
router.put("/sala/:id_sala", salaController.updateSala);
router.delete("/sala/:id_sala", salaController.deleteSala);

router.get("/salasdisponivelhorario", salaController.getSalasDisponiveisHorario);
router.get("/salasdisponiveldata", salaController.getSalasDisponiveisData);
router.get("/salasdisponiveis", salaController.getSalasDisponiveis);

router.post("/reservaschedule", scheduleController.createreserva_sala)
router.get("/reservaschedule", scheduleController.getAllreserva_salas);
router.delete("/reservaschedule/:id_reserva", scheduleController.deletereserva_sala);

module.exports = router;

//Exportando a instância de express configurada, para que seja acessada em outros arquivos
