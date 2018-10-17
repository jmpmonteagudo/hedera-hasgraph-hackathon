'use strict';

const assertRevert = require('./helpers/assertRevert');
const ArtGraph = artifacts.require('../contracts/ArtGraph.sol');

contract('ArtGraph', function (accounts) {

    let contract;

    const someoneElse = accounts[1];
    const artist = accounts[2];
    const buyer = accounts[3];
    const users = accounts.slice(4, 6);
    

    let _title = 'Mona Lisa'
    let _description = 'Best painting ever'
    let _category = 'Paiting'
    let _url = 'https://some-url.com'
    let _min_price_view = 10;
    let _remix_price_view = 100;

    let _offerAmount = 100;

    let artId;
    let offerId;

    describe('basic tests', function () {
        before(async function () {
            contract = await ArtGraph.new({ from: accounts[0] });
        });

        it('create a new art piece', async function () {
            const pieceCreate = await contract.pieceCreate(_title, _description, _category, _url, _min_price_view, _remix_price_view, {from: artist});
            assert.equal(pieceCreate.logs[0].event, 'PieceCreate');
            artId = pieceCreate.logs[0].args.artId.valueOf();
            assert.equal(artId, 0);
        });

        it('view the art piece', async function () {
            await contract.pieceView(artId, { from: users[0], value: _remix_price_view });
        });

        it('send offer', async function () {
            await assertRevert(contract.pieceSendOffer(artId, _offerAmount, {from: someoneElse}));
            const pieceSendOffer = await contract.pieceSendOffer(artId, _offerAmount, {from: artist});
            assert.equal(pieceSendOffer.logs[0].event, 'PieceSendOffer');
            offerId = pieceSendOffer.logs[0].args.offerId.valueOf();
            assert.equal(offerId, 0);

        });

        it('fill offer', async function () {
            await assertRevert(contract.pieceFillOffer(offerId, {from: buyer, value: _offerAmount - 1}));
            await contract.pieceFillOffer(offerId, {from: buyer, value: _offerAmount});
        });
    });
});
