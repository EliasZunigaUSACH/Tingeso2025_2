import HttpClient from "../http-common";

const get = () => {
    return HttpClient.get('/api/tariff/');
}

const create = (data) => {
    return HttpClient.post("/api/tariff/", data);
}

const update = (data) => {
    return HttpClient.put('/api/tariff/update', data);
}

export default { get, create, update };