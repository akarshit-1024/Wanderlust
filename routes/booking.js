const express = require("express");
const router =express.Router();

const bookingController=require("../controllers/booking");
const {isLogIn}=require("../middleware");


// Booking Routes
router.get("/mybookings", isLogIn, bookingController.myBookings);
router.route("/:id")
    .get(isLogIn, bookingController.showBooking)  //show booking
    .post(isLogIn, bookingController.createBooking); //create booking

// Confirmation page
router.get(
    "/confirmation/:bookingId",
    isLogIn,
    bookingController.confirmation
);

// My bookings
router.get(
    "/mybookings",
    isLogIn,
    bookingController.myBookings
);

module.exports = router;
