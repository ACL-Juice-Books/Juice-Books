const Router = require('express');
const Review = require('../models/Review.js');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const review = await Review.insert(req.body);
      res.json(review);
    } catch(error) {
      next(error);
    }
  });
