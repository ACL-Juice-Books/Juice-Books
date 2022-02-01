const { Router } = require('express');
const Publisher = require('../models/Publisher.js');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const publisher = await Publisher.insert({
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
      });
      res.send(publisher);
    } catch (error) {
      next(error);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const publisher = await Publisher.getAll();

      res.json(publisher);
    } catch (error) {
      next(error);
    }
  })

  .get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const publisher = await Publisher.getById(id);
      res.json(publisher);
    } catch (error) {
      next(error);
    }
  })

  .delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const publisher = await Publisher.deleteById(id);

      res.json(publisher);
    } catch (error) {
      next(error);
    }
  });
