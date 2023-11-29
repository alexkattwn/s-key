// Функция генерации одноразового пароля
export async function generateSKeyPassword(
    code: string,
    counter: number
): Promise<string> {
    // Составление строки для хеша
    const stringForHash = `${code}-${counter}`
    // Генерация хеша
    const hash = await generateSHA256Hash(stringForHash)
    // Возврат строки из первых 6 символов хеша
    return hash.slice(0, 6)
}

// Функция проверки одноразового пароля
export async function verificationSKeyPassword(
    enteredPassword: string,
    code: string,
    counter: number
): Promise<boolean> {
    // Генерация пароля
    const password = await generateSKeyPassword(code, counter)
    // Проверка пароля
    return enteredPassword === password
}

// Генрерация SHA-256 хеша
export async function generateSHA256Hash(data: string): Promise<string> {
    // Перобразование входной строки к UTF-8
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)

    // Вычисление хеша
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer)

    // Преобразование хэша в шестнадцатеричную строку
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('')

    return hashHex
}
