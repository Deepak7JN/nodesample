const express = require('express')
const router = express.Router()

// Home Page - Route
//router.use('/', require('./user/home'))
// Admin Page - Route
router.use('/', require('./admin/home'))
router.use('/admin/user', require('./admin/user'))

module.exports = router;
