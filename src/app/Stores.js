import axios from 'axios';

export function getNextPage(url, cb) {
    axios.get(url)
        .then(function (res) {
            cb(res);
            if (res.data.next) {
                console.log(res.data.next);
                getNextPage(res.data.next, cb);
            }
        })
}
