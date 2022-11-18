const controller = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      res.status(400).send({
        success: false,
        err: err.message,
      });
    }
  };
};

module.exports = controller;
