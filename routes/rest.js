var express = require('express');
const dal = require('../database/dal');

var router = express.Router();

router.get('/thisweekstandings', async (req, res) => {
    res.send(await dal.getThisWeekStandings());
});

router.get('/lastweekstandings', async (req, res) => {
    res.send(await dal.getLastWeekStandings());
});

router.post('/:player/:date/:steps', async (req, res) => {
    const player=req.params.player;
    const date=req.params.date;
    const steps=req.params.steps;
    const last_steps = await dal.getPeriodSteps(player, date, date);
    if (steps > last_steps) {
        dal.addSteps(player, date, steps)
            .then(() => {
                res.send();
            })
            .catch((e) => {
                res.status(404).send(e.message)
            });
    } else {
        res.send();
    }
});

module.exports = router;

