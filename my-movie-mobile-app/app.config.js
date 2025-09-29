import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    API_KEY: process.env.API_KEY,
    HTTPS_DIRECTION: process.env.HTTPS_DIRECTION,
  },
});