import { CurrencyService } from "./currencyService.js";
import { containsGivenLetters } from "./utils.js"
import { Graph } from "./graph.js";

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

graph.renderData(
    ["2021-01-02", "2021-01-03", "2021-01-04", "2021-01-05"],
    [1, 2, 0.5, 3]
    );

// const currencyService = new CurrencyService();
// const button = document.getElementById("test");

// const fromOptions = document.getElementById("fromDropdownContent");
// const toOptions = document.getElementById("toDropdownContent");
// let showingDropdown = null;

// const inputs = [
//     document.getElementById("fromInput"),
//     document.getElementById("toInput")
// ]

// const switchBtn = document.getElementById("switchBtn");

// const dropdowns = document.querySelectorAll(".dropdown");
// // adding events to dropdown containers in order
// // to be able to close them if user didn't choose anything
// dropdowns.forEach(drop => drop.addEventListener('mouseleave', function() { 
//     hideOptions(showingDropdown);

//     // not sure if this is fine
//     if(drop.classList.contains('from')) {
//         removeSearchListener(inputs[0]);
//     } else if(drop.classList.contains('to')) {
//         removeSearchListener(inputs[1]);
//     }

// }));


// // set default input values
// // and send GET request
// // NOTE: make GET request a button for now
// // so we don't keep sending these requests
// // for no reason
// inputs[0].value = "EUR";
// inputs[1].value = "USD";

// switchBtn.addEventListener('click', function() {
//     const temp = inputs[0].value;
//     inputs[0].value = inputs[1].value;
//     inputs[1].value = temp;
// });

// button.addEventListener("click", function() {
//     let xhr = currencyService.getTimeseries("GBP", "2001-02-21");
//     xhr.onload = function() {
//         if(xhr.readyState == 4 && xhr.status == 200) {
//             console.log(xhr.responseText);
//         }
//     }
// });

// inputs.forEach(input => input.addEventListener('focus', (event) => { 
//     showOptions(event);
//     addSearchListener(event); 
// }));

// function showOptions(currentInput) {

//     let id = currentInput.target.id;
//     let dropdown = null;

//     if(id == "fromInput") {
//         dropdown = fromOptions;
//     } else {
//         dropdown = toOptions;
//     }

//     if(dropdown == null) {
//         console.error("Failed to find dropdown menu on ", id);
//         return;
//     }

//     if(!dropdown.classList.contains("dropdown-active")) {
//         dropdown.classList.add("dropdown-active");
//     }

//     // add event listeners to selections
//     dropdown.childNodes.forEach(node => node.addEventListener('click', function() { 
//         setInputValue(currentInput.target, node);
//         hideOptions(currentInput);
//     }));

//     showingDropdown = currentInput;
// }

// function hideOptions(currentInput) {

//     if(currentInput == null) {
//         return;
//     }

//     let id = currentInput.target.id;
//     let dropdown = null;

//     if(id == "fromInput") {
//         dropdown = fromOptions;
//     } else {
//         dropdown = toOptions;
//     }

//     if(dropdown == null) {
//         console.error("Failed to find dropdown menu on ", id);
//         return;
//     }

//     if(dropdown.classList.contains("dropdown-active")) {
//         dropdown.classList.remove("dropdown-active");
//     }

//     // remove event listeners
//     dropdown.childNodes.forEach(node => node.removeEventListener('click', null));
//     currentInput.target.removeEventListener("keydown", function() {
//         console.log("hideOptions: remoev input listener");
//     });
//     showingDropdown = null;
// }

// function setInputValue(input, opt) {
//     input.value = opt.innerText;
// }

// function addSearchListener(event) {

//     let id = event.target.id;
//     let inputField = event.target;

//     let dropdown = null;

//     if(id == "fromInput") {
//         dropdown = fromOptions;
//     } else {
//         dropdown = toOptions;
//     }

//     let searchWord = '';

//     inputField.addEventListener('keydown', function(e) {

//         if(showingDropdown == null) {
//             showOptions(event);
//         }

//         if(e.key == "Backspace" && searchWord != '') {
//             searchWord = searchWord.slice(0, -1);
//         } else {
//             searchWord += e.key;
//         }

//         console.log(searchWord);
//         // if enter pressed

//         // find most appropriate keyword/take the first one/default ones

//         // remove listener
//         if(e.key == "Enter") {
//             removeSearchListener(inputField);
//             console.log("removed?");
//         }
//     });
// }

// function removeSearchListener(inputField) {

//     inputField.removeEventListener('keydown', function() {
//         console.log("removed listener");
//     });
// }
