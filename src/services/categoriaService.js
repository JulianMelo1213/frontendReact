import api from './api';

const getCategorias = async () => {
  return await api.get('/categorias');
};

const getCategoriaById = async (id) => {
  return await api.get(`/categorias/${id}`);
};

const createCategoria = async (data) => {
  return await api.post('/categorias', data);
};

const updateCategoria = async (id, data) => {
  return await api.put(`/categorias/${id}`, data);
};

const deleteCategoria = async (id) => {
  return await api.delete(`/categorias/${id}`);
};

export { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };
