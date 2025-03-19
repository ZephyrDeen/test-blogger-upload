import React from 'react';

const HomePage = ({ onRecordClick }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'sans-serif' }}>

            {/* Header Section */}
            <div style={{ textAlign: 'center' }}>
                <h1>Auto Blogger</h1>
                <p>Welcome to the Auto Blogger</p>
            </div>

            <div style={{ textAlign: 'left' }}>
                <button
                    onClick={onRecordClick}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007ac9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Create a new blog
                </button>
            </div>

            {/* Favourites Section */}
            <div>
                <h3>Favourites</h3>
            </div>

            {/* All Other Blogs Section */}
            <div>
                <h3>All other blogs</h3>
            </div>
        </div>
    );
};

export default HomePage;