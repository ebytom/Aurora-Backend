const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const { getOneUserByUsername, getAlluser, deleteOneUserByUsername, getRevenue, getTransactions } = require("../controllers/admin");

router.get('/getAlluser', getAlluser);
router.get('/getOneUserByUsername', getOneUserByUsername);
router.get('/deleteOneUserByUsername', deleteOneUserByUsername);

router.get('/getRevenue', getRevenue);
router.get('/getTransactions', getTransactions);

module.exports = router;