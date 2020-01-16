import React from 'react'
import { Form, Row, Button, Image, Modal } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import ThreadService from '../service/ThreadService';

class PostCreation extends React.Component {
    constructor(props) {
        super(props);
        this.service = ThreadService.getInstance();
        this.state = {
            session: props.session,
            type: props.type,
            threadId: props.threadId,
            threadRefresh: props.threadRefresh,
            imgId: props.imgId,
            imgUrl: props.imgUrl,
            category: props.category,
            show: props.show,
            hideSelf: props.onHide,
            title: props.title ? props.title: '',
            text: props.text ? props.text : '',
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({show: nextProps.show, title: '', text: ''})
    }

    sendThread = () => {
        if (this.state.title && (this.state.text || this.state.imgUrl)) {
            this.service.createThread(this.state.session,
                {
                    title: this.state.title,
                    type: this.state.imgUrl ? 'IMAGE' : 'TEXT',
                    imageId: this.state.imgId,
                    imageUrl: this.state.imgUrl,
                    content: this.state.text,
                    category: this.state.category})
                .then(data => this.props.history.push('/forum'));
            this.state.hideSelf();
        }
    };

    editThread = () => {
        if (this.state.title && (this.state.text || this.state.imgUrl)) {
            this.service.updateThread(this.state.threadId,
                {
                    title: this.state.title,
                    type: this.state.imgUrl ? 'IMAGE' : 'TEXT',
                    imageId: this.state.imgId,
                    imageUrl: this.state.imgUrl,
                    text: this.state.text,
                    category: this.state.category})
                .then(data => this.state.threadRefresh(data));
            this.state.hideSelf();
        }
    };

    render() {
        const inputPanel = this.state.imgUrl
            ?
            <Form.Group>
                <Form.Control className='odys-spacing'
                              placeholder='Title'
                              value={this.state.title}
                              onChange={(field) => this.setState({title: field.target.value})}/>
                <Form.Control disabled
                              placeholder='Image Source'
                              className='odys-spacing'
                              value={this.state.imgUrl}/>
                <Image fluid className='odys-spacing' src={this.state.imgUrl}/>
            </Form.Group>
            :
            <Form.Group>
                <Form.Control className='odys-spacing'
                              placeholder='Title'
                              value={this.state.title}
                              onChange={(field) => this.setState({title: field.target.value})}/>
                <Form.Control as='textarea'
                              rows='4'
                              placeholder='What are your thoughts?'
                              value={this.state.text}
                              onChange={(field) => this.setState({text: field.target.value})}/>
            </Form.Group>;

        return (
            <Modal size='lg'
                   show={this.state.show}
                   onHide={this.state.hideSelf}
                   centered>
                <Modal.Header>
                    <Modal.Title>
                        {this.state.type === 'EDIT' ? 'Edit Thread' : 'New Thread'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {inputPanel}
                </Modal.Body>
                <Modal.Footer>
                    <Row className='float-right'>
                        <Button variant='danger' onClick={this.state.hideSelf} style={{marginRight: '1rem'}}>
                            Cancel
                        </Button>
                        <Button variant='primary'
                                style={{marginRight: '1rem'}}
                                onClick={() => this.state.type === 'EDIT' ? this.editThread() : this.sendThread()}>
                            Post
                        </Button>
                    </Row>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default withRouter(PostCreation)