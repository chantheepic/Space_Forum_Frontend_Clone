import React from 'react'
import {Button, Col, Container, Form, ListGroup, Row, Tab, Tabs} from 'react-bootstrap';
import FormRow from '../component/FormRow';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService';
import TheToast from '../component/TheToast';
import ThreadService from '../service/ThreadService';

export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.userService = UserService.getInstance();
        this.threadService = ThreadService.getInstance();
        this.state = {
            session: props.session,
            profileId: props.profileId,
            viewName: props.viewName,
            userThreads: [],
            currentUserFollows: [],
            currentUserId: null,
            username: '',
            password: '',
            nickname: '',
            message: '',
            showMessage: false,
            showAccount: false,
            showPassword: false,
            isFollowing: false
        }
    }
    
    componentDidMount() {
        this.validateUser();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({session: nextProps.session, profileId: nextProps.profileId, viewName: nextProps.viewName})
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.profileId !== this.state.profileId) {
            this.validateUser();
        }
    }

    validateUser = () => {
        if (this.state.session) {
            this.userService.findUserByToken(this.state.session).then(data => {
                if (data) {
                    const follow = data.following.map(user => user.id);
                    this.setState({currentUserId: data.id, currentUserFollows: follow, username: data.username, password: data.password,
                        nickname: data.alias, showAccount: data.id === this.state.profileId, isFollowing: follow.includes(this.state.profileId)})
                }
            });
        }

        if (this.state.profileId) {
            this.threadService.findAllThreads().then(data =>
                this.setState({ userThreads: data.filter(thread => thread.author.id === this.state.profileId)}));
        }
    };

    upstreamFieldChange = (change) => {
        this.setState(change);
    };
    
    sendUpdate = () => {
        if (this.state.nickname || this.state.password) {
            this.userService.updateUser(this.state.session, 
                {username: this.state.username, password: this.state.password, alias: this.state.nickname})
                .then(data => this.setState({message: 'Profile updated successfully', showMessage: true}))
        }
    };

    toggleDisplay = () => {
        this.setState({showMessage: !this.state.showMessage});
    };

    togglePassword = () => {
        this.setState({showPassword: !this.state.showPassword});
    };

    toggleFavorite = () => {
        this.userService.followUser(this.state.session, this.state.profileId, this.state.isFollowing ? 'UNFOLLOW' : 'FOLLOW')
            .then(data => {
                const follows = data.following.map(user => user.id);
                this.setState({currentUserFollows: follows, isFollowing: follows.includes(this.state.profileId)});
            });
    };

    render() {
        const passwordField = this.state.showPassword
            ? <FormRow id='password' name='Password' filled={this.state.password} action={this.upstreamFieldChange}/>
            : <FormRow id='password' name='Password' filled={this.state.password} type='password' action={this.upstreamFieldChange}/>;

        const heart = (this.state.currentUserId !== this.state.profileId && this.state.isFollowing)
            ?
            <button className='material-icons btn'
                    style={{marginTop: '2.5rem', marginBottom: '2rem', color: '#FF69B4'}}
                    onClick={() => this.toggleFavorite()}>
                favorite
            </button>
            :
            <button className='material-icons btn'
                    style={{marginTop: '2.5rem', marginBottom: '2rem'}}
                    onClick={() => this.toggleFavorite()}>
                favorite_border
            </button>;

        return (
            <Container className='odys-spacing'>
                <Tabs className='nav-justified' defaultActiveKey='PROFILE'>
                    <Tab eventKey='PROFILE' title='Profile' >
                        <Row className='align-items-center'>
                            <h1 style={{marginTop: '2rem', marginBottom: '2rem'}}>{`${this.state.viewName}'s Profile`}</h1>
                            {this.state.session && this.state.currentUserId !== this.state.profileId &&
                            heart
                            }
                        </Row>
                        <h5 style={{marginBottom: '2rem'}}>{`Created Threads`}</h5>
                        <ListGroup>
                            {this.state.profileId &&
                                this.state.userThreads.map(thread =>
                                    <Link to={{
                                        pathname: `/thread/${thread.id}`,
                                        state: {
                                            threadId: thread.id
                                        }
                                    }} style={{ textDecoration: 'none', color: '#000000' }}>
                                        <ListGroup.Item action>{thread.title}</ListGroup.Item>
                                    </Link>)
                            }
                        </ListGroup>
                    </Tab>
                    {this.state.showAccount &&
                        <Tab eventKey='ACCOUNT' title='Account'>
                            <Row className='align-items-center'>
                                <Col xs={8}>
                                    <h1 className='odys-spacing'>Account</h1>
                                </Col>
                                <Col xs={4}>
                                    <TheToast display={this.state.showMessage}
                                              message={this.state.message}
                                              action={this.toggleDisplay}/>
                                </Col>
                            </Row>
                            <Form>
                                <FormRow id='username' name='Username' hold={this.state.username} modify={true}
                                         action={this.upstreamFieldChange}/>
                                <FormRow id='nickname' name='Nickname' hold={this.state.nickname}
                                         action={this.upstreamFieldChange}/>
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

                                <Form.Group>
                                    <Row>
                                        <Col sm={2}/>
                                        <Col sm={10}>
                                            <Button block variant='success'
                                                    onClick={() => this.sendUpdate()}>Update</Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group>
                                    <Row>
                                        <Col sm={2}/>
                                        <Col sm={10}>
                                            <Link to='/home/goodbye'
                                                  style={{display: 'block', width: '100%', textDecoration: 'none'}}>
                                                <Button block variant='danger'>
                                                    Logout
                                                </Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Form>
                        </Tab>
                    }
                </Tabs>
            </Container>
        )
    }
}