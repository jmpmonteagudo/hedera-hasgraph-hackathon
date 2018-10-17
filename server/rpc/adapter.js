const rpcType = process.env.RPC_TYPE || 'hedera';

function request(functionName, inputs, errback) {
  let rpcFunction;
  try {
    rpcFunction = require(`./${functionName}/${functionName}.js`);
  } catch (ex) {
    // do nothing
  }
  if (!rpcFunction) {
    return errback({
      message: 'function is not defined',
      details: { functionName },
      statusCode: 404,
    });
  }

  const rpcHandler = rpcFunction[rpcType];
  if (!rpcHandler) {
    return errback({
      message: 'handler is not implemented',
      details: { functionName, rpcType },
      statusCode: 404,
    });
  }

  rpcHandler(inputs, errback);
}

module.exports = {
  request,
};
