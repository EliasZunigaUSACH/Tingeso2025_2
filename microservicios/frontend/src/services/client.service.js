import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/clients/');
}

const create = data => {
    return httpClient.post("/clients/", data);
}

const get = id => {
    return httpClient.get(`/clients/${id}`);
}

const update = data => {
    return httpClient.put('/clients/', data);
}

const remove = id => {
    return httpClient.delete(`/clients/${id}`);
}
export default { getAll, create, get, update, remove };