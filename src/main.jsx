import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RecoveryPage from './pages/RecoveryPage';
import RecoveryKeyPage from './pages/RecoveryKeyPage';
import UpKeepPage from './pages/UpKeepPage';
import MediationPage from './pages/MediationPage';
import ReservationsPage from './pages/ReservationsPage';
import RegisterPage from './pages/RegisterPage';
import AssemblyPage from './pages/AssemblyPage';
import ProfilePage from './pages/ProfilePage';
import OrderPage from './pages/OrderPage';
import RulesPage from './pages/RulesPage';
import FaqPage from './pages/FaqPage';
import RequestPage from './pages/RequestPage';
import NewsPage from './pages/NewsPage';
import FinancialPage from './pages/FinancialPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
            <Routes>
                <Route path='/' element={<SplashScreen/>} />
                <Route path='/login' element={<LoginPage/>} />
                <Route path='/home' element={<HomePage/>} />
                <Route path='/recovery' element={<RecoveryPage/>} />
                <Route path='/recoveryKey' element={<RecoveryKeyPage/>} />
                <Route path='/upKeep' element={<UpKeepPage/>} />
                <Route path='/mediation' element={<MediationPage/>} />
                <Route path='/reservations' element={<ReservationsPage/>} />
                <Route path='/register' element={<RegisterPage/>} />
                <Route path='/assembly' element={<AssemblyPage/>} />
                <Route path='/profile' element={<ProfilePage/>} />
                <Route path='/order' element={<OrderPage/>} />
                <Route path='/rules' element={<RulesPage/>} />
                <Route path='/faq' element={<FaqPage/>} />
                <Route path='/request' element={<RequestPage/>} />
                <Route path='/news' element={<NewsPage/>} />
                <Route path='/financial' element={<FinancialPage/>} />
            </Routes>
        </Router>
  </StrictMode>,
)
