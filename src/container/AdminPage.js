import React from 'react'
import {Col, Container, Row, Table} from 'react-bootstrap';
import UserService from '../service/UserService';
import TheToast from '../component/TheToast';

export default class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.service = UserService.getInstance();
        this.state = {
            users: [],
            refreshUser: props.refreshUser,
            actionMessage: '',
            showMessage: false
        };
    }

    componentDidMount() {
        this.service.findAllUsers().then(data => this.setState({users: data}));
    }

    banUser = (id, user, direction) => {
        this.service.banUser(id, user, direction).then(n =>
            this.service.findAllUsers().then(data => this.setState({users: data})));
        const message = direction === 'BAN' ? `Banned ${user.username}` : `Unbanned ${user.username}`;
        this.setState({actionMessage: message, showMessage: true})
    };

    promoteUser = (id, user, direction) => {
        this.service.promoteUser(id, user, direction).then(n =>
            this.service.findAllUsers().then(data => {
                this.setState({users: data});
                this.state.refreshUser();
            }));
        const message = direction === 'PROMOTE' ? `Promoted ${user.username} to admin` : `Demoted ${user.username}`;
        this.setState({actionMessage: message, showMessage: true})
    };

    toggleDisplay = () => {
        this.setState({showMessage: !this.state.showMessage});
    };

    render() {
        return (
            <Container className='odys-spacing'>
                <Row className='align-items-center'>
                    <Col xs={8}>
                        <h1 className='odys-spacing'>Admin</h1>
                    </Col>
                    <Col xs={4}>
                        <TheToast display={this.state.showMessage}
                                  message={this.state.actionMessage}
                                  action={this.toggleDisplay}/>
                    </Col>
                </Row>
                <Table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Nickname</th>
                        <th>Password</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.users &&
                        this.state.users.map(user =>
                        {
                            let rowColor;
                            if (user.banned) {
                                rowColor = '#FFC0CB';
                            }
                            else if (user.admin) {
                                rowColor = '#98FB98';
                            }
                            else {
                                rowColor = '#FFFFFF';
                            }

                            return <tr style={{backgroundColor: rowColor}}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.alias}</td>
                                <td>{user.password}</td>
                                <td className='border-0' style={{backgroundColor: '#FFFFFF'}}>
                                    <i className='material-icons odys-noselect'
                                       style={{marginLeft: '1rem', cursor: 'pointer'}}
                                       onClick={() => this.banUser(user.id, user, user.banned ? 'UNBAN' : 'BAN')}>
                                        gavel
                                    </i>
                                    <i className='material-icons'
                                       style={{marginLeft: '1rem', cursor: 'pointer'}}
                                       onClick={() => this.promoteUser(user.id, user, user.admin ? 'DEMOTE' : 'PROMOTE')}>
                                        security
                                    </i>
                                </td>
                            </tr>})
                        }
                    </tbody>
                </Table>
            </Container>
        )
    }
}