const CHAR_SIZE = 16;//Размер символа в битах (кратно 8ми)
const BLOCK_SIZE64 = 64;//Размер блока 64 бита
const BLOCK_SIZE32 = 32;//Размер блока 32 бита
const ADD_MOD = 4294967296;//Для сложения по модулю 2^32
const ROUNDS_COUNT = 32;
const S_BLOCKS = [
    [9,6,3,2,8,11,1,7,10,4,14,15,12,0,13,5],
    [3,7,14,9,8,10,15,0,5,2,6,12,11,4,13,1],
    [14,4,6,2,11,3,13,8,12,15,5,10,0,7,1,9],
    [14,7,10,12,13,1,3,9,0,2,11,4,15,8,5,6],
    [11,5,1,9,8,13,15,0,14,4,2,3,12,7,10,6],
    [3,10,13,12,1,2,0,11,7,5,9,4,8,15,14,6],
    [1,13,2,9,7,10,6,0,8,12,4,5,15,3,11,14],
    [11,10,15,5,0,12,14,8,6,2,3,9,1,7,13,4]
]


class GOST {
    //Массив ключей k
    keyArr;

    setKey(key) {
        //Разбить 256бит ключ на 8 32бит ключей k0...k7
        const binaryKey = this.textToPseudoBinary(key);
        this.keyArr = this.splitPseudoBinary(binaryKey, 8);
    }
    textToPseudoBinary(text, charSize = CHAR_SIZE) {
        let answer = "";
        for (let i = 0; i < text.length; i++) {
            const pseudoBinary = text.charCodeAt(i).toString(2);
            const placeholder = '0'.repeat(charSize - pseudoBinary.length)
            answer += placeholder + pseudoBinary;
        }
        return answer
    }

    pseudoBinaryToInt(pseudoBinary) {
        return parseInt(pseudoBinary, 2)
    }

    intToPseudoBinary(int, charSize) {
        let answer = "";
        const pseudoBinary = int.toString(2);
        const placeholder = '0'.repeat(charSize - pseudoBinary.length)
        answer += placeholder + pseudoBinary;
        return answer
    }

    parseTextFromPseudoBinary(pseudoBinary, charSize) {
        let answer = "";
        const charsCount = pseudoBinary.length / charSize;
        for (let i = 0; i < charsCount; i++) {
            answer += String.fromCharCode(this.pseudoBinaryToInt(pseudoBinary.substr(i * charSize, charSize)))
        }
        return answer
    }

    //Разделение двоичного представления на partsCount
    splitPseudoBinary(pseudoBinary, partsCount) {
        const pseudoBinarySplit = []
        const partSize = pseudoBinary.length/partsCount
        for (let i = 0; i < partsCount; i++) {
            pseudoBinarySplit.push(pseudoBinary.substr(i * partSize, partSize))
        }
        return pseudoBinarySplit
    }

    pseudoXor(a,b) {
        let answer = ""
        const length = a.length;

        for (let i = 0; i < length; i++) {
            let pseudoBit;
            if(a[i] === b[i]) pseudoBit = '0'
            else pseudoBit = '1'
            answer += pseudoBit
        }

        return answer;
    }

    pseudoAddMod(a,b,mod) {
        const aInt = this.pseudoBinaryToInt(a)
        const bInt = this.pseudoBinaryToInt(b)
        let answer = (aInt + bInt) % mod
        return this.intToPseudoBinary(answer, a.length);
    }

    shiftLeftPseudo(pseudoBinary, n) {
        for (let i = 0; i < n; i++) {
            pseudoBinary = pseudoBinary.substr(1) + pseudoBinary.substr(0,1);
        }
        return pseudoBinary
    }

    f(A, X) {
        //Сложение по модулю
        const binarySum = this.pseudoAddMod(A,X,ADD_MOD);

        //Разбить на 8 4х-битовых подпоследовательностей
        const ASplit = this.splitPseudoBinary(binarySum,8);
        const ASplitMutated = [];
        //Для каждого 4бит блока произвести замену через S-блок
        for (let i = 0; i < ASplit.length; i++) {
            const AInt = this.pseudoBinaryToInt(ASplit[i])
            ASplitMutated.push(this.intToPseudoBinary(S_BLOCKS[i][AInt],4))
        }

        //Объединить блоки в 32 бита
        let answer = ASplitMutated.join("");
        //Сдвиг влево на 11 битов
        return this.shiftLeftPseudo(answer, 11)
    }

    encrypt(message, key) {
        this.setKey(key);
        let messageBinary = this.textToPseudoBinary(message)

        //Добить нулями до 64 бит
        const zero = '0'.repeat(CHAR_SIZE)
        while(messageBinary.length % BLOCK_SIZE64) {
            messageBinary = zero + messageBinary
        }
        //Разбить текст на блоки 64 бита
        const messageBinarySplit64 = this.splitPseudoBinary(messageBinary, messageBinary.length/BLOCK_SIZE64)

        //Разбить каждый 64-битный блок текста на две половины по 32 бита T0 = (A0, B0)
        const messageBinarySplit32 = []
        messageBinarySplit64.forEach(block64 => {
            messageBinarySplit32.push(this.splitPseudoBinary(block64, 2));
        })

        //32 раунда херни
        for (let i = 0; i < ROUNDS_COUNT; i++) {
            //Получение ключа Xi
            const xIndex = (i < 24) ? i % this.keyArr.length : 7 - i % this.keyArr.length;
            const X = this.keyArr[xIndex];

            //Обход по каждому 64-бит блоку
            for (let j = 0; j < messageBinarySplit32.length; j++) {
                let buf = messageBinarySplit32[j][0].toString();
                const idkHowToName = this.f(messageBinarySplit32[j][0],X);
                messageBinarySplit32[j][0] = this.pseudoXor(messageBinarySplit32[j][1], idkHowToName)//Ai+1 = Bi ^ f(Ai, Xi)
                messageBinarySplit32[j][1] = buf;//Bi+1 = Ai
            }
        }

        let answerBinary64 = [];

        //Объединиение 32бит блоков
        messageBinarySplit32.forEach(block64 => {
            answerBinary64.push(block64.join(""));
        })

        //Объединение 64бит блоков
        let answerBinary = answerBinary64.join("");
        let answer = this.parseTextFromPseudoBinary(answerBinary, CHAR_SIZE)
        return answer
    }

    decrypt(message,key) {
        this.setKey(key);
        let messageBinary = this.textToPseudoBinary(message)
        const zero = '0'.repeat(CHAR_SIZE)
        // Разбить текст на блоки 64 бита
        while(messageBinary.length % BLOCK_SIZE64) {
            messageBinary += zero
        }

        // let messageBinary = message;
        const messageBinarySplit64 = this.splitPseudoBinary(messageBinary, messageBinary.length/BLOCK_SIZE64)

        //Разбить каждый 64-битный блок текста на две половины по 32 бита T0 = (A0, B0)
        const messageBinarySplit32 = []
        messageBinarySplit64.forEach(block64 => {
            messageBinarySplit32.push(this.splitPseudoBinary(block64, 2));
        })

        //32 раунда херни
        for (let i = 0; i < ROUNDS_COUNT; i++) {
            const xIndex = (i < 8) ? i % this.keyArr.length : 7 - i % this.keyArr.length;
            const X = this.keyArr[xIndex];

            //Обход по каждому 64-бит блоку
            for (let j = 0; j < messageBinarySplit32.length; j++) {
                const buf = messageBinarySplit32[j][1].toString();
                const idkHowToName = this.f(messageBinarySplit32[j][1],X);
                messageBinarySplit32[j][1] = this.pseudoXor(messageBinarySplit32[j][0], idkHowToName)
                messageBinarySplit32[j][0] = buf;
            }
        }
        let answerBinary64 = [];
        messageBinarySplit32.forEach(block64 => {
            answerBinary64.push(block64.join(""));
        })
        let answerBinary = answerBinary64.join("");
        let answer = this.parseTextFromPseudoBinary(answerBinary, CHAR_SIZE)
        return answer
    }
}
