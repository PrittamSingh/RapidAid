const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create',
    authMiddleware.authUser,
    rideController.createRide
)

router.post('/get-fare',
    authMiddleware.authUser,
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    rideController.confirmRide
)

router.post('/start-ride',
    authMiddleware.authCaptain,
    
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    rideController.endRide
)

module.exports = router;