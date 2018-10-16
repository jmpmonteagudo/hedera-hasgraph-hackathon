const express = require('express')
const app = express()
const port = 3000
var bodyParser = require('body-parser');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/rpc', function(req, res) {
    
    console.log(`req.param = ${JSON.stringify(req.param)}`);
    console.log(`req.body = ${JSON.stringify(req.body)}`);

    //res.send('user ' + req.params.id);

    if (req.body.funcName == 'pieceView') {
        let userId = req.body.params[0];
        let artId = req.body.params[1];

        // wip: call smart contract's pieceView method and return the data
        // contract.pieceView(userId, artId);
    }

    if (req.body.funcName == 'pieceCreate') {
        let ownerId = req.body.params[0];
        let title = req.body.params[1];
        let description = req.body.params[2];
        let category = req.body.params[3];
        let url = req.body.params[4];
        let min_price_view = req.body.params[5];
        let remix_price_view = req.body.params[6];

        // wip: call smart contract's pieceCreate method
        // contract.pieceCreate(uint _ownerId, string _title, string _description, string _category, string _url,
        //    uint _min_price_view, uint _remix_price_view)
    }

    if (req.body.funcName == 'rate') {
        // wip
    }

    if (req.body.funcName == 'pieceSendOffer') {
        // wip: call smart contract's pieceSendOffer method and return the data
        // contract.pieceSendOffer();
    }

    if (req.body.funcName == 'pieceFillOffer') {
        // wip: call smart contract's pieceFillOffer method and return the data
        // contract.pieceFillOffer();
    }

    res.json(req.body);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

