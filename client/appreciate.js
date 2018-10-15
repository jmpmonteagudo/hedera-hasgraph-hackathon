function setUpAppreciate() {
  $("div.artgraph-tab-content.appreciate .appreciate-rating").rating();

  $("div.artgraph-tab-content.appreciate .appreciate-submit").click(function(e) {
    e.preventDefault();
    submitAppreciate();
  });
}

function getKeysInputElements() {
  return [
    $('div.artgraph-tab-content.appreciate .appreciate-qrcode'),
    $('div.artgraph-tab-content.appreciate .appreciate-tip'),
    $('div.artgraph-tab-content.appreciate .appreciate-rating'),
  ];
}

function submitAppreciate() {
  const inputs = getKeysInputElements();
  const qrCode = inputs[0].val();
  const tip = +(inputs[1].val());
  const ratingString = inputs[2].val();
  if (isNaN(tip) || tip < 0) {
    throw new Error('Tip must be a positive number');
  }
  if (ratingString === '') {
    // invoke view only
    const inputs = [ qrCode, tip ];
    sendRpc("view", inputs, console.log);
  } else {
    // invoke rate instead of view
    const rating = +ratingString;
    if (!isNaN(rating) && (rating < 0 || rating > 5)) {
      throw new Error('Rating must be a number between 0 and 5');
    }
    const inputs = [ qrCode, tip, rating ];
    sendRpc("rate", inputs, console.log);
  }
}