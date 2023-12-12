import { generateRsaKeys, stringToHex, stringFromHex, sign, decryptSignature } from './lib.js';

const generateKeysButton = document.getElementById('generate-keys');
const keySizeInput = document.getElementById('key-size');
const nTextarea = document.getElementById('n-value');
const eTextarea = document.getElementById('e-value');
const dTextarea = document.getElementById('d-value');

const signMessageButton = document.getElementById('sign-message');
const messageTextarea = document.getElementById('message');
const messageBigIntTextarea = document.getElementById('message-bigint');
const plainRsaSignatureTextarea = document.getElementById('plain-rsa-signature');

const verifyRsaSignatureButton = document.getElementById('verify-rsa-signature');
const messageToVerifyTextarea = document.getElementById('message-to-verify');
const rsaSignatureToVerifyTextarea = document.getElementById('rsa-signature-to-verify');
const decryptedMessageBigIntTextarea = document.getElementById('decrypted-message-bigint');
const decryptedMessageTextarea = document.getElementById('decrypted-message');

let keys;

generateKeysButton.onclick = async function() {
    const keySize = parseInt(keySizeInput.value);
    keys = await generateRsaKeys(keySize);
    nTextarea.value = keys.n;
    eTextarea.value = keys.e;
    dTextarea.value = keys.d;
};

signMessageButton.onclick = async function() {
    const message = messageTextarea.value;
    const messageBigInt = BigInt(stringToHex(message) || 0);
    const plainSignature = sign(messageBigInt, keys.d, keys.n);
    messageBigIntTextarea.value = messageBigInt;
    plainRsaSignatureTextarea.value = plainSignature;

}

verifyRsaSignatureButton.onclick = function() {
    const message = messageToVerifyTextarea.value;
    const signature = BigInt(rsaSignatureToVerifyTextarea.value || 0);
    const messageBigInt = BigInt(stringToHex(message) || 0);
    const decryptedMessage = decryptSignature(signature, keys.e, keys.n);
    const correct = messageBigInt === decryptedMessage;
    decryptedMessageBigIntTextarea.value = decryptedMessage;
    decryptedMessageTextarea.value = stringFromHex(decryptedMessage.toString(16));
    alert(`Подпись ${correct ? 'верефицирована' : 'не верефицирована'}`);
}