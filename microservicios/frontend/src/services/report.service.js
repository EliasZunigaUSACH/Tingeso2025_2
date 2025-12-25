import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/reports/');
}

const create = data => {
    return httpClient.post("/api/reports/", data);
}

const get = id => {
    return httpClient.get(`/api/reports/${id}`);
}

const remove = id => {
    return httpClient.delete(`/api/reports/${id}`);
}

const getByDateRange = (startDate, endDate) => {
    return httpClient.get(`/api/reports/dateRange`, { params: { startDate, endDate } });
}

export default { getAll, create, get, remove, getByDateRange};