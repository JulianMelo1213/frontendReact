import React, { useState, useEffect } from 'react';
import { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria } from '../services/categoriaService';
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
import '../styles/Categoria.css';

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

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({ idCategoria: 0, descripcion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await getCategorias();
      setCategorias(response.data);
    } catch (error) {
      setError('Error al cargar las categorías.');
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
    setLoading(true);
    try {
      if (isEditing) {
        await updateCategoria(formData.idCategoria, formData);
        setSuccessMessage('Categoría actualizada con éxito.');
      } else {
        await createCategoria(formData);
        setSuccessMessage('Categoría agregada con éxito.');
      }
      fetchCategorias();
      closeModal();
    } catch (error) {
      setError('Error al guardar la categoría.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getCategoriaById(id);
      setFormData(response.data);
      setIsEditing(true);
      openModal();
    } catch (error) {
      setError('Error al cargar la categoría.');
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteCategoria(id);
      setSuccessMessage('Categoría eliminada con éxito.');
      fetchCategorias();
      closeConfirmDeleteModal();
    } catch (error) {
      setError('Error al eliminar la categoría.');
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
    setFormData({ idCategoria: 0, descripcion: '' });
    setIsEditing(false);
  };

  const openConfirmDeleteModal = (id) => {
    setCategoriaToDelete(id);
    setConfirmDeleteIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteIsOpen(false);
    setCategoriaToDelete(null);
  };

  return (
    <div className="container">
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Categorías
      </Typography>
      <Button variant="contained" color="primary" onClick={openModal}>
        Agregar Categoría
      </Button>
      {loading && <Typography variant="body1">Cargando...</Typography>}
      {successMessage && <Typography variant="body1" color="primary">{successMessage}</Typography>}
      {error && <Typography variant="body1" color="error">{error}</Typography>}
      <List>
        {categorias.map((categoria) => (
          <ListItem key={categoria.idCategoria} secondaryAction={
            <div>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(categoria.idCategoria)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => openConfirmDeleteModal(categoria.idCategoria)}>
                <DeleteIcon />
              </IconButton>
            </div>
          }>
            <ListItemText primary={categoria.descripcion} />
          </ListItem>
        ))}
      </List>

      <Modal open={modalIsOpen} onClose={closeModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {isEditing ? 'Editar Categoría' : 'Agregar Categoría'}
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
          <Typography variant="body1">¿Estás seguro de que deseas eliminar esta categoría?</Typography>
          <Button onClick={() => handleDelete(categoriaToDelete)} variant="contained" color="error" disabled={loading}>
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

export default Categoria;
