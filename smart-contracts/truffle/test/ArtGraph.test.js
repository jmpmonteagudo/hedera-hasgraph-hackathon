'use strict';

const BigNumber = web3.BigNumber;
require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .use(require('chai-as-promised'))
    .should();
const assertRevert = require('./helpers/assertRevert');
const ArtGraph = artifacts.require('../contracts/ArtGraph.sol');

contract('ArtGraph', function (accounts) {

    let contract;

    let _ownerId = 1; // Leonardo
    let _title = 'Mona Lisa'
    let _description = 'Best painting ever'
    let _category = 'Paiting'
    let _url = 'https://some-url.com'
    let _min_price_view = 10;
    let _remix_price_view = 100;

    let _userId = 2;
    let _offerAmount = 100;

    describe('basic tests', function () {
        before(async function () {
            // console.log(`accounts = ${JSON.stringify(accounts)}`);
            // console.log(`contract.address = ${contract.address}`);
            contract = await ArtGraph.new({ from: accounts[0] });
        });

        it('create a new art piece', async function () {
            await contract.pieceCreate(_ownerId, _title, _description, _category, _url, _min_price_view, _remix_price_view);
        });

        it('view the art piece', async function () {
            //assertRevert(contract.pieceView(_userId, 0, { from: accounts[0], value: _remix_price_view-1 }));
            await contract.pieceView(_userId, 0, { from: accounts[0], value: _remix_price_view });
        });

        it('send offer', async function () {
            await assertRevert(contract.pieceSendOffer(0, _ownerId + 1, _offerAmount));
            await contract.pieceSendOffer(0, _ownerId, _offerAmount);
        });

        it('fill offer', async function () {
            await assertRevert(contract.pieceFillOffer(0, _userId, _offerAmount - 1));
            await contract.pieceFillOffer(0, _userId, _offerAmount);
        });
    });
});
