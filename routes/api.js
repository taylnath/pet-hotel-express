const express = require('express');
const router = express.Router();

// TODO: add test with database

// // item model
// const Item = require('../../models/Item');

// @route   GET /api/test
// @desc    Get test data
// @access  Public
router.get('/test', async (req, res) => {
  console.log('Pretending to be slow...');
  await new Promise(res => setTimeout(res, 1000));
  console.log('Done.');
  res.send('hello this is a test');
});

// // @route   POST api/items
// // @desc    Create an Item
// // @access  Public
// router.post('/', (req, res) => {
//   const newItem = new Item({
//     name: req.body.name
//   });

//   newItem.save().then(item => res.json(item)).catch(err => console.log(err));
// });

// // @route   DELETE api/items
// // @desc    Delete an Item
// // @access  Public
// router.delete('/:id', (req, res) => {
//   Item.findById(req.params.id)
//     .then(item => item.remove().then(() => res.json({success: true})))
//     .catch(err => res.status(404).json({success: false}));
// });

module.exports = router;