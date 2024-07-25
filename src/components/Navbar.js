import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Frontend para API databaseFirst
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Button color="inherit" component={Link} to="/">Inicio</Button>
          <Button color="inherit" component={Link} to="/categorias">Categorías</Button>
          <Button color="inherit" component={Link} to="/clientes">Clientes</Button>
          <Button color="inherit" component={Link} to="/facturas">Facturas</Button>
          <Button color="inherit" component={Link} to="/productos">Productos</Button>
          <Button color="inherit" component={Link} to="/proveedores">Proveedores</Button>
          <Button color="inherit" component={Link} to="/ventas">Ventas</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
