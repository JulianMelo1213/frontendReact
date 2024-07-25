import api from './api';

const getProveedores = async () => {
  return await api.get('/proveedores');
};

const getProveedorById = async (id) => {
  return await api.get(`/proveedores/${id}`);
};

const createProveedor = async (data) => {
  return await api.post('/proveedores', data);
};

const updateProveedor = async (id, data) => {
  return await api.put(`/proveedores/${id}`, data);
};

const deleteProveedor = async (id) => {
  return await api.delete(`/proveedores/${id}`);
};

export { getProveedores, getProveedorById, createProveedor, updateProveedor, deleteProveedor };
