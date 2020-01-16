export default class UserService {
    static myInstance = null;
        // url = 'http://localhost:8080/api';
        url = 'https://odysseyforum-java-server.herokuapp.com/api';

    static getInstance() {
        if (UserService.myInstance == null) {
            UserService.myInstance =
                new UserService();
        }
        return this.myInstance;
    }

    findAllUsers = () => {
        return fetch(this.url + '/users', {
            method: "GET"
        }).then((response) => {
            return response.json();
        });
    };
    
    createUser = (user) => {
        return fetch(this.url + '/users', {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.json());
    };

    findUserInfo = (user) => {
        return fetch(this.url + '/userlogin', {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
        });
    };

    findUserByToken = (token) => {
        return fetch(this.url + `/authenticateuser/${token}`, {
            method: "GET",
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
        });
    };

    updateUser = (token, user) => {
        return fetch(this.url + `/users/${token}`, {
            method: "PUT",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
        });
    };

    banUser = (id, user, direction) => {
        return fetch(this.url + `/banuser/${direction}`, {
            method: "PUT",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
        });
    };

    promoteUser = (id, user, direction) => {
        return fetch(this.url + `/promoteuser/${direction}`, {
            method: "PUT",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
        });
    };

    followUser = (token, followee, direction) => {
        return fetch(this.url + `/user/${token}/follow/${followee}/direction/${direction}`, {
            method: "PUT"
        }).then((response) => {
            return response.json();
        });
    };
}