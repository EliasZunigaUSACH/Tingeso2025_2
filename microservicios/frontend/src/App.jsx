import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { useKeycloak } from "@react-keycloak/web";
import Navbar from "./components/Navbar"
import Home from './components/Home';
import ClientList from './components/ClientList';
import AddClient from './components/AddClient';
import ToolList from './components/ToolList';
import AddTool from './components/AddTool';
import EditTool from './components/EditTool';
import Kardex from './components/Kardex';
import AddLoan from './components/AddLoan';
import EditLoan from './components/EditLoan';
import NotFound from './components/NotFound';
import Reports from './components/ReportList';
import LoanList from './components/LoanList';
import Tariff from './components/Tariff';
import TariffEdit from './components/EditTariff';

function App() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <div>Cargando...</div>;

  const isLoggedIn = keycloak.authenticated;
  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

  const PrivateRoute = ({ element, rolesAllowed }) => {
    if (!isLoggedIn) {
      keycloak.login();
      return null;
    }
    if (rolesAllowed && !rolesAllowed.some(r => roles.includes(r))) {
      return <h2>No tienes permiso para ver esta página</h2>;
    }
    return element;
  };

  if (!isLoggedIn) { 
    keycloak.login(); 
    return null; 
  }  

  return (
      <Router>
        <div className='gradient-background'>
          <div className="container">
          <Navbar></Navbar>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/home" element={<Home/>} />
              <Route path="/client/list" element={<PrivateRoute element={<ClientList/>} rolesAllowed={['ADMIN', 'USER']} />} />
              <Route path="/client/add" element={<PrivateRoute element={<AddClient/>} rolesAllowed={['ADMIN']} />} />
              <Route path="/client/edit/:id" element={<PrivateRoute element={<AddClient/>} rolesAllowed={['ADMIN']} />} />
              <Route path="/tool/list" element={<PrivateRoute element={<ToolList/>} rolesAllowed={['ADMIN', 'USER']} />} />
              <Route path="/tool/add" element={<PrivateRoute element={<AddTool/>} rolesAllowed={['ADMIN']} />} />
              <Route path="/tool/edit/:id" element={<PrivateRoute element={<EditTool/>} rolesAllowed={['ADMIN']} />} />
              <Route path="/report/list" element={<PrivateRoute element={<Reports/>} rolesAllowed={['ADMIN', 'USER']} />} />
              <Route path="/kardex" element={<PrivateRoute element={<Kardex/>} rolesAllowed={['ADMIN', 'USER']} />} />
              <Route path="/loan/list" element={<PrivateRoute element={<LoanList/>} rolesAllowed={['ADMIN', 'USER']} />} />
              <Route path="/loan/add" element={<PrivateRoute element={<AddLoan/>} rolesAllowed={['ADMIN', 'USER']} />} />
              <Route path="/loan/edit/:id" element={<PrivateRoute element={<EditLoan/>} rolesAllowed={['ADMIN', 'USER']} />} />
              <Route path="/tariff" element={<PrivateRoute element={<Tariff/>} rolesAllowed={['ADMIN', 'USER']} />} />
              <Route path="/tariff/edit" element={<PrivateRoute element={<TariffEdit/>} rolesAllowed={['ADMIN']} />} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App