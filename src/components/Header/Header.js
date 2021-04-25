import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';

import './Header.css';

import Logo from '../Logo/Logo';

const Header = () => {
    return(
        <Navbar className="Navbar" color="dark" expand="xl">
            <NavbarBrand>
                <Logo className="LogoImg"/>
            </NavbarBrand>
            <Nav>
                <NavItem>
                    <NavLink to="/" className="NavLink" activeClassName="Active" exact>Add Movie</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink to="/mylist" className="NavLink" activeClassName="Active">My List</NavLink>
                </NavItem>
            </Nav>
        </Navbar>
    )
}

export default Header;