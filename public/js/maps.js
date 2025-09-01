maptilersdk.config.apiKey = mapToken;
const coordinate=listing.geometry.coordinates;
const opCoordinate = [coordinate[0], coordinate[1] ];
const map = new maptilersdk.Map({
  container: "map", // container id
  style: maptilersdk.MapStyle.STREETS,
  center: opCoordinate, // Delhi [lng, lat]
  zoom: 6,
});

new maptilersdk.Marker({ color: 'red' })
  .setLngLat(opCoordinate)
  .setPopup(new maptilersdk.Popup({ offset: 25 })
    .setHTML(`<h5>${listing.location}</h5><p>Extract location after booking</p>`))
  .addTo(map);

