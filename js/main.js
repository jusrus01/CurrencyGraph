import { containsGivenLetters } from "./utils.js"
import { Graph } from "./graph.js";
import { CurrencyService } from "./currencyService.js";

class Input {
    constructor(inputField, dropdown, dropdownContent) {
        this.inputField = inputField;
        this.dropdown = dropdown;
        this.dropdownContent = dropdownContent;

        this.addSelectionEventToOptions();
        this.addInputFieldFocusListener();
        this.initInputSearch();
    }

    initInputSearch() {

        let searchWord = this.inputField.value;

        this.inputField.addEventListener("keydown", (e) => {

            if(e.key == "Enter") {

                // remove added hidden flags to each item in the container
                this.dropdownContent.childNodes.forEach(node => {
                    this.stopHidingOption(node);
                });

                // searchWord = '';
                this.hideDropdown();

            } else {
                if(e.key == "Backspace" && searchWord != '') {
                    searchWord = searchWord.slice(0, -1);
                } else if(e.keyCode >= 65 && e.keyCode <= 122) {
                    searchWord += e.key;
                }
                
                // filter selections by search word
                this.dropdownContent.childNodes.forEach(node => {
                    if(node.value !== undefined && !containsGivenLetters(searchWord, node.value)) {
                        // add hidden flag
                        this.hideOption(node);
                    } else if(node.value !== undefined) {
                        // remove hidden flag if was hidden before
                        this.stopHidingOption(node);
                    }
                });
            }
        });
    }

    addInputFieldFocusListener() {
        this.inputField.addEventListener("focus", this.showDropdown);

        this.inputField.addEventListener("blur", () => {
            
            // check if selected/not selected value is valid
            let valid = false;

            this.dropdownContent.childNodes.forEach(node => {
                if(node.innerText == this.inputField.value) {
                    valid = true;
                }
            });

            // set default value
            // NOTE: or set previous
            if(!valid) {
                // TEMPORARY
                this.inputField.value = "EUR";
            }

            this.hideDropdown();
        });
    }

    addSelectionEventToOptions() {
        this.dropdownContent.childNodes.forEach(opt => opt.addEventListener('mousedown', () => {
            this.setInput(opt.innerText);
        }));
    }

    setInput = (value) => {
        this.inputField.value = value;
    }

    getInput = () => {
        return this.inputField.value;
    }

    showDropdown = () => {

        if(this.dropdownContent == null) {
            console.error("Failed to find dropdown menu on");
            return;
        }

        if(!this.dropdownContent.classList.contains("dropdown-active")) {
            this.dropdownContent.classList.add("dropdown-active");
        }
    }

    hideDropdown = () => {

        if(this.dropdownContent == null) {
            console.error("Failed to find dropdown menu on ", id);
            return;
        }

        if(this.dropdownContent.classList.contains("dropdown-active")) {
            this.dropdownContent.classList.remove("dropdown-active");
        }
    }

    hideOption = (option) => {
        if(!option.classList.contains("hide")) {
            option.classList.add("hide");
        }
    }

    stopHidingOption = (option) => {
        if(option.classList.contains("hide")) {
            option.classList.remove("hide");
        }
    }
}

const graph = new Graph();

const switchBtn = document.getElementById("switchBtn"); 

const inputs = {
    from: new Input(
        document.getElementById("fromInput"),
        document.querySelector(".dropdown.from"),
        document.getElementById("fromDropdownContent")
        ),

    to: new Input(
        document.getElementById("toInput"), 
        document.querySelector(".dropdown.to"), 
        document.getElementById("toDropdownContent")
        )
}

console.log(inputs);

// init default values on page load
inputs.from.setInput("EUR");
inputs.to.setInput("USD");

switchBtn.addEventListener("click", function() {

    const temp = inputs.from.getInput();
    inputs.from.setInput(inputs.to.getInput());
    inputs.to.setInput(temp);

});

// TEMPORARY
const currencyService = new CurrencyService();

document.getElementById("test").addEventListener("click", function() {
    let xhr = currencyService.getTimeseries("GBP", "2015-02-21");
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            let temp = xhr.responseText;
            let json = JSON.parse(temp);

            let data = [];
            let labels = [];
            let obj = json["rates"];
            
            let counter = 0;

            for(const [key, value] of Object.entries(obj)) {
                labels.push(key);
                data.push(value["EUR"]);
            }
            // console.log(data);
            graph.drawClient(data, labels);
        }
    }
});


graph.drawClient(
    [1, 2, 0, 3, 5, 0.2],
    ["2021-01-02", "2021-01-03", "2021-01-04", "2021-01-05", "1233-32-12", "2131-12-12"]
);