const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitorController');
const middleware = require('../middleware/verify.js');

router.get('/',monitorController.auth);
router.get('/dashboard',middleware,monitorController.dashboar);
router.get('/canales',middleware,monitorController.verCanales);
router.get('/usuarios',middleware,monitorController.usuarios);
router.get('/registerCanal',middleware,monitorController.registerCanal);
router.get('/registerUsuario',middleware,monitorController.registerUsuario);
router.get('/alerts',middleware,monitorController.alerts);
router.get('/logout',monitorController.logout);
router.get('/configuracion',middleware,monitorController.getConfiguracion);
router.post('/configuracion',middleware,monitorController.postConfiguracion);
router.get('/updateUserGet/:id',middleware,monitorController.updateUserGet);
router.get('/updateCanalGet/:id',middleware,monitorController.updateCanalGet);
router.get('/statusVerify/:ip',monitorController.statusVerify);
router.get('/allClear',monitorController.allClear);


router.post('/registerCanalPost',monitorController.registerCanalPost);
router.post('/registerUsuarioPost',monitorController.registerUsuarioPost);
router.post('/login',monitorController.login);

router.put('/updatePut/:id/:tabla',monitorController.updatePut);
router.delete('/delete/:id/:tabla',monitorController.delete);


module.exports = router;
