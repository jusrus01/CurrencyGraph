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