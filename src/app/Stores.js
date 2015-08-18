import axios from 'axios';

const URL_ROOT = '/api/v1';

export function getPeople(filters) {
    return axios.get(`${URL_ROOT}/people`);
}

export function getTribes(filters) {
    return axios.get(`${URL_ROOT}/tribes`);
}

export function getProjects(filters) {
    return axios.get(`${URL_ROOT}/projects`);
}


