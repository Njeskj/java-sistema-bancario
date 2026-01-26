import React, { useState, useEffect } from 'react';
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
  DarkMode,
  LightMode,
  Person,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import './Layout.css';

const drawerWidth = 240;

interface UserData {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone?: string;
  nacionalidade?: string;
  moedaPreferencial?: string;
  idioma?: string;
}

export default function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userInitials, setUserInitials] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Buscar dados do usuário do localStorage primeiro
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData(user);
        
        // Calcular iniciais
        const initials = getInitials(user.nome || '', user.sobrenome || '');
        setUserInitials(initials);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
      }
    }

    // Buscar dados atualizados do backend
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const usuarioId = localStorage.getItem('usuarioId');
      if (!usuarioId) {
        console.warn('usuarioId não encontrado no localStorage');
        return;
      }

      const response = await api.get(`/usuarios/${usuarioId}`);
      if (response.data) {
        const user = response.data;
        setUserData(user);
        
        // Atualizar localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('nomeCompleto', `${user.nome} ${user.sobrenome}`);
        
        // Calcular iniciais
        const initials = getInitials(user.nome || '', user.sobrenome || '');
        setUserInitials(initials);
      }
    } catch (error: any) {
      console.error('Erro ao buscar dados do usuário:', error);
      
      // Se der erro 401/403, não fazer logout automático aqui
      // O interceptor da API já trata isso
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        // Para outros erros, manter os dados do localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser && !userData) {
          try {
            const user = JSON.parse(storedUser);
            setUserData(user);
            const initials = getInitials(user.nome || '', user.sobrenome || '');
            setUserInitials(initials);
          } catch (e) {
            console.error('Erro ao parsear user do localStorage:', e);
          }
        }
      }
    }
  };

  const getInitials = (nome: string, sobrenome: string): string => {
    const firstInitial = nome.charAt(0).toUpperCase();
    const lastInitial = sobrenome.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}` || 'U';
  };

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('user');
    localStorage.removeItem('nomeCompleto');
    localStorage.removeItem('email');
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
            <button 
              className="btn btn-link text-dark p-2 theme-toggle"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            >
              {theme === 'dark' ? <LightMode /> : <DarkMode />}
            </button>
            
            <button className="btn btn-link text-dark p-2">
              <Notifications />
            </button>
            
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="link" 
                className="p-0 border-0 text-decoration-none"
                data-testid="user-menu-toggle"
              >
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar-circle" data-testid="user-avatar">
                    {userInitials || 'U'}
                  </div>
                  <div className="d-none d-md-block text-start">
                    <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }} data-testid="user-name">
                      {userData ? `${userData.nome} ${userData.sobrenome}` : 'Usuário'}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }} data-testid="user-email">
                      {userData?.email || ''}
                    </div>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.ItemText>
                  <div className="px-2 py-1">
                    <div className="fw-semibold">{userData ? `${userData.nome} ${userData.sobrenome}` : 'Usuário'}</div>
                    <div className="text-muted small">{userData?.email || ''}</div>
                    {userData?.cpf && (
                      <div className="text-muted small">CPF: {userData.cpf}</div>
                    )}
                  </div>
                </Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => navigateTo('/settings')} data-testid="dropdown-settings">
                  <Settings className="me-2" style={{ fontSize: '1.2rem' }} />
                  Configurações
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} data-testid="dropdown-logout">
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
                data-testid={`nav-${item.text.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.text}</span>
              </button>
            ))}
            <hr className="sidebar-divider" />
            <button
              className="sidebar-item"
              onClick={() => navigateTo('/settings')}
              data-testid="nav-settings"
            >
              <span className="sidebar-icon"><Settings /></span>
              <span>Configurações</span>
            </button>
            <button
              className="sidebar-item"
              onClick={handleLogout}
              data-testid="btn-logout"
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
                  data-testid={`nav-${item.text.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.text}</span>
                </button>
              ))}
              <hr className="sidebar-divider" />
              <button
                className="sidebar-item"
                onClick={() => navigateTo('/settings')}
                data-testid="nav-settings"
              >
                <span className="sidebar-icon"><Settings /></span>
                <span>Configurações</span>
              </button>
              <button
                className="sidebar-item"
                onClick={handleLogout}
                data-testid="btn-logout"
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
