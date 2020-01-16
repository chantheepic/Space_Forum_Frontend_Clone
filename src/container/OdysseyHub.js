import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import SectionBanner from './SectionBanner'
import SearchResults from './SearchResults'
import DetailPage from './DetailPage'
import HubbleService from '../service/HubbleService';
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import ForumMain from './ForumMain';
import ThreadView from './ThreadView';
import HomeScreen from './HomeScreen';
import AdminPage from './AdminPage';
import UserService from '../service/UserService';

export default class OdysseyHub extends React.Component {
    constructor(props) {
        super(props);
        this.hubbleService = HubbleService.getInstance();
        this.userService = UserService.getInstance();
        this.state = {
            session: localStorage.getItem('sessionToken'),
            user: {}
        };
    }

    componentDidMount() {
        this.refreshUser();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.session !== this.state.session) {
            this.refreshUser();
        }
    }

    refreshUser = () => {
        if (this.state.session) {
            this.userService.findUserByToken(this.state.session)
                .then(data => this.setState({user: data ? data : {}}));
        }
    };

    storeSession = (token) => {
        this.setState({session: token})
    };

    render() {
        return (
            <Router>
                <div>
                    <SectionBanner storeSession={this.storeSession}
                                   session={this.state.session}
                                   user={this.state.user}/>
                    <Route exact path='/' render={() => <Redirect to='/home'/>}/>

                    <Route path='/home'
                           render={() => <HomeScreen session={this.state.session}/>}/>

                    <Route path='/forum'
                           render={() => <ForumMain session={this.state.session}/>}/>

                    <Route path='/thread'
                           render={(props) => <ThreadView session={this.state.session}
                                                          admin={this.state.user.admin}
                                                          threadId={props.location.state ? props.location.state.threadId : null}/>}/>

                    <Route path='/admin'
                           render={() => <AdminPage session={this.state.session}
                                                    refreshUser={this.refreshUser}/>}/>

                    <Route path='/profile'
                           render={(props) => <ProfilePage session={this.state.session}
                                                           profileId={props.location.state ? props.location.state.userId : null}
                                                           profileFollows={props.location.state ? props.location.state.profileFollows : null}
                                                           viewName={props.location.state ? props.location.state.viewName : null} />}/>

                    <Route path='/login'
                           render={() => <LoginPage session={this.state.session}/>}/>

                    <Route path='/register'
                           render={() => <RegisterPage session={this.state.session}/>}/>

                    <Route path='/search/:criteria'
                           render={(props) => <SearchResults category={props.location.state.collection}
                                                             collection={this.hubbleService.getCollectionItems(props.location.state.collection)}/>}/>
                    <Route path='/detail/:id'
                           render={(props) => <DetailPage session={this.state.session}
                                                          imgId={props.location.state.imgId}
                                                          detail={this.hubbleService.getImageById(props.location.state.imgId)}/>}/>
                </div>
            </Router>
        )
    }
}