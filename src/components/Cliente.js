import React, { useState, useEffect } from 'react';
import { getClientes, getClienteById, createCliente, updateCliente, deleteCliente } from '../services/clienteService';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import '../styles/Cliente.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ idCliente: 0, nombre: '', direccion: '', telefono: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await getClientes();
      setClientes(response.data);
    } catch (error) {
      setError('Error al cargar los clientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || formData.nombre.length > 100) {
      setError('El nombre es requerido y no puede exceder los 100 caracteres.');
      return;
    }
    if (formData.direccion && formData.direccion.length > 255) {
      setError('La dirección no puede exceder los 255 caracteres.');
      return;
    }
    if (formData.telefono && formData.telefono.length > 20) {
      setError('El teléfono no puede exceder los 20 caracteres.');
      return;
    }
    setLoading(true);
    try {
      if (isEditing) {
        await updateCliente(formData.idCliente, formData);
        setSuccessMessage('Cliente actualizado con éxito.');
      } else {
        await createCliente(formData);
        setSuccessMessage('Cliente agregado con éxito.');
      }
      fetchClientes();
      closeModal();
    } catch (error) {
      setError('Error al guardar el cliente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getClienteById(id);
      setFormData(response.data);
      setIsEditing(true);
      openModal();
    } catch (error) {
      setError('Error al cargar el cliente.');
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteCliente(id);
      setSuccessMessage('Cliente eliminado con éxito.');
      fetchClientes();
      closeConfirmDeleteModal();
    } catch (error) {
      setError('Error al eliminar el cliente.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
    setError('');
    setSuccessMessage('');
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({ idCliente: 0, nombre: '', direccion: '', telefono: '' });
    setIsEditing(false);
  };

  const openConfirmDeleteModal = (id) => {
    setClienteToDelete(id);
    setConfirmDeleteIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteIsOpen(false);
    setClienteToDelete(null);
  };

  return (
    <div className="container">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Clientes
      </Typography>
      <Button variant="contained" color="primary" onClick={openModal}>
        Agregar Cliente
      </Button>
      {loading && <Typography variant="body1">Cargando...</Typography>}
      {successMessage && <Typography variant="body1" color="primary">{successMessage}</Typography>}
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      <List>
        {clientes.map((cliente) => (
          <ListItem key={cliente.idCliente} secondaryAction={
            <div>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(cliente.idCliente)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => openConfirmDeleteModal(cliente.idCliente)}>
                <DeleteIcon />
              </IconButton>
            </div>
          }>
            <ListItemText primary={`${cliente.nombre} - ${cliente.direccion} - ${cliente.telefono}`} />
          </ListItem>
        ))}
      </List>

      <Modal open={modalIsOpen} onClose={closeModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {isEditing ? 'Editar Cliente' : 'Agregar Cliente'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            {error && <Typography variant="body2" color="error">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {isEditing ? 'Actualizar' : 'Agregar'}
            </Button>
            <Button onClick={closeModal} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
              Cancelar
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={confirmDeleteIsOpen} onClose={closeConfirmDeleteModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Confirmar Eliminación
          </Typography>
          <Typography variant="body1">¿Estás seguro de que deseas eliminar este cliente?</Typography>
          <Button onClick={() => handleDelete(clienteToDelete)} variant="contained" color="error" disabled={loading}>
            Eliminar
          </Button>
          <Button onClick={closeConfirmDeleteModal} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Cliente;
