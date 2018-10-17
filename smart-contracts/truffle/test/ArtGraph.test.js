'use strict';

const assertRevert = require('./helpers/assertRevert');
const ArtGraph = artifacts.require('../contracts/ArtGraph.sol');
const BigNumber = web3.BigNumber;

contract('ArtGraph', function (accounts) {

    // All transactions require to pay gas fees. This parameters serves as
    // a rough estimation of what the maximum percentage of the total transaction
    // ETH difference would be due to gas fees.
    const ETHER = new BigNumber('1e18');
    const GAS_TOLERANCE_PERCENT = 5;

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

    let _offerAmount = ETHER;

    let artId;
    let offerId;
    
    function assertSimilarBalance(current, expected) {
        let diff = current.minus(expected);
        let percentageGas = diff.dividedBy(current).times(100);
        if (!percentageGas.abs().lt(GAS_TOLERANCE_PERCENT)) {
            // debugging logs
            // console.log(`current = ${current}`);
            // console.log(`expected = ${expected}`); 
            // console.log(`diff = ${diff}`);
            // console.log(`percentageGas = ${percentageGas}`);
            assert.equal(true, false);
        }
        return true;
    }

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
            await assertRevert(contract.pieceFillOffer(offerId, {from: buyer, value: _offerAmount.minus(1)}));
            await contract.pieceFillOffer(offerId, {from: buyer, value: _offerAmount});
        });

        it('withdraw offer funds', async function () {
            const balanceBefore = new BigNumber(await web3.eth.getBalance(artist));
            await contract.withdrawOfferfunds(offerId, {from: artist});
            const balanceAfter = new BigNumber(await web3.eth.getBalance(artist));
            assertSimilarBalance(balanceAfter, balanceBefore.plus(_offerAmount));
        });
    });
});
