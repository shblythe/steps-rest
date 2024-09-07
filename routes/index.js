var express = require('express');
var router = express.Router();
const dal =require('../database/dal');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const players = await dal.getPlayerNames();
    const week0 = await dal.getThisWeekStandings();
    const week1 = await dal.getLastWeekStandings();
    let weeks=[];
    weeks.push({
        name: "This Week",
        date: week0.start,
        players: week0.players
    });
    weeks.push({
        name: "Last Week",
        date: week1.start,
        players: week1.players
    });
    res.render('index', {
        weeks: weeks
    });
});

module.exports = router;
