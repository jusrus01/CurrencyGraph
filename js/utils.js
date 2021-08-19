export function containsGivenLetters(letters, word) {
        
    letters = letters.toUpperCase();
    word = word.toUpperCase();

    for(let i = 0; i < letters.length; i++) {
        if(letters.charAt(i) != word.charAt(i)) {
            return false;
        }
    }
    return true;
}

export function formatDate(date) {

    let month = date.getMonth();
    let day = date.getDay();

    if(month < 10) {
        month = `0${month}`;
    }
    
    if(day < 10) {
        day = `0${day}`;
    }

    return `${date.getFullYear()}-${month}-${day}`;
}