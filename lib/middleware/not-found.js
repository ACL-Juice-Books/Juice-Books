module.exports = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  err.url = req.originalUrl;
  next(err);
};
