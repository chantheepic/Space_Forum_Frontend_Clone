import React from 'react'
import { Button, Container, Row } from 'react-bootstrap';
import ThreadRow from '../component/ThreadRow';
import { Link } from 'react-router-dom';
import ThreadService from '../service/ThreadService';
import PostCreation from './PostCreation';

export default class ForumMain extends React.Component {
    constructor(props) {
        super(props);
        this.threadService = ThreadService.getInstance();
        this.state = {
            session: props.session,
            threads: [],
            showCreate: false
        };
    }

    componentDidMount() {
        this.threadRefresh();
    }

    componentWillReceiveProps(nextProps) {
        this.threadRefresh()
    }

    hideCreate = () => {
        this.setState({showCreate: false})
    };

    threadRefresh = () => {
        this.threadService.findAllThreads().then(data => this.setState({threads: data.reverse()}));
    };

    render() {
        const threadOption = this.state.session
            ?
            <Button block onClick={() => this.setState({ showCreate: true })}>
                Create Thread
            </Button>
            :
            <Link to='/register' style={{display: 'block', width: '100%', textDecoration: 'none'}}>
                <Button block>
                    Create Thread
                </Button>
            </Link>;

        return (
            <Container>
                <Row className='odys-spacing'>
                    {threadOption}
                </Row>
                <PostCreation session={this.state.session}
                              type={'NEW'}
                              show={this.state.showCreate}
                              onHide={this.hideCreate}/>
                {this.state.threads &&
                    this.state.threads.map(thread =>
                        <Link to={{
                            pathname: `/thread/${thread.id}`,
                            state: {
                                threadId: thread.id
                            }
                        }} style={{ textDecoration: 'none', color: '#000000' }}>
                            <ThreadRow session={this.state.session}
                                       thread={thread}
                                       refresh={this.threadRefresh}
                                       preview={true}/>
                        </Link>)
                }
            </Container>
        )
    }
}