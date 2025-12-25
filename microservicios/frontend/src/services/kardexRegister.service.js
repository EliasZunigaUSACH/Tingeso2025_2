import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/kardex/');
}

const get = id => {
    return httpClient.get(`/api/kardex/${id}`);
}

const remove = id => {
    return httpClient.delete(`/api/kardex/${id}`);
}

const getToolRegisters = toolId => {
    return httpClient.get(`/api/kardex/tools/${toolId}`);
}

const getByDateRange = (startDate, endDate) => {
    return httpClient.get(`/api/kardex/dateRange`, { params: { startDate, endDate } });
}

export default { getAll, get, remove, getToolRegisters, getByDateRange };