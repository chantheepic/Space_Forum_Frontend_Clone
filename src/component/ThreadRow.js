import React from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import ThreadService from '../service/ThreadService';
import PostCreation from '../container/PostCreation';

class ThreadRow extends React.Component {
    constructor(props) {
        super(props);
        this.service = ThreadService.getInstance();
        this.state = {
            session: props.session,
            admin: props.admin,
            thread: props.thread ? props.thread : {},
            preview: props.preview,
            refresh: props.refresh,
            showEdit: false,
            owner: false
        };
    }

    componentDidMount() {
        if (this.state.session) {
            this.service.checkThreadOwner(this.state.session, this.state.thread.id)
                .then(data => this.setState({owner: data}))
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.thread.id !== this.state.thread.id) {
            this.setState({thread: nextProps.thread})
        }
    }

    handleVote = (type) => {
        if (!this.state.session) {
            this.props.history.push('/register');
        }
        else {
            this.service.voteThread(this.state.session, this.state.thread.id, type).then(data => {
                this.setState({thread: data});
            })
        }
    };

    hideCreate = () => {
        this.setState({showEdit: false})
    };

    threadRefresh = (thread) => {
        this.setState({thread: thread});
        this.state.refresh(thread);
    };

    handleDelete = () => {
        this.service.deleteThread(this.state.thread.id).then(data => this.props.history.push('/forum'));
    };
    
    render() {
        let content;

        if (!this.state.preview && this.state.thread.type === 'TEXT') {
            content =
                <Card.Body>
                    <hr style={{marginTop: '-0.5rem', marginBottom: '1.5rem'}}/>
                    <Card.Text>{this.state.thread.text}</Card.Text>
                </Card.Body>;
        }
        else if (!this.state.preview && this.state.thread.type === 'IMAGE') {
            content =
                <Card.Body>
                    <hr style={{marginTop: '-0.5rem', marginBottom: '1.5rem'}}/>
                    <Card.Img variant='bottom' src={this.state.thread.image.url}/>
                </Card.Body>;
        }

        const rating = this.state.thread.upvotedBy.length - this.state.thread.downvotedBy.length;

        return (
            <Card style={{marginTop: '1rem', marginBottom: '1rem'}}>
                <Row className='align-items-center' style={{whiteSpace: 'nowrap'}}>
                    <Col xs={2} md={2} lg={1} className='text-center'>
                        <button className='material-icons btn' onClick={(e) => {
                            e.preventDefault();
                            this.handleVote('UPVOTE')
                        }}>
                            arrow_drop_up
                        </button>

                        <div onClick={(e) => e.preventDefault()}>
                            {rating}
                        </div>

                        <button className='material-icons btn' onClick={(e) => {
                            e.preventDefault();
                            this.handleVote('DOWNVOTE')
                        }}>
                            arrow_drop_down
                        </button>
                    </Col>
                    <Col xs={6} md={7} lg={9}>
                        <Link to={{
                            pathname: `/profile/${this.state.thread.author.id}`,
                            state: {
                                userId: this.state.thread.author.id,
                                viewName: this.state.thread.author.alias
                            }
                        }}>
                            <Card.Subtitle className='odys-line-limit text-muted'>
                                {`Posted by ${this.state.thread.author.alias}`}
                            </Card.Subtitle>
                        </Link>
                        <Card.Title className='odys-line-limit' style={{marginTop: '0.5rem'}}>
                            {this.state.thread.title}
                        </Card.Title>
                    </Col>
                    <Col xs={4} md={3} lg={2}>
                        {this.state.preview && this.state.thread.type === 'IMAGE' &&
                            <i className='material-icons'>
                                image
                            </i>
                        }
                        {!this.state.preview && (this.state.owner || this.state.admin) &&
                            <Col>
                                <button className='material-icons btn' onClick={() => this.setState({showEdit: true})}>
                                    edit
                                </button>
                                <button className='material-icons btn' onClick={() => this.handleDelete()}>
                                    close
                                </button>
                            </Col>
                        }
                    </Col>
                </Row>
                {content}
                {this.state.showEdit &&
                    <PostCreation session={this.state.session}
                                  type={'EDIT'}
                                  threadId={this.state.thread.id}
                                  threadRefresh={this.threadRefresh}
                                  imgUrl={this.state.thread.image ? this.state.thread.image.url : ''}
                                  title={this.state.thread.title}
                                  text={this.state.thread.text}
                                  show={this.state.showEdit}
                                  onHide={this.hideCreate}/>
                }
            </Card>
        )
    }
}

export default withRouter(ThreadRow)