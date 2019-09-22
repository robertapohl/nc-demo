var express = require('express');
var router = express.Router();

/* Render fail page */
router.get('/', function(req, res, next) {
  res.render('fail',{});
});

module.exports = router;
