import React from 'react';
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap';

import './Header.css';

import Logo from '../Logo/Logo';

const Header = () => {
    return(
        <Row className="Header">
            <Col className="Logo" lg="2" md="3" sm="4" xs="6">
                <Logo className="LogoImg"/>
            </Col>
            <Col xs="auto">
                <Nav horizontal>
                    <NavItem>
                        <NavLink exact to="/">Add Movie</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink exact to="/mylist">My List</NavLink>
                    </NavItem>
                </Nav>
            </Col>
        </Row>
    )
}

export default Header;