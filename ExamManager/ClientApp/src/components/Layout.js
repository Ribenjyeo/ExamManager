import React from 'react';
import NavBar from './NavBar/NavBar';

function Layout(props) {

    return (
        <div>
            <NavBar userName="Илья" items={
                [
                    {
                        href: "/home",
                        title: "Главная"
                    }
                ]
            } />
            <div className="container">
                {props.children}
            </div>
        </div>
    );
}

function fetchUserData() {

}

export default Layout;