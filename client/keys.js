function setUpKeys() {
  $('div.artgraph-tab-content.keys .keys-save-button').click(function(e) {
    e.preventDefault();
    saveKeys();
  });
  $('div.artgraph-tab-content.keys .keys-clear-button').click(function(e) {
    e.preventDefault();
    clearKeys();
  });
}

function getInputElements() {
  return [
    $('div.artgraph-tab-content.keys .keys-public-input'),
    $('div.artgraph-tab-content.keys .keys-private-input'),
  ];
}

function getKeys(errback) {
  localforage.getItem('keys', errback);
}

function saveKeys() {
  const inputs = getInputElements();
  const publicKey = inputs[0].val();
  const privateKey = inputs[1].val();
  console.log('saveKeys', publicKey, privateKey);
  const keys = {
    publicKey,
    privateKey,
  };
  localforage.setItem('keys', keys, function (err) {
    if (err) {
      console.error('Error', error);
      return;
    }
    inputs.forEach((input) => {
      input.val('');
    });
    console.log('Saved keys');
  });
}

function clearKeys() {
  console.log('clearKeys');
  localforage.removeItem('keys', function (err) {
    if (err) {
      console.error('Error', error);
      return;
    }
    const inputs = getInputElements();
    inputs.forEach((input) => {
      input.val('');
    });
    console.log('Cleared keys');
  });
}