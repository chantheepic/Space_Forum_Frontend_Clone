import React from 'react'
import {Col, Form, Row} from 'react-bootstrap';

const FormRow = (props) => {
    return (
        <Form.Group>
            <Row>
                <Col xs={2}>
                    <Form.Label htmlFor={props.id}>{props.name}</Form.Label>
                </Col>
                <Col xs={10}>
                    <Form.Control id={props.id} type={props.type} placeholder={props.hold} disabled={props.modify}
                                  value={props.filled} onChange={(field) => props.action({[props.id]: field.target.value})}/>
                </Col>
            </Row>
        </Form.Group>
    )
};

export default FormRow;