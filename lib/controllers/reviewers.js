// controller time!
const Router = require('express');
const Reviewer = require('../models/Reviewer.js');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const response = await Reviewer.insert({ ...req.body });
      res.send(response);
    } catch (err) {
      next(err);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const response = await Reviewer.getAll();
      res.send(response);
    } catch (err) {
      next(err);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await Reviewer.getById(id);
      res.send(response);
    } catch (err) {
      next(err);
    }
  })
  .patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await Reviewer.updateById(id, { ...req.body });
      res.send(response);
    } catch (err) {
      next(err);
    }
  })
  .delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await Reviewer.deleteById(id);
      res.send(response);
    } catch (err) {
      next(err);
    }
  });
