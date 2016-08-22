import Geocoder from 'node-geocoder';

const options = {
  provider: 'google',

  httpAdapter: 'https',
  apiKey: '',
  formatter: null
};

const geocoder = Geocoder(options);

const geocode = (address) => {
  return geocoder.geocode(address)
    .then((list) => {
      const { latitude, longitude } = list[0];
      return [latitude, longitude];
    });
};

const createAddress = ({country, city, postalCode, street }) => {
  return `${country} ${city} ${postalCode} ${street}`;
};

export default { geocode, createAddress };
