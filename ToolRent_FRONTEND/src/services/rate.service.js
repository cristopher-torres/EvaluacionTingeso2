import httpClient from "../http-common";

const getGlobalRates = () => {
    return httpClient.get('/api/rates/global');
}

const setGlobalRates = (ratesData) => {
    return httpClient.post('/api/rates/global', ratesData);
}

const updateToolRate = (toolId, dailyRate, lateRate, replacementVal, rutAdmin) => {
    return httpClient.put(`/api/rates/tool/${toolId}`, null, {
        params: {
            dailyRate,
            lateRate,
            replacementVal,
            rutAdmin
        }
    });
}

export default { getGlobalRates, setGlobalRates, updateToolRate };