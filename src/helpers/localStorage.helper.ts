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
