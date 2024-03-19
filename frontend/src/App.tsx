import {CssBaseline } from '@mui/material';
import AppToolbar from './components/UI/AppToolbar';
import { Route, Routes } from 'react-router-dom';
import Register from './features/users/Register';
import Login from './features/users/Login';
import ErrorPage from './components/ErrorPage/ErrorPage';
import PageChat from './features/chat/PageChat';

function App() {


  return (
    <>
      <CssBaseline/>
      <header>
        <AppToolbar/>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<PageChat />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<ErrorPage/>} />
        </Routes>
      </main>
    </>
  );
};

export default App
