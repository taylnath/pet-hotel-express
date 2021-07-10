const express = require('express');
const router = express.Router();

// @route   GET /coffee/brewCoffee
// @access  Public
router.get('/brewCoffee', async (req, res) => {
  res.status(418);
  res.send("I'm a teapot.");
});

module.exports = router;
