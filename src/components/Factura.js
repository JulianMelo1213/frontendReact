import React, { useState, useEffect } from 'react';
import { getFacturas, getFacturaById, createFactura, updateFactura, deleteFactura } from '../services/facturaService';
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
import '../styles/Factura.css';

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

const Factura = () => {
  const [facturas, setFacturas] = useState([]);
  const [formData, setFormData] = useState({ idFactura: 0, fecha: '', idCliente: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [facturaToDelete, setFacturaToDelete] = useState(null);

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    setLoading(true);
    try {
      const response = await getFacturas();
      setFacturas(response.data);
    } catch (error) {
      setError('Error al cargar las facturas.');
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
    if (!formData.fecha) {
      setError('La fecha es requerida.');
      return;
    }
    if (!formData.idCliente || formData.idCliente <= 0) {
      setError('El IdCliente debe ser un valor positivo.');
      return;
    }
    setLoading(true);
    try {
      if (isEditing) {
        await updateFactura(formData.idFactura, formData);
        setSuccessMessage('Factura actualizada con éxito.');
      } else {
        await createFactura(formData);
        setSuccessMessage('Factura agregada con éxito.');
      }
      fetchFacturas();
      closeModal();
    } catch (error) {
      setError('Error al guardar la factura.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getFacturaById(id);
      setFormData(response.data);
      setIsEditing(true);
      openModal();
    } catch (error) {
      setError('Error al cargar la factura.');
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteFactura(id);
      setSuccessMessage('Factura eliminada con éxito.');
      fetchFacturas();
      closeConfirmDeleteModal();
    } catch (error) {
      setError('Error al eliminar la factura.');
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
    setFormData({ idFactura: 0, fecha: '', idCliente: 0 });
    setIsEditing(false);
  };

  const openConfirmDeleteModal = (id) => {
    setFacturaToDelete(id);
    setConfirmDeleteIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteIsOpen(false);
    setFacturaToDelete(null);
  };

  return (
    <div className="container">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Facturas
      </Typography>
      <Button variant="contained" color="primary" onClick={openModal}>
        Agregar Factura
      </Button>
      {loading && <Typography variant="body1">Cargando...</Typography>}
      {successMessage && <Typography variant="body1" color="primary">{successMessage}</Typography>}
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      <List>
        {facturas.map((factura) => (
          <ListItem key={factura.idFactura} secondaryAction={
            <div>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(factura.idFactura)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => openConfirmDeleteModal(factura.idFactura)}>
                <DeleteIcon />
              </IconButton>
            </div>
          }>
            <ListItemText primary={`ID: ${factura.idFactura}, Fecha: ${factura.fecha}, Cliente ID: ${factura.idCliente}`} />
          </ListItem>
        ))}
      </List>

      <Modal open={modalIsOpen} onClose={closeModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {isEditing ? 'Editar Factura' : 'Agregar Factura'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Id Cliente"
              name="idCliente"
              type="number"
              value={formData.idCliente}
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
          <Typography variant="body1">¿Estás seguro de que deseas eliminar esta factura?</Typography>
          <Button onClick={() => handleDelete(facturaToDelete)} variant="contained" color="error" disabled={loading}>
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

export default Factura;
