var express = require('express');
var router = express.Router();
var db = require('../models')

router.get('classes/new', function(req, res, next) {
	res.render("new-class");
})

/* GET home page. */
router.get('/', function(req, res, next) {
	db.Class.findAll({where: { UserId: req.user.id }}).then(function(classes) {
    res.render('index', { user: req.user, classes: classes });
	})
});



module.exports = router;
