import httpClient from "../http-common";

export const getMovementsByTool = (toolId) => {
  return httpClient.get(`/api/kardex/tool/${toolId}`);
};

export const getMovementsByDateRange = (start, end) => {
  return httpClient.get(`/api/kardex/dates?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
};

export default {getMovementsByTool, getMovementsByDateRange };
