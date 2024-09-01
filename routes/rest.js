var express = require('express');
const db =require('../database/appDb');

var router = express.Router();

router.post('/:player/:date/:steps', (req, res) => {
    const player=req.params.player;
    const date=req.params.date;
    const steps=req.params.steps;
    db.setup().then(()=>{
        db.runQuery(`CALL AddSteps('${player}','${date}',${steps})`).then(()=>res.send())
        .catch((e)=>res.status(404).send(e.message));
    });
});

module.exports = router;

