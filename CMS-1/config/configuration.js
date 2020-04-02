module.exports = {
    mongoDbUrl : 'mongodb://localhost:27017/CMSTest',
    PORT: process.env.PORT || 3000,
    globalVariables: (req, res, next) => {
      res.locals.success_message = req.flash("success_message");
      res.locals.error_message = req.flash("error_message");

      next();
    }
};
