import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import FormRow from '../component/FormRow';
import TheToast from '../component/TheToast';
import UserService from '../service/UserService';

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.service = UserService.getInstance();
        this.state = {
            nickname: '',
            username: '',
            password: '',
            verify: '',
            errorMessage: '',
            showMessage: false,
            admin: false,
            showPassword: false
        }
    }

    uploadUser = () => {
        if (this.state.nickname && this.state.username && this.state.password && this.state.verify) {
            if (this.state.password === this.state.verify) {
                this.service.createUser({username: this.state.username, alias: this.state.nickname,
                    password: this.state.password, admin: this.state.admin})
                    .then(data => this.props.history.push(`/home/${data.token}`))
            }
            else {
                this.setState({errorMessage: 'Passwords do not match', showMessage: true})
            }
        }
        else {
            this.setState({errorMessage: 'Please fill out all fields', showMessage: true})
        }
    };

    upstreamFieldChange = (change) => {
        this.setState(change);
    };

    toggleDisplay = () => {
        this.setState({showMessage: !this.state.showMessage});
    };

    toggleAdmin = () => {
        this.setState({admin: !this.state.admin});
    };

    togglePassword = () => {
        this.setState({showPassword: !this.state.showPassword});
    };

    render() {
        const passwordField = this.state.showPassword
            ? <FormRow id='password' name='Password' hold='Password' action={this.upstreamFieldChange}/>
            : <FormRow id='password' name='Password' hold='Password' type='password' action={this.upstreamFieldChange}/>;

        return (
            <Container>
                <Row className='align-items-center'>
                    <Col xs={8}>
                        <h1 className='odys-spacing'>Sign Up</h1>
                    </Col>
                    <Col xs={4}>
                        <TheToast display={this.state.showMessage}
                                  message={this.state.errorMessage}
                                  action={this.toggleDisplay}/>
                    </Col>
                </Row>
                <Form>
                    <FormRow id='username' name='Username' hold='Username' action={this.upstreamFieldChange}/>
                    <FormRow id='nickname' name='Nickname' hold='Nickname' action={this.upstreamFieldChange}/>
                    {passwordField}
                    <Form.Group controlId='passwordCheck'>
                        <Row>
                            <Col xs={2}/>
                            <Col xs={10}>
                            <Form.Check type='checkbox'
                                        label='Show password'
                                        checked={this.state.showPassword}
                                        onChange={() => this.togglePassword()}/>
                            </Col>
                        </Row>
                    </Form.Group>
                    <FormRow id='verify' name='Verify Password' hold='Verify Password' type='password' action={this.upstreamFieldChange}/>
                    <Form.Group controlId='adminCheck'>
                        <Form.Check type='checkbox'
                                    label='Admin'
                                    checked={this.state.admin}
                                    onChange={() => this.toggleAdmin()}/>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col sm={2}/>
                            <Col sm={10}>
                                <Button block variant='primary' onClick={() => this.uploadUser()}>Register</Button>
                                <Row>
                                    <Col>
                                        <Link to='/login' className='float-right'>
                                            Already have an account? Sign in</Link>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}

export default withRouter(RegisterPage)