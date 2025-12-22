import httpClient from "../http-common";

export const getAllClients = () => {
    return httpClient.get('/api/users/getUsers');
}

export const createUser = (data) => {
  return httpClient.post(`/api/users/createUser`, data);
};

export const get = (id) => {
  return httpClient.get(`api/users/${id}`);
}

export const updateUserStatus = (userId, finePaid) => {
    return httpClient.put(`/api/users/${userId}/status?finePaid=${finePaid}`);
}

export const updateUser = (userId, data) => {
    return httpClient.put(`/api/users/${userId}`, data);
}

export default { getAllClients, createUser, get, updateUserStatus, updateUser };