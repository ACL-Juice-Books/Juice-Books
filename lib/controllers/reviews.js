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
  })
  .get('/', async (req, res, next) => {
    try {
      const reviews = await Review.getTop();
      res.json(reviews);
    } catch(error) {
      next(error);
    }
  })
  .delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const review = await Review.delete(id);
      res.json(review);
    } catch(error) {
      next(error);
    }
  });
