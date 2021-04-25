import React from 'react';
import { Button } from 'reactstrap';

import './Modal.css';

const Modal = (props) => {
    return(
        <div style={{transform: props.show ? 'translateY(0)' : 'translate(-100vh)'}} className="Modal">
            This is a modal
            Info: {props.title}
            <Button onClick={props.hide}>
                CLOSE
            </Button>
        </div>
    )
}

export default Modal