const LOCAL_API_PATH = 'http://localhost:8000/api/v1';
const PROD_API_PATH = 'https://power.futurice.com/api/v1';

export default {
  API_PATH: __DEV__ ? LOCAL_API_PATH : PROD_API_PATH,
};
