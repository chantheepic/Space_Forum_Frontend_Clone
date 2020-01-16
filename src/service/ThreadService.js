export default class ThreadService {
    static myInstance = null;
        // url = 'http://localhost:8080/api';
        url = 'https://odysseyforum-java-server.herokuapp.com/api';

    static getInstance() {
        if (ThreadService.myInstance == null) {
            ThreadService.myInstance =
                new ThreadService();
        }
        return this.myInstance;
    }

    findAllThreads = () => {
        return fetch(this.url + '/threads', {
            method: "GET"
        }).then((response) => {
            return response.json();
        });
    };

    createThread = (token, thread) => {
        return fetch(this.url + `/threads/${token}`, {
            method: "POST",
            body: JSON.stringify(thread),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.json());
    };

    checkThreadOwner = (token, threadId) => {
        return fetch(this.url + `/users/${token}/threads/${threadId}`, {
            method: "GET",
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
        });
    };

    voteThread = (token, threadId, direction) => {
        return fetch(this.url + `/users/${token}/threads/${threadId}`, {
            method: "POST",
            body: direction,
        }).then(response => response.json());
    };

    updateThread = (id, thread) => {
        return fetch(this.url + `/threads/${id}`, {
            method: "PUT",
            body: JSON.stringify(thread),
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

    findThreadById = (id) => {
        return fetch(this.url + `/threads/${id}`, {
            method: "GET",
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
        });
    };

    findThreadByImage = (imageId) => {
        return fetch(this.url + `/images/${imageId}/threads`, {
            method: "GET",
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
        });
    };

    deleteThread = (id) => {
        return fetch(this.url + `/threads/${id}`, {
            method: "DELETE"
        });
    };
}