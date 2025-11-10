import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { GlobalContext } from '../contexts/GlobalContext';
import './DefaultLayout.css';

function DefaultLayout() {
    const { isLoading } = useContext(GlobalContext);

    return (
        <div className="default-layout">
            <Navbar />
            <main className="main-content">
                {isLoading && <Loader />}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
