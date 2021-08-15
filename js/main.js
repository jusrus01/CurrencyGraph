import { CurrencyService } from "./currencyService.js";

const currencyService = new CurrencyService();
const button = document.getElementById("test");

const fromOptions = document.getElementById("fromDropdownContent");
const toOptions = document.getElementById("toDropdownContent");
let showingDropdown = null;

const inputs = [
    document.getElementById("fromInput"),
    document.getElementById("toInput")
]

const switchBtn = document.getElementById("switchBtn");

const dropdowns = document.querySelectorAll(".dropdown");
// adding events to dropdown containers in order
// to be able to close them if user didn't choose anything
dropdowns.forEach(drop => drop.addEventListener('mouseleave', function() { 
    hideOptions(showingDropdown);

    // not sure if this is fine
    if(drop.classList.contains('from')) {
        removeSearchListener(inputs[0]);
    } else if(drop.classList.contains('to')) {
        removeSearchListener(inputs[1]);
    }

}));


// set default input values
// and send GET request
// NOTE: make GET request a button for now
// so we don't keep sending these requests
// for no reason
inputs[0].value = "EUR";
inputs[1].value = "USD";

switchBtn.addEventListener('click', function() {
    const temp = inputs[0].value;
    inputs[0].value = inputs[1].value;
    inputs[1].value = temp;
});

button.addEventListener("click", function() {
    let xhr = currencyService.getTimeseries("GBP", "2001-02-21");
    xhr.onload = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        }
    }
});

inputs.forEach(input => input.addEventListener('focus', (event) => { 
    showOptions(event);
    addSearchListener(event); 
}));

function showOptions(currentInput) {

    let id = currentInput.target.id;
    let dropdown = null;

    if(id == "fromInput") {
        dropdown = fromOptions;
    } else {
        dropdown = toOptions;
    }

    if(dropdown == null) {
        console.error("Failed to find dropdown menu on ", id);
        return;
    }

    if(!dropdown.classList.contains("dropdown-active")) {
        dropdown.classList.add("dropdown-active");
    }

    // add event listeners to selections
    dropdown.childNodes.forEach(node => node.addEventListener('click', function() { 
        setInputValue(currentInput.target, node);
        hideOptions(currentInput);
    }));

    showingDropdown = currentInput;
}

function hideOptions(currentInput) {

    if(currentInput == null) {
        return;
    }

    let id = currentInput.target.id;
    let dropdown = null;

    if(id == "fromInput") {
        dropdown = fromOptions;
    } else {
        dropdown = toOptions;
    }

    if(dropdown == null) {
        console.error("Failed to find dropdown menu on ", id);
        return;
    }

    if(dropdown.classList.contains("dropdown-active")) {
        dropdown.classList.remove("dropdown-active");
    }

    // remove event listeners
    dropdown.childNodes.forEach(node => node.removeEventListener('click', null));
    currentInput.target.removeEventListener("keydown", function() {
        console.log("hideOptions: remoev input listener");
    });
    showingDropdown = null;
}

function setInputValue(input, opt) {
    input.value = opt.innerText;
}

function addSearchListener(event) {

    let id = event.target.id;
    let inputField = event.target;

    let dropdown = null;

    if(id == "fromInput") {
        dropdown = fromOptions;
    } else {
        dropdown = toOptions;
    }

    let searchWord = '';

    inputField.addEventListener('keydown', function(e) {

        if(showingDropdown == null) {
            showOptions(event);
        }

        if(e.key == "Backspace" && searchWord != '') {
            searchWord = searchWord.slice(0, -1);
        } else {
            searchWord += e.key;
        }

        console.log(searchWord);
        // if enter pressed

        // find most appropriate keyword/take the first one/default ones

        // remove listener
        if(e.key == "Enter") {
            removeSearchListener(inputField);
            console.log("removed?");
        }
    });
}

function removeSearchListener(inputField) {

    inputField.removeEventListener('keydown', function() {
        console.log("removed listener");
    });
}
