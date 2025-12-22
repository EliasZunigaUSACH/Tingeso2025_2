import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/v1/reports/');
}

const create = data => {
    return httpClient.post("/api/v1/reports/", data);
}

const get = id => {
    return httpClient.get(`/api/v1/reports/${id}`);
}

const remove = id => {
    return httpClient.delete(`/api/v1/reports/${id}`);
}

const getByDateRange = (startDate, endDate) => {
    return httpClient.get(`/api/v1/reports/dateRange`, { params: { startDate, endDate } });
}

export default { getAll, create, get, remove, getByDateRange};