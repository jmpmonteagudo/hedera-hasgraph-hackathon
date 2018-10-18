function stub(inputs, errback) {
  const { qrcode, tip } = inputs;
  if (!qrcode) {
    return errback({
      message: 'qrcode must be present',
      details: { qrcode, tip },
      statusCode: 400,
    });
  }
  if (isNaN(tip) || tip < 0) {
    return errback({
      message: 'tip must be a positive number',
      details: { qrcode, tip },
      statusCode: 400,
    });
  }
  const art = {
    id: 12345,
    title: 'Spring Blossoms',
    description: 'Flowers in the spring',
    category: 'painting',
    url: 'http://example.com/spring-blossoms',
    min_view_price: 5,
    min_remix_price: 25,
    qrcode,
  };
  errback(undefined, {
    art,
    message: 'artist has received payment',
    details: { qrcode, tip, total: (art.min_view_price + tip) },
    statusCode: 200,
  });
}

module.exports = stub;
