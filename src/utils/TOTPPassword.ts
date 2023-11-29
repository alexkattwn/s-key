import { lifeTime } from '@/components/TOTPAuthentication'
import { checkIfPasswordUsed } from '@/helpers/localStorage.helper'
import { millisecondsToSeconds } from '@/helpers/formatTime.helper'

// Генерация одноразового пароля
export async function generateTOTPPassword(
    secret: string
): Promise<string | null> {
    // Получаем текущую временную метку в секундах
    const timestamp = millisecondsToSeconds(Date.now())

    // Вычисляем сколько раз пройдет указанный временной интервал с момента указанного времени (timestamp)
    const counter = Math.floor(timestamp / lifeTime)

    // Строка данных для хеширования, включающая секрет и счетчик
    const data = `${secret}-${counter}`

    // Преобразуем строку в ArrayBuffer
    const buffer = textToArrayBuffer(data)

    // Используем асинхронный метод API SubtleCrypto для хеширования данных алгоритмом SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)

    // Преобразуем результат хеширования из ArrayBuffer в строку
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('')

    try {
        // Получаем первые 6 символов хеша в качестве одноразового пароля
        const receivedPassword = hashHex.substr(0, 6)
        // Проверяем, не использован ли уже этот пароль
        const isUsed = await checkIfPasswordUsed(receivedPassword)

        if (isUsed) {
            // Пароль уже использован
            return null
        }

        return receivedPassword
    } catch (error) {
        console.error('Ошибка при проверке и маркировке пароля:', error)
        return null
    }
}

// Функция проверки пароля
export async function verificationTOTPPassword(
    secret: string,
    password: string
): Promise<boolean> {
    // Генерируем новый пароль
    const newPassword = await generateTOTPPassword(secret)
    // Если сгенерированный пароль идентичен введенному
    if (newPassword === password) {
        return true
    }

    return false
}

// Преобразование строки в ArrayBuffer
function textToArrayBuffer(text: string): ArrayBuffer {
    // Создаем экземпляр TextEncoder для преобразования текста в бинарный формат
    const encoder = new TextEncoder()
    // Возвращаем ArrayBuffer, представляющий текст
    return encoder.encode(text)
}
