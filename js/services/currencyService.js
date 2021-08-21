export class CurrencyService {
    constructor() {
        this.apiUrl = "https://api.frankfurter.app";
    }

    getTimeseries(baseCurrency, date) {
        let xhr = new XMLHttpRequest();

        let requestUrl = `${this.apiUrl}/${date}..?from=${baseCurrency}`;

        xhr.open("GET", requestUrl, true);

        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };

        xhr.send();

        return xhr;
    }
}
