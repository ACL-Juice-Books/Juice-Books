const { Router } = require('express');
const Book = require('../models/Book.js');

module.exports = Router()
  .post('/books', async (req, res, next) => {
    try {
      const result = await Book.insert(req.body);
      res.json(result);
    } catch(error) {
      next(error);
    }
  })
  .get('/books', async (req, res, next) => {
    try {
      const result = await Book.getAll();
      res.json(result);
    } catch(error) {
      next(error);
    }
  })
  .get('/books/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Book.getById(id);
      res.json(result);
    } catch(error) {
      next(error);
    }
  });
