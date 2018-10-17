# ArtGraph

**ArtGraph** is proof-of-concept of a decentralized platform to reward artists for the pieces of art. This is a project done at the [Hedera-Hashgraph global hackathon][hedera18hackathon].


## Description

Slides are available here:

https://docs.google.com/presentation/d/1Z1Unu5-9l-Xtf4247MKV85LB8hQFIhrAi55jPPpua5A/edit?usp=sharing


### Back end

To run the back end:

```bash
cd server
node index.js
```

Then open `client/index.html` with a browser.


### Smart contracts

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
