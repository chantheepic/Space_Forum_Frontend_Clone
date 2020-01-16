import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Navbar, Nav, Form, Button, Dropdown, Col } from 'react-bootstrap'
import PageLink from '../component/PageLink';

class SectionBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            session: props.session,
            user: props.user,
            storeSession: props.storeSession,
            query: '',
            lucky: ''
        };
    }

    componentDidMount() {
        this.setState({lucky: this.feelingLucky()})
    }

    componentWillReceiveProps(nextProps) {
        this.setState({lucky: this.feelingLucky(), session: nextProps.session, user: nextProps.user})
    }

    componentDidUpdate(prevProps, prevState) {
        const currentPath = this.props.location.pathname.split('/').slice(-1).pop();
        if (currentPath.includes('_')) {
            return;
        }
        else if (currentPath === 'goodbye' && this.state.session !== '') {
            localStorage.setItem('sessionToken', '');
            this.state.storeSession('');
        }
        else if (prevState.session !== currentPath && currentPath.length > 20) {
            localStorage.setItem('sessionToken', currentPath);
            this.state.storeSession(currentPath);
            this.props.history.push('/home')
        }
    }

    checkEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    feelingLucky = () => {
        const validCollections = ['printshop', 'stsci_gallery', 'hubble_non_news_assets',
            'wallpaper', 'holiday_cards', 'hubble_favorites_gallery', 'wall_murals',
            'news', 'spacecraft', 'illuminated_universe'];
        const random = Math.round(Math.random() * (validCollections.length - 1));
        return validCollections[random];
    };

    render() {
        const userSection = this.state.session
            ?
            <Nav className='ml-auto'>
                {this.state.user.admin &&
                    <PageLink toLink='/admin' name='Admin'/>
                }
                {this.state.user.admin &&
                    <Col className='d-none d-lg-block'>
                        <Nav.Link  disabled> | </Nav.Link>
                    </Col>
                }
                <Dropdown alignRight>
                    <Dropdown.Toggle className='text-muted'
                                     style={{backgroundColor: 'transparent', borderColor: 'transparent', whiteSpace: 'nowrap'}}>
                        {`Username: ${this.state.user.username}`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={{
                            pathname: `/profile`,
                            state: {
                                userId: this.state.user.id,
                                viewName: this.state.user.username
                            }
                        }}>
                            Profile
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to='/home/goodbye'>
                            Log out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Nav>
            :
            <Nav className='ml-auto'>
                <PageLink toLink='/login' name='Log in'/>
                <PageLink toLink='/register' name='Sign up'/>
            </Nav>;

        return (
            <Navbar bg='light' sticky='top' expand='lg'>
                <Navbar.Brand href='/home'>ODYSSEY</Navbar.Brand>
                <Navbar.Toggle aria-controls='space-nav' />
                <Navbar.Collapse id='space-nav'>
                    <Nav className='mr-auto'>
                        <PageLink toLink='/home' name='Home'/>
                        <PageLink toLink='/forum' name='Forum'/>
                    </Nav>
                    <Form inline className='mx-auto'>
                        <Link to={{
                            pathname: `/search/${this.state.lucky}`,
                            state: {
                                collection: this.state.lucky
                            }
                        }} onClick={() => this.setState({lucky: this.feelingLucky()})}>
                            <Button variant='outline-white'
                                    className='d-none d-xl-block'
                                    style={{fontStyle: 'italic'}}>
                                I'm feeling lucky
                            </Button>
                        </Link>
                        <Form.Control type='text'
                                      style={{width: '30vw'}}
                                      placeholder='Search'
                                      value={this.state.query}
                                      onKeyPress={(event) => this.checkEnter(event)}
                                      onChange={(field) => this.setState({query: field.target.value})}/>
                        <Link to={{
                            pathname: `/search/${this.state.query}`,
                            state: {
                                collection: this.state.query
                            }
                        }}>
                            <Button variant='outline-white'
                                    onClick={() => this.setState({query: ''})}>
                                Search
                            </Button>
                        </Link>
                    </Form>
                    {userSection}
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default withRouter(SectionBanner)