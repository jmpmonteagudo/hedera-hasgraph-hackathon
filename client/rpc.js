const smartContractId = 'stub-smart-contract-id';

// TODO stub implementation, call real RPC
function sendRpc(functionName, inputs, errback) {
  console.log(`sending to smart contract ${smartContractId}#${functionName}`, inputs);
  errback(undefined, {
    functionName,
    inputs,
    stub: true,
    result: 'ok',
  });
}
