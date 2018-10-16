function setUpAppreciate() {
  $("div.artgraph-tab-content.appreciate .appreciate-rating").rating();

  $("div.artgraph-tab-content.appreciate .appreciate-submit").click(function(e) {
    e.preventDefault();
    submitAppreciate();
  });

  $('div.artgraph-tab-content.appreciate .appreciate-qrcode').change(function(e) {
    e.preventDefault();
    const qrcode = $(this).val();
    appreciateDisplayQrcode(qrcode);
  });
}

function getAppreciateInputElements() {
  return [
    $('div.artgraph-tab-content.appreciate .appreciate-qrcode'),
    $('div.artgraph-tab-content.appreciate .appreciate-tip'),
    $('div.artgraph-tab-content.appreciate .appreciate-rating'),
  ];
}

function appreciateDisplayQrcode(qrcode) {
  const img = kjua({
    text: qrcode,
    size: 240,
    mode: 'image',
    mSize: 15,
    image: document.querySelector('img.artgraph-text-image'),
  });
  const container = $('div.artgraph-tab-content.appreciate .appreciate-qrcode-display');
  container.html('');
  container.append(img);
}

function submitAppreciate() {
  const inputs = getAppreciateInputElements();
  const qrCode = inputs[0].val();
  const tip = +(inputs[1].val());
  const ratingString = inputs[2].val();
  if (isNaN(tip) || tip < 0) {
    throw new Error('Tip must be a positive number');
  }
  if (ratingString === '') {
    // invoke view only
    const viewInputs = [ qrCode, tip ];
    sendRpc("view", viewInputs, console.log);
  } else {
    // invoke rate instead of view
    const rating = +ratingString;
    if (!isNaN(rating) && (rating < 0 || rating > 5)) {
      throw new Error('Rating must be a number between 0 and 5');
    }
    const rateInputs = [ qrCode, tip, rating ];
    sendRpc("rate", rateInputs, console.log);
  }
}