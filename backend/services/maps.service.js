const axios = require('axios');
const captainModel = require('../models/captain.model');
const crypto = require('crypto');

// Haversine formula (returns distance in kilometers)
// Corrected distance calculator with original parameter names
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const toRad = (degree) => degree * (Math.PI / 180);
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      // Debugging line
    return R * c; // returns distance in kilometers
  }
  
  
  // For use with objects that have ltd/lng properties
  function calculateDistanceFromObjects(pickup, destination) {
    return calculateDistance(
      pickup.ltd,
      pickup.lng,
      destination.ltd,
      destination.lng
    );
  }
  

// Get captains near pickup point
async function getCaptainsInTheRadius(lat, lng, radiusKm) {
    const captains = await captainModel.find({ location: { $ne: null } });
  
    const nearby = captains.filter((captain) => {
      const dist = calculateDistance(
        lat,
        lng,
        captain.location.ltd, // ✅ fixed key
        captain.location.lng  // ✅ fixed key
      );
     
      return dist <= radiusKm;
    });
  
    return nearby;
  }
  

// Calculate time
function calculateTime(distanceKm, vehicleType) {
    let speed = 40; // default

    switch (vehicleType.toLowerCase()) {
        case "car": speed = 40; break;
        case "bike": speed = 50; break;
        case "auto": speed = 35; break;
    }

    const timeMinutes = (distanceKm / speed) * 60;
    return timeMinutes;
}

// Calculate fare
function calculateFare(distanceKm, vehicleType) {
    let base = 50, perKm = 15;

    switch (vehicleType.toLowerCase()) {
        case "car": base = 50; perKm = 15; break;
        case "bike": base = 20; perKm = 8; break;
        case "auto": base = 30; perKm = 10; break;
        default: throw new Error('Invalid vehicle type');
    }

    return Math.round(base + (distanceKm * perKm));
}

// Generate OTP
function getOtp(length) {
    if (crypto.randomInt) {
        return crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();
    }
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min + "";
}

// Export
module.exports = {
    calculateDistance,
    calculateTime,
    calculateFare,
    getCaptainsInTheRadius,
    getOtp
};
