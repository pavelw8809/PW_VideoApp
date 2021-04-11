import React from 'react';
import { Container } from 'reactstrap';

import Header from '../../components/Header/Header';

import './Layout.css';

const Layout = () => {
    return(
        <Container className="Layout" fluid={true}>
            <Header/>
        </Container>
    )
}

export default Layout;