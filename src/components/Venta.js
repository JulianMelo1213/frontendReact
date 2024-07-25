import React, { useState, useEffect } from 'react';
import { getVentas, getVentaById, createVenta, updateVenta, deleteVenta } from '../services/ventaService';
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
import '../styles/Venta.css';

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

const Venta = () => {
  const [ventas, setVentas] = useState([]);
  const [formData, setFormData] = useState({ idVenta: 0, idFactura: 0, idProducto: 0, cantidad: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ventaToDelete, setVentaToDelete] = useState(null);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    setLoading(true);
    try {
      const response = await getVentas();
      setVentas(response.data);
    } catch (error) {
      setError('Error al cargar las ventas.');
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
    if (!formData.idFactura || formData.idFactura <= 0) {
      setError('El IdFactura debe ser un valor positivo.');
      return;
    }
    if (!formData.idProducto || formData.idProducto <= 0) {
      setError('El IdProducto debe ser un valor positivo.');
      return;
    }
    if (!formData.cantidad || formData.cantidad <= 0) {
      setError('La Cantidad debe ser un valor positivo.');
      return;
    }
    setLoading(true);
    try {
      if (isEditing) {
        await updateVenta(formData.idVenta, formData);
        setSuccessMessage('Venta actualizada con éxito.');
      } else {
        await createVenta(formData);
        setSuccessMessage('Venta agregada con éxito.');
      }
      fetchVentas();
      closeModal();
    } catch (error) {
      setError('Error al guardar la venta.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getVentaById(id);
      setFormData(response.data);
      setIsEditing(true);
      openModal();
    } catch (error) {
      setError('Error al cargar la venta.');
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteVenta(id);
      setSuccessMessage('Venta eliminada con éxito.');
      fetchVentas();
      closeConfirmDeleteModal();
    } catch (error) {
      setError('Error al eliminar la venta.');
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
    setFormData({ idVenta: 0, idFactura: 0, idProducto: 0, cantidad: 0 });
    setIsEditing(false);
  };

  const openConfirmDeleteModal = (id) => {
    setVentaToDelete(id);
    setConfirmDeleteIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteIsOpen(false);
    setVentaToDelete(null);
  };

  return (
    <div className="container">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Ventas
      </Typography>
      <Button variant="contained" color="primary" onClick={openModal}>
        Agregar Venta
      </Button>
      {loading && <Typography variant="body1">Cargando...</Typography>}
      {successMessage && <Typography variant="body1" color="primary">{successMessage}</Typography>}
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      <List>
        {ventas.map((venta) => (
          <ListItem key={venta.idVenta} secondaryAction={
            <div>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(venta.idVenta)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => openConfirmDeleteModal(venta.idVenta)}>
                <DeleteIcon />
              </IconButton>
            </div>
          }>
            <ListItemText primary={`ID: ${venta.idVenta}, IdFactura: ${venta.idFactura}, IdProducto: ${venta.idProducto}, Cantidad: ${venta.cantidad}`} />
          </ListItem>
        ))}
      </List>

      <Modal open={modalIsOpen} onClose={closeModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {isEditing ? 'Editar Venta' : 'Agregar Venta'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Id Factura"
              name="idFactura"
              type="number"
              value={formData.idFactura}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Id Producto"
              name="idProducto"
              type="number"
              value={formData.idProducto}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad}
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
          <Typography variant="body1">¿Estás seguro de que deseas eliminar esta venta?</Typography>
          <Button onClick={() => handleDelete(ventaToDelete)} variant="contained" color="error" disabled={loading}>
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

export default Venta;
