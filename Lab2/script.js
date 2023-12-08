const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const defaultKey = "DEF"
const biasEn = 97;
const lettersCount = 26;

let buttEncrypt = document.getElementById("butt_encrypt");
buttEncrypt.onclick = function() {
    let text = document.getElementById("text_to_encrypt").value.toLowerCase();
    let key = document.getElementById("key_encrypt").value.toLowerCase() == null ? defaultKey : document.getElementById("key_encrypt").value.toLowerCase();
    if(!isValidEn(text) || !isValidEn(key)) {
        alert("Допустимы только буквы латинского алфавита");
        return;
    }
    let crypt_text = encrypt(text, key);
    document.getElementById("text_to_decrypt").value = crypt_text;
    alert(crypt_text);
}

let buttDecrypt = document.getElementById("butt_decrypt");
buttDecrypt.onclick = function() {
    let text = document.getElementById("text_to_decrypt").value.toLowerCase();
    let key = document.getElementById("key_decrypt").value.toLowerCase() == null ? defaultKey : document.getElementById("key_decrypt").value.toLowerCase();
    if(!isValidEn(text) || !isValidEn(key)) {
        alert("Допустимы только буквы латинского алфавита");
        return;
    }
    let crypt_text = decrypt(text, key);
    alert(crypt_text);
}

function encrypt(text, key) {
    let result = "";
    for(let i = 0; i < text.length; i++) {
        result += String.fromCharCode((((text.charCodeAt(i) + key.charCodeAt(i % key.length)) - 2 * biasEn) % lettersCount) + biasEn);
    }
    return result;
}

function decrypt(text, key) {
    let result = "";
    for(let i = 0; i < text.length; i++) {
        result += String.fromCharCode((((text.charCodeAt(i) - key.charCodeAt(i % key.length)) + lettersCount) % lettersCount) + biasEn);
    }
    return result;
}

function isValidEn(text) {
    return /^[a-zA-Z]+$/.test(text)
}