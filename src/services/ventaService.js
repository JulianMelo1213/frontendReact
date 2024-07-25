import api from './api';

const getVentas = async () => {
  return await api.get('/ventas');
};

const getVentaById = async (id) => {
  return await api.get(`/ventas/${id}`);
};

const createVenta = async (data) => {
  return await api.post('/ventas', data);
};

const updateVenta = async (id, data) => {
  return await api.put(`/ventas/${id}`, data);
};

const deleteVenta = async (id) => {
  return await api.delete(`/ventas/${id}`);
};

export { getVentas, getVentaById, createVenta, updateVenta, deleteVenta };
