import { containsGivenLetters, formatDate } from "./utils/utils.js";
import { Graph } from "./graph/graph.js";
import { CurrencyService } from "./services/currencyService.js";

/**
 * This class handles search input,
 * dropdown input and html label change
 */
class Input {
    constructor(inputField, dropdown, dropdownContent, labels, updateFunction) {
        this.inputField = inputField;
        this.dropdown = dropdown;
        this.dropdownContent = dropdownContent;
        this.labels = labels;

        this.updateFunction = function() { updateFunction; }

        this.lastInput = null;

        this.addSelectionEventToOptions();
        this.addInputFieldFocusListener();
        this.initInputSearch();
    }

    initInputSearch() {
        let searchWord = this.inputField.value;

        this.inputField.addEventListener("keyup", (e) => {
            if (e.key == "Enter") {
                let selected = false;

                // Set input to the first unhidden element and
                // remove hidden classes to each item in the dropdown contents
                this.dropdownContent.childNodes.forEach((node) => {
                    if (node.value !== undefined) {
                        if (!selected && !node.classList.contains("hide")) {
                            this.setInput(node.value);
                            selected = true;
                        }

                        this.stopHidingOption(node);
                    }
                });

                updateGraphData(currentSelectedDate);

                this.hideDropdown();
            } else {
                let firstHighlighted = false;
                searchWord = this.inputField.value;

                // Filter selections by search word
                this.dropdownContent.childNodes.forEach((node) => {
                    if (
                        node.value !== undefined &&
                        !containsGivenLetters(searchWord, node.value)
                    ) {
                        this.hideOption(node);
                    } else if (
                        node.value !== undefined &&
                        !node.classList.contains("hide") &&
                        !firstHighlighted
                    ) {
                        // Set highlight
                        node.classList.add("highlight");
                        firstHighlighted = true;
                    } else if (node.value !== undefined) {
                        this.stopHidingOption(node);

                        if (node.classList.contains("highlight")) {
                            node.classList.remove("highlight");
                        }
                    }
                });
            }
        });
    }

    addInputFieldFocusListener() {
        this.inputField.addEventListener("focus", this.showDropdown);

        this.inputField.addEventListener("blur", () => {
            // Check if selected/not selected value is valid
            let valid = false;

            this.dropdownContent.childNodes.forEach((node) => {
                if (node.innerText == this.inputField.value) {
                    valid = true;
                }
            });

            // Set default value
            if (!valid) {
                this.inputField.value = "EUR";
            }

            this.hideDropdown();
        });
    }

    addSelectionEventToOptions() {
        this.dropdownContent.childNodes.forEach((opt) =>
            opt.addEventListener("mousedown", () => {
                if (opt.innerText != this.inputField.value) {
                    updateGraphData(currentSelectedDate);
                }

                this.setInput(opt.innerText);
            })
        );
    }

    setInput = (value) => {
        this.inputField.value = value;
        this.labels.forEach((label) => (label.innerHTML = value));
    };

    getInput = () => {
        return this.inputField.value;
    };

    showDropdown = () => {
        if (this.dropdownContent == null) {
            console.error("Failed to find dropdown menu on");
            return;
        }

        if (!this.dropdownContent.classList.contains("dropdown-active")) {
            this.dropdownContent.classList.add("dropdown-active");
        }
    };

    hideDropdown = () => {
        if (this.dropdownContent == null) {
            console.error("Failed to find dropdown menu on ", id);
            return;
        }

        if (this.dropdownContent.classList.contains("dropdown-active")) {
            this.dropdownContent.classList.remove("dropdown-active");
        }
    };

    hideOption = (option) => {
        if (!option.classList.contains("hide")) {
            option.classList.add("hide");
        }
    };

    stopHidingOption = (option) => {
        if (option.classList.contains("hide")) {
            option.classList.remove("hide");
        }
    };
}

const graph = new Graph();

const switchBtn = document.getElementById("switchBtn");

const inputs = {
    from: new Input(
        document.getElementById("fromInput"),
        document.querySelector(".dropdown.from"),
        document.getElementById("fromDropdownContent"),
        document.querySelectorAll(".from-label"),
    ),

    to: new Input(
        document.getElementById("toInput"),
        document.querySelector(".dropdown.to"),
        document.getElementById("toDropdownContent"),
        document.querySelectorAll(".to-label")
    ),
};

const latestValue = document.getElementById("latestValue");
const latestDate = document.getElementById("latestDate");

const currencyService = new CurrencyService();

const dateButtons = document.querySelectorAll(".date-btn");

const currentDate = new Date();

const allDates = [
    new Date(currentDate.getTime() - 6.048e8),
    new Date(currentDate.getTime() - 2.628e9),
    new Date(currentDate.getTime() - 3.154e10),
    new Date(currentDate.getTime() - 6.307e10),
    new Date(currentDate.getTime() - 1.577e11),
    new Date(currentDate.getTime() - 3.154e11),
];

let currentSelectedDate = allDates[1];
let currentSelectedBtn = dateButtons[1];

for (let i = 0; i < allDates.length; i++) {
    dateButtons[i].addEventListener("click", function (e) {
        if (currentSelectedBtn.classList.contains("selected")) {
            currentSelectedBtn.classList.remove("selected");
        }

        currentSelectedBtn = e.target;
        currentSelectedBtn.classList.add("selected");

        updateGraphData(allDates[i]);
        currentSelectedDate = allDates[i];
    });
}

switchBtn.addEventListener("click", function () {
    const temp = inputs.from.getInput();
    inputs.from.setInput(inputs.to.getInput());
    inputs.to.setInput(temp);

    updateGraphData(currentSelectedDate);
});

window.addEventListener("DOMContentLoaded", () => {
    // Init default values on page load
    inputs.from.setInput("EUR");
    inputs.to.setInput("USD");

    updateGraphData(currentSelectedDate);
});

function updateGraphData(date) {
    let xhr = currencyService.getTimeseries(
        inputs.from.getInput(),
        formatDate(date)
    );

    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            let jsonCurrencyData = JSON.parse(xhr.responseText);
            let currencyData = [];
            let labels = [];

            for (const [key, value] of Object.entries(
                jsonCurrencyData["rates"]
            )) {
                labels.push(key);
                currencyData.push(value[inputs.to.getInput()]);
            }

            latestValue.innerHTML = currencyData.pop();
            latestDate.innerHTML = new Date(labels.pop()).toUTCString();

            graph.drawClient(currencyData, labels, inputs.to.getInput());
        }
    };
}