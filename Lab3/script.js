

const messageInput = document.getElementById("messageInput")
const keyInput = document.getElementById("keyInput")

const encryptButton = document.getElementById("encryptButton")
const decryptButton = document.getElementById("decryptButton")
const decryptResultButton = document.getElementById("decryptResultButton")

const keyLengthSpan = document.getElementById("keyLengthSpan")
const result = document.getElementById("result")

const gost = new GOST();
let outputValue = "";

const keyLength = 256 / CHAR_SIZE;
keyInput.setAttribute("maxlength", keyLength.toString());
keyLengthSpan.innerText = keyLength.toString();

const gostFunc = function(gostObj, message, key, isEncrypt, outputNode) {
    if (key.length < keyLength) {
        alert("Недостаточный размер ключа")
        return;
    }

    let answer = "";
    if(isEncrypt) {
        answer = gostObj.encrypt(message, key);
    } else {
        answer = gostObj.decrypt(message, key);
    }

    outputNode.value = answer;
    return answer;
}

encryptButton.addEventListener("click", ()=> {
    outputValue = gostFunc(gost, messageInput.value, keyInput.value, true, result)
})

decryptButton.addEventListener("click", ()=> {
    outputValue = gostFunc(gost, messageInput.value, keyInput.value, false, result)
})

decryptResultButton.addEventListener("click", ()=> {
    outputValue = gostFunc(gost, outputValue, keyInput.value, false, result)
})