import { CurrencyService } from "./currencyService.js";

const currencyService = new CurrencyService();
const button = document.getElementById("test");

const fromOptions = document.getElementById("fromDropdownContent");
const toOptions = document.getElementById("toDropdownContent");
let showing = false;

const inputs = [
    document.getElementById("fromInput"),
    document.getElementById("toInput")
]

const switchBtn = document.getElementById("switchBtn");

// set default input values
// and send GET request
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

inputs.forEach(input => input.addEventListener('focus', (event) => showOptions(event)));

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
        // NOTE: need to listen for window clicks
        // in order to stop listening to stuff
        hideOptions(currentInput);
    }));

    showing = true;
}

function hideOptions(currentInput) {

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
    showing = false;
}

function setInputValue(input, opt) {
    input.value = opt.innerText;
}