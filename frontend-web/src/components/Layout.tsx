import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Offcanvas, Dropdown } from 'react-bootstrap';
import {
  Dashboard,
  SwapHoriz,
  Payment,
  TrendingUp,
  CreditCard,
  Settings,
  Logout,
  Menu as MenuIcon,
  Notifications,
} from '@mui/icons-material';
import './Layout.css';

const drawerWidth = 240;

export default function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Painel', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Transações', icon: <SwapHoriz />, path: '/transactions' },
    { text: 'Pagamentos', icon: <Payment />, path: '/payments' },
    { text: 'Investimentos', icon: <TrendingUp />, path: '/investments' },
    { text: 'Cartões', icon: <CreditCard />, path: '/cards' },
  ];

  const navigateTo = (path: string) => {
    navigate(path);
    handleCloseSidebar();
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar superior */}
      <Navbar bg="white" expand="lg" className="shadow-sm fixed-top">
        <Container fluid>
          <button 
            className="btn btn-link d-lg-none p-0 me-3 text-dark"
            onClick={handleShowSidebar}
          >
            <MenuIcon />
          </button>
          
          <Navbar.Brand className="fw-bold gradient-text d-none d-lg-block">
            💳 IBank
          </Navbar.Brand>
          
          <Navbar.Brand className="fw-bold d-lg-none">
            Sistema Bancário
          </Navbar.Brand>
          
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-link text-dark p-2">
              <Notifications />
            </button>
            
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="p-0 border-0 text-decoration-none">
                <div className="avatar-circle">IS</div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigateTo('/settings')}>
                  <Settings className="me-2" style={{ fontSize: '1.2rem' }} />
                  Configurações
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <Logout className="me-2" style={{ fontSize: '1.2rem' }} />
                  Sair
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      <div className="d-flex flex-grow-1" style={{ marginTop: '56px' }}>
        {/* Sidebar Desktop */}
        <div className="d-none d-lg-block sidebar-desktop">
          <div className="sidebar-header">
            <h5 className="mb-0 text-white fw-bold">💳 IBank</h5>
          </div>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.text}
                className="sidebar-item"
                onClick={() => navigateTo(item.path)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.text}</span>
              </button>
            ))}
            <hr className="sidebar-divider" />
            <button
              className="sidebar-item"
              onClick={() => navigateTo('/settings')}
            >
              <span className="sidebar-icon"><Settings /></span>
              <span>Configurações</span>
            </button>
            <button
              className="sidebar-item"
              onClick={handleLogout}
            >
              <span className="sidebar-icon"><Logout /></span>
              <span>Sair</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Mobile (Offcanvas) */}
        <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="start">
          <Offcanvas.Header closeButton className="sidebar-header-mobile">
            <Offcanvas.Title className="text-white fw-bold">
              💳 IBank
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0">
            <nav className="sidebar-nav">
              {menuItems.map((item) => (
                <button
                  key={item.text}
                  className="sidebar-item"
                  onClick={() => navigateTo(item.path)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.text}</span>
                </button>
              ))}
              <hr className="sidebar-divider" />
              <button
                className="sidebar-item"
                onClick={() => navigateTo('/settings')}
              >
                <span className="sidebar-icon"><Settings /></span>
                <span>Configurações</span>
              </button>
              <button
                className="sidebar-item"
                onClick={handleLogout}
              >
                <span className="sidebar-icon"><Logout /></span>
                <span>Sair</span>
              </button>
            </nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Conteúdo principal */}
        <main className="flex-grow-1 main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
