const { catchAsyncError } = require('../middleware/catchAsyncError');
const ErrorHandler = require('../middleware/errorHandlers');
const userModel = require('../models/user-model');
const Razorpay = require('razorpay');

module.exports.getAlluser = catchAsyncError(async (req, res, next) => {
    const users = await userModel.find({})

    if (!users) {
        return next(new ErrorHandler("Failed to create user", 500));
    }

    res.status(200).json({
        message: "All user",
        users: users
    })
});

module.exports.getOneUserByUsername = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findOne({
        username: req.params.username
    })

    if (!user) {
        return next(new ErrorHandler("Failed to create user", 500));
    }

    res.status(200).json({
        message: "User found",
        user: user
    })
});

module.exports.deleteOneUserByUsername = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findOneAndDelete({
        username: req.params.username
    })

    if (!user) {
        return next(new ErrorHandler("Failed to create user", 500));
    }

    res.status(200).json({
        message: "User found",
        user: user
    })
});


module.exports.getRevenue = catchAsyncError(async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthStart = Math.floor(startOfMonth / 1000); // Start of the current month
        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const todayStart = Math.floor(startOfDay / 1000); // Start of the current day
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const yearStart = Math.floor(startOfYear / 1000);


        // Fetch payments for each time period
        const todayPayments = await instance.payments.all({ from: todayStart, to: now });
        const monthlyPayments = await instance.payments.all({ from: monthStart, to: now });
        const yearlyPayments = await instance.payments.all({ from: yearStart, to: now });


        // Calculate revenue for each period
        const todayRevenue = calculateRevenue(todayPayments);
        const monthlyRevenue = calculateRevenue(monthlyPayments);
        const yearlyRevenue = calculateRevenue(yearlyPayments);

        res.json({ todayRevenue, monthlyRevenue, yearlyRevenue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve payments' });
    }
});

function calculateRevenue(payments) {
    let total = 0;
    for (const payment of payments.items) {
        total += payment.amount;
    }
    return total / 100;
}

module.exports.getTransactions = catchAsyncError(async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const transactions = await instance.payments.all();

        res.json({ transactions: transactions.items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
});