const { Router } = require('express');
const Author = require('../models/Author');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      console.log(req.body);
      const author = await Author.insert(req.body);
      res.send(author);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const author = await Author.getById(req.params.id);
      res.send(author);
    } catch (error) {
      next(error);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const author = await Author.getAll();
      res.send(author);
    } catch (error) {
      next(error);
    }
  });

//trying to push to GH
