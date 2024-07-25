import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Navbar from './components/Navbar';
import Categoria from './components/Categoria';
import Cliente from './components/Cliente';
import Factura from './components/Factura';
import Producto from './components/Producto';
import Proveedor from './components/Proveedor';
import Venta from './components/Venta';
import theme from './theme';
import './App.css';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" element={<div><h2>Bienvenido a la aplicación</h2><p>Selecciona una opción del menú para comenzar.</p></div>} />
            <Route path="/categorias" element={<Categoria />} />
            <Route path="/clientes" element={<Cliente />} />
            <Route path="/facturas" element={<Factura />} />
            <Route path="/productos" element={<Producto />} />
            <Route path="/proveedores" element={<Proveedor />} />
            <Route path="/ventas" element={<Venta />} />
            {/* Las rutas para los otros componentes se agregarán aquí */}
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
