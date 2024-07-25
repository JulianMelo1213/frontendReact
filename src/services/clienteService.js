import api from './api';

const getClientes = async () => {
  return await api.get('/clientes');
};

const getClienteById = async (id) => {
  return await api.get(`/clientes/${id}`);
};

const createCliente = async (data) => {
  return await api.post('/clientes', data);
};

const updateCliente = async (id, data) => {
  return await api.put(`/clientes/${id}`, data);
};

const deleteCliente = async (id) => {
  return await api.delete(`/clientes/${id}`);
};

export { getClientes, getClienteById, createCliente, updateCliente, deleteCliente };
