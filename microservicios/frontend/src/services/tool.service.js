import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/v1/tools/');
}

const create = data => {
    return httpClient.post("/api/v1/tools/", data);
}

const get = id => {
    return httpClient.get(`/api/v1/tools/${id}`);
}

const update = data => {
    return httpClient.put('/api/v1/tools/', data);
}

const remove = id => {
    return httpClient.delete(`/api/v1/tools/${id}`);
}

const getTop10 = () => {
    return httpClient.get('/api/v1/tools/top10');
}

const getByStatus = status => {
    return httpClient.get(`/api/v1/tools/status/${status}`);
}

const getByCategory = category => {
    return httpClient.get(`/api/v1/tools/category/${category}`);
}

const getStock = toolName => {
    return httpClient.get(`/api/v1/tools/stock/${toolName}`);
}

export default { getAll, create, get, update, remove, getTop10, getByStatus, getByCategory, getStock };