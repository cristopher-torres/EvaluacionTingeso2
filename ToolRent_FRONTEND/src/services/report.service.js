import httpClient from "../http-common";

export const getActiveLoansReport = (startDate, endDate) => {
    return httpClient.get(`/api/reports/active-loans?startDate=${startDate}&endDate=${endDate}`);
};

export const getOverdueLoans = (startDate, endDate) => {
    let url = "/api/reports/overdue";
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return httpClient.get(url);
};

export const getTopToolsRanking = (startDate, endDate) => {
    let url = "/api/reports/ranking";
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return httpClient.get(url);
};

export const getUnpaidLoans = () => {
    return httpClient.get("/api/reports/unpaid");
}

export default { 
    getActiveLoansReport, 
    getOverdueLoans, 
    getTopToolsRanking, 
    getUnpaidLoans 
};