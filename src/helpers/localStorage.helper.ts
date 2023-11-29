// Проверка, использован ли уже пароль
export async function checkIfPasswordUsed(
    passwordHash: string
): Promise<boolean> {
    const usedPassword = localStorage.getItem(passwordHash)
    return Boolean(usedPassword)
}

// Маркировка пароля как использованного
export async function markPasswordAsUsed(passwordHash: string): Promise<void> {
    localStorage.setItem(passwordHash, 'used')
}

// Получение текущего значения счетчика
export const getCounterFromLocalStorage = (): number => {
    const value = localStorage.getItem('counter')
    return value ? +value : 0
}

// Установка текущего значения счетчика
export const setCounterInLocalStorage = (counter: number): void =>
    localStorage.setItem('counter', JSON.stringify(counter))
