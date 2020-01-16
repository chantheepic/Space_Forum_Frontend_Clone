import React from 'react'
import {Button, Card, Col, Container, Form, Row} from 'react-bootstrap';
import ReplyService from '../service/ReplyService';
import {Link} from 'react-router-dom';

export default class ReplyPost extends React.Component {
    constructor(props) {
        super(props);
        this.service = ReplyService.getInstance();
        this.state = {
            session: props.session,
            admin: props.admin,
            reply: props.reply,
            upstreamReply: props.upstreamReply,
            upstreamDelete: props.upstreamDelete,
            subtext: '',
            isReplying: false,
            isEditing: false,
            owner: false
        }
    }

    componentDidMount() {
        if (this.state.session) {
            this.service.checkReplyOwner(this.state.session, this.state.reply.id)
                .then(data => this.setState({owner: data}))
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({reply: nextProps.reply})
    }

    cancelAction = () => {
        this.setState({subtext: '', isReplying: false, isEditing: false});
    };

    toggleReply = () => {
        this.setState({subtext: '', isReplying: !this.state.isReplying});
    };

    toggleEdit = () => {
        this.setState({subtext: this.state.reply.content, isEditing: !this.state.isEditing});
    };

    continueReply = () => {
        if (this.state.subtext && this.state.isReplying) {
            this.state.upstreamReply(this.state.reply.id, this.state.subtext);
            this.setState({subtext: '', isReplying: false})
        }
    };

    editReply = () => {
        if (this.state.subtext && this.state.isEditing) {
            this.service.updateReply(this.state.reply.id, {content: this.state.subtext})
                .then(data => this.setState({reply: data, subtext: '', isEditing: false}));
        }
    };

    handleDelete = () => {
        this.service.deleteReply(this.state.reply.id).then(data => this.state.upstreamDelete(data));
    };

    render() {
        const spacer = <div style={{marginRight: '0.5rem', marginLeft: '0.5rem'}}> | </div>;

        return (
            <Card style={{marginTop: '1rem', marginBottom: '1rem'}}>
                <Card.Body>
                    <Link to={{
                        pathname: `/profile/${this.state.reply.author.id}`,
                        state: {
                            userId: this.state.reply.author.id,
                            viewName: this.state.reply.author.alias
                        }
                    }}>
                        <Card.Subtitle className='text-muted' style={{fontSize: '75%'}}>
                            {`Posted by ${this.state.reply.author.alias}`}
                        </Card.Subtitle>
                    </Link>
                    <Card.Text style={{marginTop: '0.5rem'}}>
                        {this.state.reply.content}
                    </Card.Text>
                    {this.state.session &&
                    <Card.Subtitle className='text-muted'
                                   style={{fontSize: '75%', fontWeight: 'bold'}}>
                        <Container>
                            <Row className='align-items-center'>
                                <i className='material-icons' style={{cursor: 'pointer'}} onClick={() => this.toggleReply()}>
                                    mode_comment
                                </i>
                                <div style={{cursor: 'pointer'}} onClick={() => this.toggleReply()}>
                                    Reply
                                </div>
                                {(this.state.owner || this.state.admin) &&
                                    spacer
                                }
                                {(this.state.owner || this.state.admin) &&
                                    <div style={{cursor: 'pointer'}} onClick={() => this.toggleEdit()}>
                                        Edit
                                    </div>
                                }
                                {(this.state.owner || this.state.admin) &&
                                    spacer
                                }
                                {(this.state.owner || this.state.admin) &&
                                    <div style={{cursor: 'pointer'}} onClick={() => this.handleDelete()}>
                                        Delete
                                    </div>
                                }
                            </Row>
                        </Container>
                    </Card.Subtitle>
                    }
                    {(this.state.isReplying || this.state.isEditing) &&
                        <Form.Group style={{marginTop: '1rem'}}>
                            <Form.Control as='textarea' rows='4'
                                          placeholder='What are your thoughts?'
                                          value={this.state.subtext}
                                          onChange={(field) => this.setState({subtext: field.target.value})}/>
                                <Row className='float-right' style={{marginTop: '0.5rem'}}>
                                    <Col>
                                        <Button variant='danger'
                                                onClick={() => this.cancelAction()}>
                                            Cancel
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button variant='primary' 
                                                onClick={() => this.state.isReplying ? this.continueReply() : this.editReply()}>
                                            {this.state.isReplying ? 'Reply' : 'Edit'}
                                        </Button>
                                    </Col>
                                </Row>
                        </Form.Group>
                    }
                    {this.state.reply.replies &&
                        this.state.reply.replies.map(subReply =>
                            <ReplyPost session={this.state.session}
                                       admin={this.state.admin}
                                       reply={subReply}
                                       upstreamReply={this.state.upstreamReply}
                                       upstreamDelete={this.state.upstreamDelete}/>)
                    }
                </Card.Body>
            </Card>
        )
    }
}