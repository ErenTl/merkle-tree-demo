import logo from './logo.svg';
import './App.css';

import {BrowserRouter, Route, Routes, NavLink} from 'react-router-dom';

import {WhiteListPage} from "./Pages/WhiteListPage";
import {SigningPage} from "./Pages/SigningPage";
import {SignEIP712Page} from "./Pages/SignEIP712Page";

function App() {
  return (
    <BrowserRouter>
    <div className="App">

      <nav className='navbar navbar-expand-sm bg-light navbar-dark'>
        <ul className='navbar-nav'>
          <li className='nav-item- m-1'>
            <NavLink className='btn btn-light btn-outline-primary' to='/whitelistpage'>
              White List Page
            </NavLink>
            <NavLink className='btn btn-light btn-outline-primary' to='/signingpage'>
              Signing Page
            </NavLink>
            <NavLink className='btn btn-light btn-outline-primary' to='/signing712page'>
              Signing EIP-712 Page
            </NavLink>
          </li>
        </ul>
      </nav>  

      <Routes>
        <Route path="/whitelistpage" element={<WhiteListPage />} />
        <Route path="/signingpage" element={<SigningPage />} />
        <Route path="/signing712page" element={<SignEIP712Page />} />
      </Routes>

    </div>
    </BrowserRouter>
  );
}

export default App;
