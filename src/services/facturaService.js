import api from './api';

const getFacturas = async () => {
  return await api.get('/facturas');
};

const getFacturaById = async (id) => {
  return await api.get(`/facturas/${id}`);
};

const createFactura = async (data) => {
  return await api.post('/facturas', data);
};

const updateFactura = async (id, data) => {
  return await api.put(`/facturas/${id}`, data);
};

const deleteFactura = async (id) => {
  return await api.delete(`/facturas/${id}`);
};

export { getFacturas, getFacturaById, createFactura, updateFactura, deleteFactura };
