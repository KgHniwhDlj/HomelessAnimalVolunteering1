import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AuthorizationPage from './pages/AuthorizationPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/AnimalPage';

function AdminRoute() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('current_user_id');
        navigate('/');
    };
    return <AdminPage onLogout={handleLogout} />;
}

function UserRoute() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('current_user_id');
        navigate('/');
    };
    return <UserPage onLogout={handleLogout} />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthorizationPage />} />
                <Route path="/admin" element={<AdminRoute />} />
                <Route path="/user" element={<UserRoute />} />
            </Routes>
        </BrowserRouter>
    );
}