import React from 'react'
import { Button, Col, Container, Card, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThreadRow from '../component/ThreadRow';
import ReplyPost from '../component/ReplyPost';
import ThreadService from '../service/ThreadService';
import ReplyService from '../service/ReplyService';

export default class ThreadView extends React.Component {
    constructor(props) {
        super(props);
        this.threadService = ThreadService.getInstance();
        this.postService = ReplyService.getInstance();
        this.state = {
            session: props.session,
            admin: props.admin,
            threadId: props.threadId,
            thread: null,
            replies: [],
            comment: ''
        }
    }

    componentDidMount() {
        const target = this.state.threadId ? this.state.threadId : this.extractId();
        this.threadService.findThreadById(target).then(data => this.setState({thread: data}));
        this.postService.findAllReply(target).then(data => this.setState({replies: data}));
    }

    extractId = () => {
        return window.location.pathname.split('/').slice(-1).pop();
    };

    threadRefresh = (thread) => {
        this.setState({thread: thread});
    };

    sendPost = () => {
        if (this.state.comment) {
            this.postService.createReply(this.state.session,
                {type: 'THREADREPLY', threadid: this.state.threadId, postid: null, content: this.state.comment})
                .then(data => this.setState({replies: data ? data.posts : [], comment: ''}))
        }
    };

    upstreamReply = (postId, content) => {
        this.postService.createReply(this.state.session,
            {type: 'POSTREPLY', threadid: this.state.threadId, postid: postId, content: content})
            .then(data => this.setState({replies: data ? data.posts : []}))
    };

    upstreamDelete = (thread) => {
        this.setState({thread: thread, replies: thread.posts})
    };

    render() {
        const commentOption = this.state.session
            ?
            <Form.Group style={{marginTop: '1rem'}}>
                <Form.Label>Comment</Form.Label>
                <Form.Control as='textarea'
                              rows='4'
                              placeholder='What are your thoughts?'
                              value={this.state.comment}
                              onChange={(field) => this.setState({comment: field.target.value})}/>
                <Row className='float-right' style={{marginTop: '0.5rem'}}>
                    <Col>
                        <Button variant='primary' onClick={() => this.sendPost()}>
                            Comment
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
            :
            <Card style={{marginTop: '1rem'}}>
                <Card.Body>
                    <Row className='align-items-center'>
                        <Col>
                            What are your thoughts?
                        </Col>
                        <Col>
                            <Row className='float-right'>
                                <Link to='/login'>
                                    <Button variant='primary' style={{marginRight: '1rem'}}>
                                        Log in
                                    </Button>
                                </Link>
                                <Link to='/register'>
                                    <Button variant='primary' style={{marginRight: '1rem'}}>
                                        Sign up
                                    </Button>
                                </Link>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>;

        return (
            <Container className='odys-spacing'>
                {this.state.thread &&
                    <ThreadRow session={this.state.session}
                               admin={this.state.admin}
                               thread={this.state.thread}
                               refresh={this.threadRefresh}
                               preview={false}/>
                }
                {commentOption}
                <hr style={{marginTop: '4rem'}}/>
                {this.state.replies &&
                    this.state.replies.map(reply =>
                        <ReplyPost session={this.state.session}
                                   admin={this.state.admin}
                                   reply={reply}
                                   upstreamReply={this.upstreamReply}
                                   upstreamDelete={this.upstreamDelete}/>)
                }
            </Container>
        )
    }
}