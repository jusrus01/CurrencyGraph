import { apiUrl } from "./config.js";

export class CurrencyService {
    getTimeseries(baseCurrency, date) {
        
        let xhr = new XMLHttpRequest();

        let requestUrl = `${apiUrl}/${date}..?from=${baseCurrency}`;

        xhr.open("GET", requestUrl, true);

        xhr.onerror = function(e) {
            console.error(xhr.statusText);
        }

        xhr.send();

        return xhr;
    }
}