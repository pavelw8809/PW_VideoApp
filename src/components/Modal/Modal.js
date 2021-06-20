import React, {useRef} from 'react';
import { Button } from 'reactstrap';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';

import './Modal.css';
import { findDOMNode } from 'react-dom';

const Modal = (props) => {

    let player = useRef();

    const fsc = () => {
        screenfull.request(findDOMNode(player.current))
    }

    console.log(props.url);

    return(
        <div style={{transform: props.show ? 'translateY(0)' : 'translate(-150%)'}} className="Modal">
            <p>This is a modal</p>
            <ReactPlayer 
                url={props.url}
                ref={player}
                width="100%"
            />
            <p>{props.title}</p>
            <Button className="ModalBtn" color="warning" onClick={props.hide}>
                CLOSE
            </Button>
            <Button className="ModalBtn" color="primary" onClick={fsc}>
                FULLSCREEN
            </Button>
        </div>
    )
}

export default Modal