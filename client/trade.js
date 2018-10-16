let tradesDisplayTemplate;

function setUpTrade() {
  tradesDisplayTemplate = $.templates("#trade-display-template");

  $('div.artgraph-tab-content.trade .trade-submit').click(function(e) {
    e.preventDefault();
    submitTrade();
  });
  $('div.artgraph-tab-content.trade .trade-refresh').click(function(e) {
    e.preventDefault();
    displayTrades();
  });

  displayTrades();
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


const tradeDisplayTemplateHelpers = {
  shouldShowButtons: function(status) {
    return (status === 'pending');
  }
};

// TODO un stub this data
function displayTrades() {
  const trades = {
    buyOffers: [
      {
        offer_id: 123,
        art_id: 100001,
        title: 'Spring Blossoms',
        name: 'Jose Perez',
        price: 10,
        status: 'pending',
      },
    ],
    sellOffers: [
      {
        offer_id: 124,
        art_id: 100002,
        title: 'Autumn Wilts',
        name: 'Brendan Graetz',
        price: 20,
        status: 'completed',
      },
      {
        offer_id: 125,
        art_id: 100003,
        title: 'Autumn Wilts',
        name: 'Brendan Graetz',
        price: 15,
        status: 'rejected',
      },
    ],
  };
  setTimeout(function() {
    renderTrades(trades, tradeDisplayTemplateHelpers);
  }, 500);
}

function renderTrades(trades) {
  const html = tradesDisplayTemplate.render(trades);
  $('div.artgraph-tab-content.trade .trade-display').html(html);
}