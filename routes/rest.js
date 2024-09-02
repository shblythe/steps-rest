var express = require('express');
const db =require('../database/appDb');

var router = express.Router();

router.post('/:player/:date/:steps', async (req, res) => {
    const player=req.params.player;
    const date=req.params.date;
    const steps=req.params.steps;
    await db.setup().then(async ()=>{
        const last = await db.getSingleObjectFromQueryRow(
            `CALL GetPeriodSteps('${player}','${date}','${date}')`,
            ["steps"]
        );
        const last_steps = last.steps*1;
        console.log("*", steps, last_steps);
        if (steps > last_steps) {
            console.log("sent");
            db.runQuery(`CALL AddSteps('${player}','${date}',${steps})`)
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
});

module.exports = router;

