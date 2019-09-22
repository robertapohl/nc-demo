var express = require('express');
var router = express.Router();

/* Render success page */
router.get('/', function(req, res, next) {
  res.render('success',{});
});

module.exports = router;
