// getArt

function stub(inputs, errback) {
  const { qrcode } = inputs;
  errback(undefined, {
    id: 12345,
    title: 'Spring Blossoms',
    description: 'Flowers in the spring',
    category: 'painting',
    url: 'http://example.com/spring-blossoms',
    min_price_view: 5,
    remix_price_view: 25,
    qrcode,
  });
}

module.exports = {
  stub,
};
