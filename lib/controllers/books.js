const { Router } = require('express');
const Book = require('../models/Book.js');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const result = await Book.insert(req.body);
      res.json(result);
    } catch(error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const result = await Book.getAll();
      res.json(result);
    } catch(error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Book.getById(id);
      res.json(result);
    } catch(error) {
      next(error);
    }
  });
