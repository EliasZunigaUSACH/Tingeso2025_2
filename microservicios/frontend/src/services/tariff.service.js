import HttpClient from "../http-common";

const get = () => {
    return HttpClient.get('/api/v1/tariff/');
}

const create = (data) => {
    return HttpClient.post("/api/v1/tariff/", data);
}

const update = (data) => {
    return HttpClient.put('/api/v1/tariff/', data);
}

export default { get, create, update };