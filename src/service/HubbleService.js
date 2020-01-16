export default class HubbleService {
    static myInstance = null;
    url = 'https://cors-anywhere.herokuapp.com/http://hubblesite.org/api/v3/';
    validCollections = ['printshop', 'stsci_gallery', 'hubble_non_news_assets',
        'wallpaper', 'holiday_cards', 'hubble_favorites_gallery', 'wall_murals',
        'news', 'spacecraft', 'illuminated_universe'];

    static getInstance() {
        if (HubbleService.myInstance == null) {
            HubbleService.myInstance =
                new HubbleService();
        }
        return this.myInstance;
    }

    getCollectionItems = (collection) => {
        let target = collection;
        for (let i = 0; i < this.validCollections.length; i++) {
            if (this.validCollections[i].search(`^.*${target}.*$`) !== -1) {
                target = this.validCollections[i];
                break;
            }
        }

        return fetch(this.url + 'images/' + target, {
            method: "GET"
        }).then((response) => {
            return response.json();
        });
    };

    getImageById = (id) => {
        return fetch(this.url + 'image/' + id, {
            method: "GET"
        }).then((response) => {
            return response.json();
        })
    }
}