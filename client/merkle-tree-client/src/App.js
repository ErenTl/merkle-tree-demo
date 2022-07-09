import logo from './logo.svg';
import './App.css';

import {BrowserRouter, Route, Routes, NavLink} from 'react-router-dom';

import {WhiteListPage} from "./Pages/WhiteListPage";
import {MintPage} from "./Pages/MintPage";

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
            <NavLink className='btn btn-light btn-outline-primary' to='/mintpage'>
              Mint Page
            </NavLink>
          </li>
        </ul>
      </nav>  

      <Routes>
        <Route path="/whitelistpage" element={<WhiteListPage />} />
        <Route path="/mintpage" element={<MintPage />} />
      </Routes>

    </div>
    </BrowserRouter>
  );
}

export default App;
