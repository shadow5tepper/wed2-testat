var express = require("express");
var router = express.Router();

var notes = require("../controller/noteController.js");

/* GET home page. */
router.get("/", notes.showIndex);

router.get("/create", notes.showNew);
router.post("/create", notes.createNew);
router.get("/edit/:id", notes.showEdit);
router.post("/edit/:id", notes.updateEdit);

module.exports = router;
