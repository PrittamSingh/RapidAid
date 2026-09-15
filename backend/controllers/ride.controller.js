const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');
module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
const distance = mapService.calculateDistance(
            pickup.ltd,    // Corrected: should use ltd
            pickup.lng,    // Corrected: should use lng
            destination.ltd, // Corrected: should use ltd
            destination.lng  // Corrected: should use lng
)

        // Create the ride
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
            
        });

        // Find captains within 2 km radius
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
            pickup.ltd,    // Corrected: should use ltd
            pickup.lng,    // Corrected: should use lng
            2
        );
      // Debugging line 
        // Populate ride with user info
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        // Notify all nearby captains
        captainsInRadius.forEach(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            });
        });

        return res.status(201).json(rideWithUser);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const dist = await mapService.calculateDistance(
            pickup.ltd,    
            pickup.lng,   
            destination.ltd, 
            destination.lng  
        )
        const time = await mapService.calculateTime(dist, vehicleType);
        const fare = await mapService.calculateFare(dist, vehicleType);
        
        return res.status(200).json({ fare });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    const {captainId}= req.body;
    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });
         const captain = await captainModel.findById(captainId);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.startRide = async (req, res) => {
    

    const { rideId, otp } = req.body;
  

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};
