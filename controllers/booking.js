
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const mongoose = require("mongoose");

// Show Booking Page
module.exports.showBooking = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid listing ID!");
        return res.redirect("/listings");
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("booking/booking", { listing });
};


// Create Booking
module.exports.createBooking = async (req, res) => {

    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body;

    // Validate Listing ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid listing ID!");
        return res.redirect("/listings");
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Validate date format
    const validDateFormat = /^\d{4}-\d{2}-\d{2}$/;

    if (
        !checkIn ||
        !checkOut ||
        !validDateFormat.test(checkIn) ||
        !validDateFormat.test(checkOut)
    ) {
        req.flash("error", "Please select valid dates!");
        return res.redirect(`/booking/${id}`);
    }

    // Convert dates to UTC
    const startDate = new Date(`${checkIn}T00:00:00.000Z`);
    const endDate = new Date(`${checkOut}T00:00:00.000Z`);

    // Check invalid dates
    if (
        isNaN(startDate.getTime()) ||
        isNaN(endDate.getTime()) ||
        startDate.toISOString().slice(0, 10) !== checkIn ||
        endDate.toISOString().slice(0, 10) !== checkOut
    ) {
        req.flash("error", "Invalid booking dates!");
        return res.redirect(`/booking/${id}`);
    }

    // Prevent past dates
    const today = new Date().toISOString().slice(0, 10);

    if (checkIn < today || checkOut <= checkIn) {
        req.flash("error", "Please select valid check-in and check-out dates!");
        return res.redirect(`/booking/${id}`);
    }

    // Validate Guests
    const guestCount = Number(guests);

    if (
        !Number.isInteger(guestCount) ||
        guestCount < 1 ||
        guestCount > 4
    ) {
        req.flash("error", "Invalid guest selection!");
        return res.redirect(`/booking/${id}`);
    }

    // Calculate booking amount on backend
    const nights = (endDate - startDate) / 86400000;

    const pricePerNight = Number(listing.price);
    const serviceFee = 500;

    if (!Number.isFinite(pricePerNight) || pricePerNight <= 0) {
        req.flash("error", "Invalid listing price!");
        return res.redirect("/listings");
    }

    const totalPrice = (pricePerNight * nights) + serviceFee;

    // Save Booking in MongoDB
    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkIn: startDate,
        checkOut: endDate,
        guests: guestCount,
        pricePerNight,
        nights,
        serviceFee,
        totalPrice,
        bookingStatus: "Confirmed",
        paymentStatus: "Pending"
    });

    await booking.save();

    req.flash("success", "Your booking has been confirmed!");

    // Redirect to Confirmation Page
    res.redirect(`/booking/confirmation/${booking._id}`);
};


// Booking Confirmation Page
module.exports.confirmation = async (req, res) => {

    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        req.flash("error", "Invalid booking ID!");
        return res.redirect("/booking/mybookings");
    }

    const booking = await Booking.findOne({
        _id: bookingId,
        user: req.user._id
    }).populate("listing");

    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/booking/mybookings");
    }

    res.render("booking/confirmation", { booking });
};


// My Bookings Page
module.exports.myBookings = async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id
    })
    .populate("listing")
    .sort({ createdAt: -1 });

    res.render("booking/myBookings", { bookings });
};
