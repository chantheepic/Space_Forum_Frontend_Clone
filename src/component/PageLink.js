import React from 'react'
import { Link } from 'react-router-dom';
import { Col, Nav } from 'react-bootstrap';

const PageLink = (props) => {
    return (
        <Col>
            <Nav.Link as={Link} to={props.toLink} className='text-muted' style={{whiteSpace: 'nowrap', textDecoration: 'none'}}>
                {props.name}
            </Nav.Link>
        </Col>
    )
};

export default PageLink