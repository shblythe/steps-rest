var express = require('express');
var router = express.Router();
const db =require('../database/appDb');

const getPlayersWeek = async (players, start, end) => {
    let playersWeek=[];
    for (player of players) {
        const steps = await db.getSingleObjectFromQueryRow(
            `CALL GetPeriodSteps('${player.name}','${start}','${end}')`,
            ["steps"]
        );
        playersWeek.push({
            name: player.name,
            steps: steps.steps*1
        });
    }
    playersWeek.sort((a,b) => b.steps - a.steps);
    return playersWeek;
};

/* GET home page. */
router.get('/', function(req, res, next) {
    db.setup().then(async () => {
        const players = await db.getObjectsFromQueryRows(`CALL GetPlayers()`,["name"]);
        let date = new Date();
        weekdates=[];
        // Find most recent Monday
        while (date.getDay() != 1)
            date.setDate(date.getDate() - 1);
        const week0start = date.toISOString().substr(0,10);
        date.setDate(date.getDate() + 6);
        const week0end = date.toISOString().substr(0,10);
        date.setDate(date.getDate() - 13);
        const week1start = date.toISOString().substr(0,10);
        date.setDate(date.getDate() + 6);
        const week1end = date.toISOString().substr(0,10);
        let weeks=[];
        let week0players= await getPlayersWeek(players, week0start, week0end);
        weeks.push({
            name: "This Week",
            date: week0start,
            players: week0players
        });
        let week1players= await getPlayersWeek(players, week1start, week1end);
        weeks.push({
            name: "Last Week",
            date: week1start,
            players: week1players
        });
        res.render('index', {
            weeks: weeks
        });
    });
});

module.exports = router;
