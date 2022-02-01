// controller time!
const Router = require('express');
const Reviewer = require('../models/Reviewer.js');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const response = await Reviewer.insert({ ...req.body });
    res.send(response);
  } catch (err) {
    next(err);
  }
});
