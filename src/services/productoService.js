import api from './api';

const getProductos = async () => {
  return await api.get('/productos');
};

const getProductoById = async (id) => {
  return await api.get(`/productos/${id}`);
};

const createProducto = async (data) => {
  return await api.post('/productos', data);
};

const updateProducto = async (id, data) => {
  return await api.put(`/productos/${id}`, data);
};

const deleteProducto = async (id) => {
  return await api.delete(`/productos/${id}`);
};

export { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };
