function setUpTrade() {
  $('div.artgraph-tab-content.trade .trade-submit').click(function(e) {
    e.preventDefault();
    submitTrade();
  });
}

function getTradeInputElements() {
  return {
    qrcode: $('div.artgraph-tab-content.trade .trade-qrcode'),
    offer_amount: $('div.artgraph-tab-content.trade .trade-offer_amount'),
  };
}

function submitTrade() {
  const inputs = getTradeInputElements();
  const qrcode = inputs.qrcode.val();
  const offer_amount = +(inputs.offer_amount.val());
  if (qrcode === '') {
    throw new Error('qrcode cannot be empty');
  }
  if (isNaN(offer_amount) || offer_amount <= 0) {
    throw new Error('offer_amount must be a positive number');
  }

  // invoke tradeCreate
  const tradeCreateInputs = [
    qrcode,
    offer_amount,
  ];
  sendRpc("tradeCreate", tradeCreateInputs, console.log);
}