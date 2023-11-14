function encrypt() {
    var plaintext = document.getElementById("plaintext").value;
    var shift = parseInt(document.getElementById("shift").value);
    var ciphertext = "";

    for (var i = 0; i < plaintext.length; i++) {
        var charCode = plaintext.charCodeAt(i);
        if (charCode >= 1040 && charCode <= 1071) {
            var encryptedCharCode = (charCode - 1040 + shift) % 32 + 1040;
            ciphertext += String.fromCharCode(encryptedCharCode);
        } else if (charCode >= 1072 && charCode <= 1103) {
            var encryptedCharCode = (charCode - 1072 + shift) % 32 + 1072;
            ciphertext += String.fromCharCode(encryptedCharCode);
        } else {
            ciphertext += String.fromCharCode(charCode);
        }
    }

    document.getElementById("ciphertext").value = ciphertext;
}

function decrypt() {
    var ciphertext = document.getElementById("plaintext").value;
    var shift = parseInt(document.getElementById("shift").value);
    var plaintext = "";

    for (var i = 0; i < ciphertext.length; i++) {
        var charCode = ciphertext.charCodeAt(i);
        if (charCode >= 1040 && charCode <= 1071) {
            var decryptedCharCode = (charCode - 1040 - shift + 32) % 32 + 1040;
            plaintext += String.fromCharCode(decryptedCharCode);
        } else if (charCode >= 1072 && charCode <= 1103) {
            var decryptedCharCode = (charCode - 1072 - shift + 32) % 32 + 1072;
            plaintext += String.fromCharCode(decryptedCharCode);
        } else {
            plaintext += String.fromCharCode(charCode);
        }
    }

    document.getElementById("ciphertext").value = plaintext;
}

function decryptWithoutKey() {
    var ciphertext = document.getElementById("plaintext").value;
    var decryptedText = "";

    for (var shift = 1; shift <= 25; shift++) {
        var plaintext = "";

        for (var i = 0; i < ciphertext.length; i++) {
        var charCode = ciphertext.charCodeAt(i);
        if (charCode >= 1040 && charCode <= 1071) {
            var decryptedCharCode = (charCode - 1040 - shift + 32) % 32 + 1040;
            plaintext += String.fromCharCode(decryptedCharCode);
        } else if (charCode >= 1072 && charCode <= 1103) {
            var decryptedCharCode = (charCode - 1072 - shift + 32) % 32 + 1072;
            plaintext += String.fromCharCode(decryptedCharCode);
        } else {
            plaintext += String.fromCharCode(charCode);
        }
        }

        decryptedText += "Сдвиг " + shift + ": " + plaintext + "\n";
    }

    document.getElementById("ciphertext").value = decryptedText;
}