# ArtGraph

**ArtGraph** is proof-of-concept of a decentralized platform to reward artists for pieces of art
that they create. One can tip, rate, remix, and trade art on this platform.

This project was done in the [Hedera-Hashgraph global hackathon][hedera18hackathon].

[Slides used in our demo](https://docs.google.com/presentation/d/1Z1Unu5-9l-Xtf4247MKV85LB8hQFIhrAi55jPPpua5A/edit?usp=sharing)

### Client

To run the client:

```bash
node server/run.js
```

Then open [localhost:51111/client/](http://localhost:51111/client/) in a browser.

Note that QR code scanning functionality will require webcam access, and a browser that supports
WebRTC standards. If these are unavailable on your device, you type the QR code in manually.

### Smart Contracts

To build and run the Truffle tests:

```bash
cd smart-contracts
npm run build
npm test
```

## Authors

[Brendan Graetz][brendan]

[Jose Perez][jose]


[hedera18hackathon]: https://www.hedera18.com/hackathon/
[brendan]: https://github.com/bguiz
[jose]: https://github.com/jmpmonteagudo/
