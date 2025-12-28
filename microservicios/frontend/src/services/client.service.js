import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/clients/');
}

const create = data => {
    return httpClient.post("/api/clients/", data);
}

const get = id => {
    return httpClient.get(`/api/clients/${id}`);
}

const update = data => {
    return httpClient.put('/api/clients/update', data);
}

const remove = id => {
    return httpClient.delete(`/api/clients/${id}`);
}
export default { getAll, create, get, update, remove };