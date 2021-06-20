import React from 'react';
import { Container, Button, Media } from 'reactstrap';

import './MovieData.css';

const movieData = (props) => {

    let movieInfo;

    if (!props.title) {
        movieInfo = <h3>Error</h3>;
    } else {
        movieInfo = (
            <Container fluid className="MovieInfo">
                <Media onClick={props.preview} className="MovieCard">
                    <Media left>
                        <Media object src={props.image} alt={props.image} className="MovieImg"/>
                    </Media> 
                    <Media body className="align-self-center MovieCardBody">
                        <Media heading>
                            {props.title}
                        </Media>
                        <Button>Add to list</Button>
                    </Media>
                </Media>
            </Container>
        );
    }
    return(
        <div>
            {movieInfo}
        </div>
    )
}

export default movieData;