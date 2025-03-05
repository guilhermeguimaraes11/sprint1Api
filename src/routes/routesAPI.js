const router = require('express').Router();

const controllerUsuario = require("../controllers/controllerUsuario.js");
const controllerSala = require("../controllers/controllerSala.js");
const controllerReserva = require('../controllers/controllerReserva.js');


router.post("/user/cadastro", controllerUsuario.cadastraUsua);
router.post("/user/login", controllerUsuario.loginUsua);
router.get("/user/", controllerUsuario.mostraUsua);
router.put("/user/", controllerUsuario.atualizaUsua);
router.delete("/user/:id", controllerUsuario.removeUsua);

router.post("/sala", controllerSala.cadastraSala);
router.get("/sala", controllerSala.mostraSalas);
router.put("/sala", controllerSala.atualizaSala);
router.delete("/sala/:id", controllerSala.removeSala);

router.post("/reserva", controllerReserva.cadastraReserva);
router.get("/reserva", controllerReserva.mostraReserva);
router.put("/reserva", controllerReserva.atualizaReserva);
router.delete("/reserva/:id", controllerReserva.deleteReserva);


module.exports = router;
// Rota base em http://localhost:5000/reservas-senai/v1/