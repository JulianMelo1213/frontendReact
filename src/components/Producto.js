import React, { useState, useEffect } from 'react';
import { getProductos, getProductoById, createProducto, updateProducto, deleteProducto } from '../services/productoService';
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
import '../styles/Productos.css';

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

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({ idProducto: 0, descripcion: '', precio: 0, idCategoria: 0, idProveedor: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await getProductos();
      setProductos(response.data);
    } catch (error) {
      setError('Error al cargar los productos.');
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
    if (!formData.descripcion || formData.descripcion.length > 100) {
      setError('La descripción es requerida y no puede exceder los 100 caracteres.');
      return;
    }
    if (formData.precio < 0) {
      setError('El precio debe ser un valor positivo.');
      return;
    }
    if (!formData.idCategoria || formData.idCategoria <= 0) {
      setError('El IdCategoria debe ser un valor positivo.');
      return;
    }
    if (!formData.idProveedor || formData.idProveedor <= 0) {
      setError('El IdProveedor debe ser un valor positivo.');
      return;
    }
    setLoading(true);
    try {
      if (isEditing) {
        await updateProducto(formData.idProducto, formData);
        setSuccessMessage('Producto actualizado con éxito.');
      } else {
        await createProducto(formData);
        setSuccessMessage('Producto agregado con éxito.');
      }
      fetchProductos();
      closeModal();
    } catch (error) {
      setError('Error al guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getProductoById(id);
      setFormData(response.data);
      setIsEditing(true);
      openModal();
    } catch (error) {
      setError('Error al cargar el producto.');
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteProducto(id);
      setSuccessMessage('Producto eliminado con éxito.');
      fetchProductos();
      closeConfirmDeleteModal();
    } catch (error) {
      setError('Error al eliminar el producto.');
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
    setFormData({ idProducto: 0, descripcion: '', precio: 0, idCategoria: 0, idProveedor: 0 });
    setIsEditing(false);
  };

  const openConfirmDeleteModal = (id) => {
    setProductoToDelete(id);
    setConfirmDeleteIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteIsOpen(false);
    setProductoToDelete(null);
  };

  return (
    <div className="container">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Productos
      </Typography>
      <Button variant="contained" color="primary" onClick={openModal}>
        Agregar Producto
      </Button>
      {loading && <Typography variant="body1">Cargando...</Typography>}
      {successMessage && <Typography variant="body1" color="primary">{successMessage}</Typography>}
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      <List>
        {productos.map((producto) => (
          <ListItem key={producto.idProducto} secondaryAction={
            <div>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(producto.idProducto)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => openConfirmDeleteModal(producto.idProducto)}>
                <DeleteIcon />
              </IconButton>
            </div>
          }>
            <ListItemText primary={`ID: ${producto.idProducto}, Descripción: ${producto.descripcion}, Precio: ${producto.precio}, IdCategoría: ${producto.idCategoria}, IdProveedor: ${producto.idProveedor}`} />
          </ListItem>
        ))}
      </List>

      <Modal open={modalIsOpen} onClose={closeModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {isEditing ? 'Editar Producto' : 'Agregar Producto'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Id Categoría"
              name="idCategoria"
              type="number"
              value={formData.idCategoria}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Id Proveedor"
              name="idProveedor"
              type="number"
              value={formData.idProveedor}
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
          <Typography variant="body1">¿Estás seguro de que deseas eliminar este producto?</Typography>
          <Button onClick={() => handleDelete(productoToDelete)} variant="contained" color="error" disabled={loading}>
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

export default Producto;
