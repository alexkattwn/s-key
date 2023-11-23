// Реализация алгоритма хеширования SHA256
export function sha256(input: string): string {
    // Преобразование строку в байтовый массив
    function stringToBytes(str: string): number[] {
        // Создание пустого массива bytes для хранения байтов
        const bytes: number[] = []
        // Цикл по символам в строке
        for (let i = 0; i < str.length; ++i) {
            // Преобразование каждого символа в его код и добавление в массив байтов
            bytes.push(str.charCodeAt(i) & 0xff)
        }
        // Возвращение массива байтов
        return bytes
    }

    // Дополнение сообщения
    function padMessage(message: number[]): number[] {
        // Вычисление длины сообщения в битах
        const bitLength = message.length * 8
        // Инициализация массива padding с начальным байтом 0x80
        const padding = [0x80]
        // Вычисление длины дополнения нулями
        const zeroPadLength = ((448 - bitLength - 1 + 512) % 512) / 8
        // Цикл для добавления нулевых байтов
        for (let i = 0; i < zeroPadLength; ++i) {
            // Добавление нулевого байта в массив дополнения
            padding.push(0x00)
        }
        // Инициализация массива lengthBytes для хранения длины сообщения в битах
        const lengthBytes: number[] = []
        // Цикл для добавления байтов длины сообщения
        for (let i = 0; i < 8; ++i) {
            // Добавление байта длины сообщения в массив
            lengthBytes.push((bitLength >>> (56 - i * 8)) & 0xff)
        }
        // Возвращение массива, объединяя сообщение, дополнение и длину сообщения
        return [...message, ...padding, ...lengthBytes]
    }

    // Циклический сдвиг битов вправо
    function rightRotate(value: number, shift: number): number {
        // Возвращение результата сдвига
        return (value >>> shift) | (value << (32 - shift))
    }

    // Инициализация массива констант K, используемых в алгоритме SHA-256
    const K: number[] = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
        0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
        0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
        0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
        0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
        0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ]

    // Инициализация массива переменных H, которые представляют текущий хеш
    let H: number[] = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
        0x1f83d9ab, 0x5be0cd19,
    ]

    // Преобразование входной строки в массив байтов и добавление дополнения
    const paddedMessage = padMessage(stringToBytes(input))

    // Цикл обработки блоков длиной 64 байта
    for (let i = 0; i < paddedMessage.length; i += 64) {
        // Выделение текущего блока из сообщения
        const block = paddedMessage.slice(i, i + 64)
        // Инициализация массива для хранения слов в блоке
        const words = new Array(64)
        // Цикл для заполнения первых 16 слов в блоке
        for (let j = 0; j < 16; ++j) {
            // Составление слова из 4 байтов
            words[j] =
                (block[j * 4] << 24) |
                (block[j * 4 + 1] << 16) |
                (block[j * 4 + 2] << 8) |
                block[j * 4 + 3]
        }
        // Цикл для расчета остальных 48 слов в блоке
        for (let j = 16; j < 64; ++j) {
            // Вычисление S0
            const s0 =
                rightRotate(words[j - 15], 7) ^
                rightRotate(words[j - 15], 18) ^
                (words[j - 15] >>> 3)
            // Вычисление S1
            const s1 =
                rightRotate(words[j - 2], 17) ^
                rightRotate(words[j - 2], 19) ^
                (words[j - 2] >>> 10)
            // Расчет нового слова
            words[j] = (words[j - 16] + s0 + words[j - 7] + s1) & 0xffffffff
        }
        // Деструктуризация переменных H
        let [a, b, c, d, e, f, g, h] = H
        // Цикл обработки каждого слова в блоке
        for (let j = 0; j < 64; ++j) {
            // Вычисление S1
            const S1 =
                rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)
            // Вычисление ch
            const ch = (e & f) ^ (~e & g)
            const temp1 = (h + S1 + ch + K[j] + words[j]) & 0xffffffff

            const S0 =
                rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)
            const maj = (a & b) ^ (a & c) ^ (b & c)
            const temp2 = (S0 + maj) & 0xffffffff

            // Обновляем переменные состояния
            h = g
            g = f
            f = e
            e = (d + temp1) & 0xffffffff
            d = c
            c = b
            b = a
            a = (temp1 + temp2) & 0xffffffff
        }

        // Обновляем переменные состояния
        H[0] = (H[0] + a) & 0xffffffff
        H[1] = (H[1] + b) & 0xffffffff
        H[2] = (H[2] + c) & 0xffffffff
        H[3] = (H[3] + d) & 0xffffffff
        H[4] = (H[4] + e) & 0xffffffff
        H[5] = (H[5] + f) & 0xffffffff
        H[6] = (H[6] + g) & 0xffffffff
        H[7] = (H[7] + h) & 0xffffffff
    }

    // Формируем итоговый хеш
    const hashArray = H.map((h) => h.toString(16).padStart(8, '0'))
    // Превращаем массив символов в строку и заменяем в этой строке - на ''
    let hashStr = hashArray.join('').replace(/-/g, '')
    // Обрезаем первые 6 символов
    hashStr = hashStr.slice(0, 6)
    return hashStr
}

// Реализация простого хеширования
export function simpleHash(input: string): number {
    // Инициализация переменной hash с начальным значением 0
    let hash = 0

    // Проверка, если входная строка пуста, то возвращается текущее значение hash (0)
    if (input.length === 0) {
        return hash
    }

    // Цикл по каждому символу входной строки
    for (let i = 0; i < input.length; i++) {
        // Получение кода символа на текущей позиции
        const char = input.charCodeAt(i)

        // Простой алгоритм хеширования: умножение текущего значения hash на 32 и добавление кода символа
        hash = (hash << 5) - hash + char

        // Преобразование hash в 32-битное целое число (очищение старших битов)
        hash = hash & hash
    }

    // Возвращение итогового значения hash после обработки всех символов входной строки
    return hash
}
