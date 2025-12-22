import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/v1/kardexRegisters/');
}

const get = id => {
    return httpClient.get(`/api/v1/kardexRegisters/${id}`);
}

const remove = id => {
    return httpClient.delete(`/api/v1/kardexRegisters/${id}`);
}

const getToolRegisters = toolId => {
    return httpClient.get(`/api/v1/kardexRegisters/tools/${toolId}`);
}

const getByDateRange = (startDate, endDate) => {
    return httpClient.get(`/api/v1/kardexRegisters/dateRange`, { params: { startDate, endDate } });
}

export default { getAll, get, remove, getToolRegisters, getByDateRange };