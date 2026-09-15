const rideModel = require('../models/ride.model');
const { calculateDistance, calculateFare, getOtp } = require('./maps.service');

// Create ride
module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const distanceKm = calculateDistance(pickup.ltd, pickup.lng, destination.ltd, destination.lng);
    const fare = calculateFare(distanceKm, vehicleType);
    const otp = getOtp(6);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp,
        fare,
        status: 'pending',
        distance: distanceKm,
    });

    return ride;
};

// Confirm ride
module.exports.confirmRide = async ({ rideId, captain }) => {
    if (!rideId) throw new Error('Ride ID required');
    if (!captain || !captain._id) throw new Error('Captain data invalid');

    const updateResult = await rideModel.updateOne(
        { _id: rideId },
        { status: 'accepted', captain: captain._id }
    );

    if (updateResult.matchedCount === 0 && updateResult.nModified === 0) {
        throw new Error('Ride not found or could not be updated');
    }

    const ride = await rideModel
        .findOne({ _id: rideId })
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found after update');
    }

    if (!ride.user) {
        throw new Error('Ride user not found');
    }

    return ride;
};


// Start ride
module.exports.startRide = async ({ rideId, otp, captain }) => {
    const ride = await rideModel.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');
    if (!ride) throw new Error('Ride not found');
    if (ride.status !== 'accepted') throw new Error('Ride not accepted');
    if (ride.otp !== otp) throw new Error('Invalid OTP');

    await rideModel.updateOne({ _id: rideId }, { status: 'ongoing' });
   
    return ride;
};

// End ride
module.exports.endRide = async ({ rideId, captain }) => {
    const ride = await rideModel.findOne({ _id: rideId, captain: captain._id }).populate('user').populate('captain');
    if (!ride) throw new Error('Ride not found');
    if (ride.status !== 'ongoing') throw new Error('Ride not ongoing');

    await rideModel.updateOne({ _id: rideId }, { status: 'completed' });

    return ride;
};
