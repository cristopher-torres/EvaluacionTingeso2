import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get('/api/tools/getTools');
}

const create = (toolData, quantity, rut) => {
  return httpClient.post(`/api/tools/createTool/${quantity}/${rut}`, toolData);
};

const getStock = () => {
    return httpClient.get('/api/tools/stock');
}

const update = (tool, rut) => {
  return httpClient.put(`api/tools/updateTool/${tool.id}/${rut}`, tool);
};

const get = (id) => {
  return httpClient.get(`api/tools/getTool/${id}`);
}

const getAvailable = () => {
  return httpClient.get('/api/tools/available');
}  

export default { getAll, create, getStock, update, get, getAvailable };