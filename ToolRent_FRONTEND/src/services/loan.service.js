import httpClient from "../http-common";

const createLoan = (data, rut, toolId) => {
    return httpClient.post(`/api/loans/createLoan/${rut}/${toolId}`, data);
};

export const returnLoan = (loanId, rut, damaged = false, irreparable = false) => {
    return httpClient.post(`/api/loans/returnLoan/${loanId}/${rut}?damaged=${damaged}&irreparable=${irreparable}`);
};

export const getLoans = () => {
    return httpClient.get("/api/loans/getLoans");
};

export const getActiveLoans = () => {
    return httpClient.get("/api/loans/loansActive");
};

export const updateFinePaid = (loanId, finePaid) => {
    return httpClient.put(`/api/loans/${loanId}/finePaid?finePaid=${finePaid}`);
};

export default { 
    returnLoan, 
    createLoan, 
    getActiveLoans, 
    getLoans, 
    updateFinePaid 
};