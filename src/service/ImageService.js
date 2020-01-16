export default class ImageService {
    static myInstance = null;
    // url = 'http://localhost:8080/api';
    url = 'https://odysseyforum-java-server.herokuapp.com/api';

    static getInstance() {
        if (ImageService.myInstance == null) {
            ImageService.myInstance =
                new ImageService();
        }
        return this.myInstance;
    }

    createImage = (image) => {
        return fetch(this.url + '/images', {
            method: "POST",
            body: JSON.stringify(image),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.json());
    };

    likeImage = (token, imageId, image) => {
        return fetch(this.url + `/users/${token}/images/${imageId}`, {
            method: "POST",
            body: JSON.stringify(image),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.json());
    };

    findAllImages = () => {
        return fetch(this.url + '/images', {
            method: "GET"
        }).then((response) => {
            return response.json();
        });
    };
}