import React from 'react'
import { Container, Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import PostCreation from './PostCreation';
import ThreadService from '../service/ThreadService';
import ImageService from '../service/ImageService';
import UserService from '../service/UserService';

export default class DetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.threadService = ThreadService.getInstance();
        this.imageService = ImageService.getInstance();
        this.userService = UserService.getInstance();
        this.state = {
            session: props.session,
            imgId: props.imgId,
            name: "",
            description: "",
            category: "",
            links: [],
            relatedThreads: [],
            showCreate: false,
            favorite: false
        };
    }

    componentDidMount() {
        this.props.detail.then(data =>
            this.setState({name: data['name'], description: data['description'], category: data['collection'], links: data['image_files']}));
        this.threadService.findThreadByImage(this.state.imgId)
            .then(data => this.setState({relatedThreads: data}));
        if (this.state.session) {
            this.userService.findUserByToken(this.state.session)
                .then(data => this.setState({userId: data.id, userLikes: data.likedImages.map(img => img.id)}))
        }
    }

    findOptimalImage = () => {
        const source = this.state.links;
        for (let i = 0; i < source.length; i++) {
            const path = source[i]['file_url'].split('.').pop();
            if (path === 'png' || path === 'jpg' || path ==='jpeg') {
                return source[i]['file_url'];
            }
        }
        return ""
    };

    hideCreate = () => {
        this.setState({showCreate: false})
    };

    toggleFavorite = (optimalImage) => {
        this.imageService.createImage({id: this.state.imgId, url: optimalImage, category: this.state.category})
            .then(n => this.imageService.likeImage(this.state.session, this.state.imgId)
                .then(data => this.setState({userLikes: data.map(img => img.id)})))
    };

    render() {
        const optimalImage = this.findOptimalImage();
        const heart = (this.state.userLikes && this.state.userLikes.includes(this.state.imgId))
            ?
            <button className='material-icons btn'
               style={{marginTop: '1.75rem', marginLeft: '2rem', color: '#FF69B4'}}
               onClick={() => this.toggleFavorite(optimalImage)}>
                favorite
            </button>
            :
            <button className='material-icons btn'
               style={{marginTop: '1.75rem', marginLeft: '2rem'}}
               onClick={() => this.toggleFavorite(optimalImage)}>
                favorite_border
            </button>;

        return (
            <Container>
                <Row className='align-items-center'>
                    <h2 style={{marginTop: '2rem'}}>
                        {this.state.name}
                    </h2>
                    {this.state.session &&
                        heart
                    }
                </Row>
                {this.state.session &&
                    <Card style={{marginTop: '1rem'}}>
                        <Card.Body>
                            <Row className='align-items-center'>
                                <Col>
                                    Like this? Start a new thread!
                                </Col>
                                <Col>
                                    <Row className='float-right'>
                                        <Button variant='primary' onClick={() => this.setState({showCreate: true})}>
                                            Create Thread
                                        </Button>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                }
                {optimalImage &&
                    <PostCreation session={this.state.session}
                                  imgId={this.state.imgId}
                                  imgUrl={optimalImage}
                                  category={this.state.category}
                                  show={this.state.showCreate}
                                  onHide={this.hideCreate}/>
                }
                {optimalImage &&
                    <Row className='odys-spacing'>
                        <Col>
                            <Image fluid
                                   src={optimalImage}/>
                        </Col>
                        <Col>
                            <h5>Related Forum Posts</h5>
                            <ListGroup className='odys-line-limit' style={{maxHeight: '35vw'}}>
                                {this.state.relatedThreads &&
                                    this.state.relatedThreads.map(thread =>
                                        <Link to={{
                                            pathname: `/thread/${thread.id}`,
                                            state: {
                                                threadId: thread.id
                                            }
                                        }} style={{ textDecoration: 'none', color: '#000000' }}>
                                            <ListGroup.Item action>{thread.title}</ListGroup.Item>
                                        </Link>)
                                }
                                {this.state.relatedThreads && this.state.relatedThreads.length === 0 &&
                                    <ListGroup.Item style={{fontStyle: 'italic'}}>
                                        No threads to show
                                    </ListGroup.Item>
                                }
                            </ListGroup>
                        </Col>
                    </Row>
                }
                <div dangerouslySetInnerHTML={{__html: this.state.description}} style={{marginBottom: '2rem'}}/>
            </Container>
        )
    }
}