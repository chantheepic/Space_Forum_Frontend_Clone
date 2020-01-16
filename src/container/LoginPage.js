import React from 'react'
import FormRow from '../component/FormRow'
import { Container, Col, Row, Button, Form } from 'react-bootstrap'
import UserService from '../service/UserService';
import TheToast from '../component/TheToast';
import { Link, withRouter } from 'react-router-dom';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.service = UserService.getInstance();
        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            showMessage: false,
            showPassword: false
        }
    }

    loginUser = () => {
        if (this.state.username && this.state.password) {
            this.service.findUserInfo({username: this.state.username, password: this.state.password})
                .then(data => {
                    if (data) {
                        if (data.user.banned) {
                            this.setState({errorMessage: 'You have been banned, loser', showMessage: true})
                        }
                        else {
                            this.props.history.push(`/home/${data.token}`)
                        }
                    }
                    else {
                        this.setState({errorMessage: 'Invalid user details', showMessage: true})
                    }
                })
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
                        <h1 className='odys-spacing'>Sign In</h1>
                    </Col>
                    <Col xs={4}>
                        <TheToast display={this.state.showMessage}
                                  message={this.state.errorMessage}
                                  action={this.toggleDisplay}/>
                    </Col>
                </Row>
                <Form>
                    <FormRow id='username' name='Username' hold='Username' action={this.upstreamFieldChange}/>
                    {passwordField}
                    <Form.Group controlId='formBasicCheckbox'>
                        <Row>
                            <Col xs={2}>
                            </Col>
                            <Col xs={10}>
                                <Form.Check type='checkbox'
                                            label='Show password'
                                            checked={this.state.showPassword}
                                            onChange={() => this.togglePassword()}/>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col xs={2}/>
                            <Col xs={10}>
                                <Button block variant='primary' onClick={() => this.loginUser()}>Sign in</Button>
                                <Row>
                                    <Col>
                                        <Link to='/register' className='float-right'>
                                            Don't have an account? Sign up</Link>
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

export default withRouter(LoginPage)