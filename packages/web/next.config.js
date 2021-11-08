module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    });

    return config;
  },
  images: {
    domains: ['www.sushanttravels.com', 'www.tarasportrafting.com', 'localhost', 'http://dummyimage.com']
  },
  env: {
    mapbox_key: 'pk.eyJ1IjoicGljb3p6aW1pY2hlbGUiLCJhIjoiY2t0YjZtZmpuMXQ0dDJ2bjloM3ZxM2R2dyJ9.vpLuQlobE_kubcyl02VIdg'
  }
};
