import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/tools/');
}

const create = data => {
    return httpClient.post("/api/tools/", data);
}

const get = id => {
    return httpClient.get(`/api/tools/${id}`);
}

const update = data => {
    return httpClient.put('/api/tools/update', data);
}

const remove = id => {
    return httpClient.delete(`/api/tools/${id}`);
}

const getTop10 = () => {
    return httpClient.get('/api/tools/top10');
}

const getByStatus = status => {
    return httpClient.get(`/api/tools/status/${status}`);
}

const getByCategory = category => {
    return httpClient.get(`/api/tools/category/${category}`);
}

const getStock = toolName => {
    return httpClient.get(`/api/tools/stock/${toolName}`);
}

export default { getAll, create, get, update, remove, getTop10, getByStatus, getByCategory, getStock };