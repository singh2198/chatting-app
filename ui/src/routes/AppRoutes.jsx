import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../../src/Component/App';
import Register from '../Component/Register.jsx';
import AuthForm from '../Component/AuthForm.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/Register" element={<Register />} />
      <Route path='/authuser' element={<AuthForm/>} />
      <Route 
        path="/chat" 
        element={
            <App></App>
        } 
      />
      {/* 404 Fallback Route */}
      <Route path="*" element={<p>404 - Not Found</p>} />
    </Routes>
  );
};

export default AppRoutes;
