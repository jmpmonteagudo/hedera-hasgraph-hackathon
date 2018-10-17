// getArt

function stub(inputs, errback) {
  const { qrcode } = inputs;
  errback(undefined, {
    id: 12345,
    title: 'Spring Blossoms',
    description: 'Flowers in the spring',
    category: 'painting',
    url: 'http://example.com/spring-blossoms',
    min_view_price: 5,
    min_remix_price: 25,
    qrcode,
  });
}

module.exports = {
  stub,
};
