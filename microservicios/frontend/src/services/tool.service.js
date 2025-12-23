import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/tools/');
}

const create = data => {
    return httpClient.post("/tools/", data);
}

const get = id => {
    return httpClient.get(`/tools/${id}`);
}

const update = data => {
    return httpClient.put('/tools/', data);
}

const remove = id => {
    return httpClient.delete(`/tools/${id}`);
}

const getTop10 = () => {
    return httpClient.get('/tools/top10');
}

const getByStatus = status => {
    return httpClient.get(`/tools/status/${status}`);
}

const getByCategory = category => {
    return httpClient.get(`/tools/category/${category}`);
}

const getStock = toolName => {
    return httpClient.get(`/tools/stock/${toolName}`);
}

export default { getAll, create, get, update, remove, getTop10, getByStatus, getByCategory, getStock };