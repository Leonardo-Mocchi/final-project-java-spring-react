import { useNavigate } from 'react-router-dom';

export default function CheckoutCancel() {
    const navigate = useNavigate();

    return (
        <div className="container py-5">
            <div className="text-center">
                <i className="fas fa-times-circle fa-5x text-warning mb-3"></i>
                <h1>Payment Cancelled</h1>
                <p className="lead mb-4">Your order was not completed</p>
                
                <div className="alert alert-info mx-auto" style={{ maxWidth: '600px' }}>
                    <p className="mb-0">
                        Don't worry! No charges were made to your account.
                        Your items are still in your cart.
                    </p>
                </div>

                <div className="mt-4">
                    <button className="btn btn-primary me-2" onClick={() => navigate('/checkout')}>
                        <i className="fas fa-shopping-cart me-2"></i>
                        Return to Cart
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/games')}>
                        <i className="fas fa-gamepad me-2"></i>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
