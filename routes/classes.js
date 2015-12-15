var express = require('express');
var router = express.Router();
var db = require('../models')

/* GET home page. */
router.post('/classes', function(req, res, next) {	
	db.Class.create({ name: req.body.name, UserId: req.user.id }).then(function(studentClass) {
		var studentObjects = req.body.students.replace(/\s/g, "").split(",").map(function(name) {
			return { name: name, ClassId: studentClass.id }
		})
		console.log("objects!", studentObjects);
		db.Student.bulkCreate(studentObjects).then(function(students) {
			res.redirect("/");
		})    	
	})
});

router.get('/classes/new', function(req, res, next) {
	res.render("new-class");
})

module.exports = router;
