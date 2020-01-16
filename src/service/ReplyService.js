export default class ReplyService {
    static myInstance = null;
        // url = 'http://localhost:8080/api';
        url = 'https://odysseyforum-java-server.herokuapp.com/api';

    static getInstance() {
        if (ReplyService.myInstance == null) {
            ReplyService.myInstance =
                new ReplyService();
        }
        return this.myInstance;
    }

    findAllReply = (threadId) => {
        return fetch(this.url + `/threads/${threadId}/posts`, {
            method: "GET"
        }).then((response) => {
            return response.json();
        });
    };

    createReply = (token, reply) => {
        return fetch(this.url + `/users/${token}/posts`, {
            method: "POST",
            body: JSON.stringify(reply),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.json());
    };

    updateReply = (id, reply) => {
        return fetch(this.url + `/posts/${id}`, {
            method: "PUT",
            body: JSON.stringify(reply),
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

    checkReplyOwner = (token, replyId) => {
        return fetch(this.url + `/users/${token}/posts/${replyId}`, {
            method: "GET",
        }).then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            }
        });
    };

    deleteReply = (id) => {
        return fetch(this.url + `/posts/${id}`, {
            method: "DELETE"
        }).then((response) => {
            return response.json();
        });
    };
}