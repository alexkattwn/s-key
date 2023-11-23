// Функция для форматирования миллисекунд в секунды
export const millisecondsToSeconds = (milliseconds: number): number => {
    const seconds = Math.ceil(milliseconds / 1000)
    return seconds
}

// Функция для форматирования секунд в миллисекунды
export const secondsToMilliseconds = (seconds: number): number => {
    const milliseconds = Math.ceil(seconds * 1000)
    return milliseconds
}

// Форматирование времени для таймера
export const formatTime = (time: number): string => {
    const seconds = time % 60
    return `${String(seconds).padStart(2, '0')}`
}
