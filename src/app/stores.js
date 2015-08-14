import axios from 'axios';

const URL_ROOT = '/api/v1';

export function getPeople(filters) {
    return axios.get(`${URL_ROOT}/people`);
}