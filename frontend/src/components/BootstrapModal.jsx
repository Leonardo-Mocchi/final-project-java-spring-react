import React from 'react';

function BootstrapModal({ show, title, message, onClose }) {
    if (!show) return null;
    // Custom modal theme
    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal">
                <div className="custom-modal-header">
                    <span className="custom-modal-title">{title}</span>
                    <button className="custom-modal-close" onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>
                <div className="custom-modal-body">
                    {message}
                </div>
                <div className="custom-modal-footer">
                    <button className="custom-modal-btn" onClick={onClose}>OK</button>
                </div>
            </div>
        </div>
    );
}

export default BootstrapModal;
