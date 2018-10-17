const server = require('./server.js');

const port = 51111;
server.listen(
  port,
  () => console.log(`Example app listening on port ${port}!`),
);
