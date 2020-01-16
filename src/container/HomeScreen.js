import React from 'react'
import { Carousel, Container, Col, Row, ListGroup, Image} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ThreadService from '../service/ThreadService';
import UserService from '../service/UserService';
import ImageService from '../service/ImageService';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.threadService = ThreadService.getInstance();
        this.userService = UserService.getInstance();
        this.imageService = ImageService.getInstance();
        this.state = {
            session: props.session,
            userImages: [],
            recentThreads: [],
            publicImages: [],
        }
    }

    componentDidMount() {
        this.refreshPreviews();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.session !== this.state.session) {
            this.refreshPreviews();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.session !== this.state.session) {
            this.setState({session: nextProps.session});
        }
    }

    refreshPreviews = () => {
        this.threadService.findAllThreads()
            .then(data => this.setState({recentThreads: data.reverse().splice(0, 10)}));

        if (this.state.session) {
            this.userService.findUserByToken(this.state.session)
                .then(user => this.setState({userImages: user.likedImages}));
        }
        else {
            this.imageService.findAllImages()
                .then(data => this.setState({publicImages: data.splice(0, 10)}));
        }
    };

    render() {
        let imgCarousel;

        if (this.state.session && this.state.userImages && this.state.userImages.length > 0) {
            imgCarousel =
                <Carousel>
                {
                    this.state.userImages.map(img =>
                        <Carousel.Item>
                            <Image fluid src={img.url}/>
                        </Carousel.Item>)
                }
             </Carousel>
        }
        else if (!this.state.session) {
            if (this.state.publicImages && this.state.publicImages.length === 0) {
                imgCarousel = <h6 className='text-muted' style={{fontStyle: 'italic'}}>Come back later for images!</h6>
            }
            else {
                imgCarousel =
                    <Carousel>
                        {
                            this.state.publicImages.map(img =>
                                <Carousel.Item>
                                    <Image fluid src={img.url}/>
                                </Carousel.Item>)
                        }
                    </Carousel>;
            }
        }

        return (
            <Container>
                <h2 style={{marginTop: '2rem'}}>
                    Welcome to Odyssey!
                </h2>
                <h6 className='text-muted'
                    style={{marginBottom: '3rem'}}>
                    A hub for out-of-this-world conversations!
                </h6>
                <Row>
                    <Col>
                        <h5 style={{marginBottom: '3rem'}}>{this.state.session ? 'Enjoy your favorite images!' : 'Enjoy these random images!'}</h5>
                        {imgCarousel}
                        {(this.state.session && this.state.userImages && this.state.userImages.length === 0) &&
                            <h6 className='text-muted' style={{fontStyle: 'italic'}}>Favorite pictures to show them here!</h6>
                        }
                    </Col>
                    <Col>
                        <h5 style={{marginBottom: '3rem'}}>Recent threads</h5>
                        {(this.state.recentThreads && this.state.recentThreads.length > 0) &&
                            <ListGroup>
                                {
                                    this.state.recentThreads.map(thread =>
                                    <Link to={{
                                        pathname: `/thread/${thread.id}`,
                                        state: {
                                            threadId: thread.id
                                        }
                                    }} className='odys-line-limit' style={{ textDecoration: 'none', color: '#000000' }}>
                                        <ListGroup.Item action>{thread.title}</ListGroup.Item>
                                    </Link>)
                                }
                            </ListGroup>
                        }
                    </Col>
                </Row>
            </Container>
        )
    }
}