import { containsGivenLetters, formatDate } from "./utils.js"
import { Graph } from "./graph.js";
import { CurrencyService } from "./currencyService.js";

class Input {
    constructor(inputField, dropdown, dropdownContent, labels) {
        this.inputField = inputField;
        this.dropdown = dropdown;
        this.dropdownContent = dropdownContent;
        this.labels = labels;

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

            // NOTE: add a check to see if it was already selected
            updateGraphData(currentSelectedDate);
        }));
    }

    setInput = (value) => {
        this.inputField.value = value;
        this.labels.forEach(label => label.innerHTML = value);
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
        document.getElementById("fromDropdownContent"),
        document.querySelectorAll(".from-label")
        ),

    to: new Input(
        document.getElementById("toInput"), 
        document.querySelector(".dropdown.to"), 
        document.getElementById("toDropdownContent"),
        document.querySelectorAll(".to-label")
        )
}

// init default values on page load
inputs.from.setInput("EUR");
inputs.to.setInput("USD");

switchBtn.addEventListener("click", function() {

    const temp = inputs.from.getInput();
    inputs.from.setInput(inputs.to.getInput());
    inputs.to.setInput(temp);


    updateGraphData(currentSelectedDate);
});

const latestValue = document.getElementById("latestValue");
const latestDate = document.getElementById("latestDate");

const currencyService = new CurrencyService();

const dateButtons = document.querySelectorAll(".date-btn");

const currentDate = new Date();

const allDates = [
    new Date(currentDate.getTime() - 6.048e+8),
    new Date(currentDate.getTime() - 2.628e+9),
    new Date(currentDate.getTime() - 3.154e+10),
    new Date(currentDate.getTime() - 6.307e+10),
    new Date(currentDate.getTime() - 1.577e+11),
    new Date(currentDate.getTime() - 3.154e+11),
];

let currentSelectedDate = allDates[1];
let currentSelectedBtn = dateButtons[1];

for(let i = 0; i < allDates.length; i++) {
    dateButtons[i].addEventListener("click", function(e) {

        if(currentSelectedBtn.classList.contains("selected")) {
            currentSelectedBtn.classList.remove("selected");
        }

        currentSelectedBtn = e.target;
        currentSelectedBtn.classList.add("selected");        

        updateGraphData(allDates[i]);
        currentSelectedDate = allDates[i];
    });
}

graph.drawClient(
    [1, 2, 0, 3, 5, 0.2],
    ["2021-01-02", "2021-01-03", "2021-01-04", "2021-01-05", "1233-32-12", "2131-12-12"]
);

function updateGraphData(date) {
    let xhr = currencyService.getTimeseries(inputs.from.getInput(), formatDate(date));
       
    xhr.onreadystatechange = function() {
        if(xhr.status == 200 && xhr.readyState == 4) {
            
             let jsonCurrencyData = JSON.parse(xhr.responseText);
             let currencyData = [];
             let labels = [];

             for(const [key, value] of Object.entries(jsonCurrencyData["rates"])) {
                labels.push(key);
                currencyData.push(value[inputs.to.getInput()]);
             }

             latestValue.innerHTML = currencyData.pop();
             latestDate.innerHTML = new Date(labels.pop()).toUTCString();
             
             graph.drawClient(currencyData, labels, inputs.to.getInput());
        }
    }
}

// updateGraphData(currentSelectedDate);