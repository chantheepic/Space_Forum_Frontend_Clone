import React from 'react'
import { Toast } from 'react-bootstrap';

const TheToast = (props) => {
    return (
        <Toast show={props.display} onClose={() => props.action()}>
            <Toast.Header>
                <strong className='mr-auto'>Odyssey</strong>
            </Toast.Header>
            <Toast.Body>{props.message}</Toast.Body>
        </Toast>
    )
};

export default TheToast;