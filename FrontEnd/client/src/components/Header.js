import React from 'react';
import '../designs/Header.css'; // נתיב לקובץ ה-CSS של ה-Header

const Header = () => {
    return (
        <header className="header">
            <div className="title">
                Dependencies Planner PRD
            </div>
            <div className="logo-container">
                <img src="Practicum.png" alt="Company Logo" className="logo" />
            </div>
        </header>
    );
};

export default Header;
