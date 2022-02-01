module.exports = (author) => {
  if (!author) {
    const error = new Error('author not found');
    error.status = 404;
    throw error;
  }
};
