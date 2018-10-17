const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const rpcAdapter = require('./rpc/adapter.js');

const app = express();

app.use(bodyParser.json());

app.use(
  '/client',
  express.static(path.join(__dirname, '../client')),
);

app.post('/api/rpc', function(req, res) {
  const { body } = req;
  console.log('request body', body);

  const { functionName, inputs } = body;
  rpcAdapter.request(functionName, inputs, (err, result) => {
    const statusCode = err ? (err.statusCode || 400) : 200;
    res.status(statusCode).json(err || result);
  });

  // if (functionName == 'pieceView') {
  //   let userId = inputs[0];
  //   let artId = inputs[1];

  //   // wip: call smart contract's pieceView method and return the data
  //   // contract.pieceView(userId, artId);
  // }

  // if (functionName == 'pieceCreate') {
  //   let ownerId = inputs[0];
  //   let title = inputs[1];
  //   let description = inputs[2];
  //   let category = inputs[3];
  //   let url = inputs[4];
  //   let min_price_view = inputs[5];
  //   let remix_price_view = inputs[6];

  //   // wip: call smart contract's pieceCreate method
  //   // contract.pieceCreate(uint _ownerId, string _title, string _description, string _category, string _url,
  //   //    uint _min_price_view, uint _remix_price_view)
  // }

  // if (functionName == 'rate') {
  //   // wip
  // }

  // if (functionName == 'pieceSendOffer') {
  //   // wip: call smart contract's pieceSendOffer method and return the data
  //   // contract.pieceSendOffer();
  // }

  // if (functionName == 'pieceFillOffer') {
  //   // wip: call smart contract's pieceFillOffer method and return the data
  //   // contract.pieceFillOffer();
  // }
});

module.exports = app;
