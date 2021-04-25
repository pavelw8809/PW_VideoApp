import React from 'react';
import { Route } from 'react-router-dom';
import { Container } from 'reactstrap';

import Header from '../../components/Header/Header';
import Main from '../Main/Main';
import List from '../List/List';

import './Layout.css';

const Layout = () => {

    console.log(`${process.env.REACT_APP_APIKEY}`);
    return(
        <Container fluid className="p-0 Layout">
            <Header/>
            <Route path="/mylist" component={List}/>
            <Route path="/" exact component={Main}/>
        </Container>
    )
}

export default Layout;