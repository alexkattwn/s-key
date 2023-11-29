import { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCopy } from 'react-icons/bs'

import { markPasswordAsUsed } from '@/helpers/localStorage.helper'
import {
    generateTOTPPassword,
    verificationTOTPPassword,
} from '@/utils/TOTPPassword'

import CountdownTimer from './CountdownTimer'

// Секретный ключ
const secret: string = import.meta.env.VITE_APP_API_URL || 'secret_key_12345'
// Время жизни пароля в секундах
export const lifeTime = 30

const TOTPAuthentication: React.FC = () => {
    // Состояние для введенного пользователем пароля
    const [enteredPassword, setEnteredPassword] = useState<string>('')

    // Состояние для сгенерированного пароля
    const [generatedPassword, setGeneratedPassword] = useState<string>('')

    // Состояние для отслеживания успешной аутентификации
    const [authenticated, setAuthenticated] = useState<boolean>(false)

    // Обработчик для генерации одноразового пароля
    const handleGenerate = async (): Promise<void> => {
        // Генерируем одноразовый пароль с использованием секретного ключа и текущего времени
        const oneTimePassword = await generateTOTPPassword(secret)
        // Обновляем состояние сгенерированного пароля
        setGeneratedPassword(oneTimePassword || '')
    }

    // Обработчик для проверки одноразового пароля
    const handleAuthenticate = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        // Предотвращение перезагрузки страницы браузера
        e.preventDefault()
        // Если пароль не введен
        if (!enteredPassword) {
            toast.error('Пароль не введен')
            return
        }

        // Валидность пароля
        const isValid = await verificationTOTPPassword(secret, enteredPassword)

        // Проверяем, валиден ли пароль
        if (isValid) {
            // Если пароль верный, устанавливаем флаг аутентификации в true
            setAuthenticated(true)
            // Помечаем пароль как использованный
            await markPasswordAsUsed(enteredPassword)
            toast.success('Аутентификация успешна')
            return
        }

        // Если не валиден, устанавливаем флаг аутентификации в false и выводим сообщение об ошибке
        setAuthenticated(false)
        toast.error('Неверный пароль')
        return
    }

    // Обработчик для копирования пароля в буфер обмена
    const handleCopy = (): void => {
        // Копирование пароля в буфер
        navigator.clipboard.writeText(generatedPassword)
        toast.success('Пароль скопирован')
    }

    return (
        <div
            className='
                flex 
                flex-col 
                items-center 
                gap-5
                rounded-lg 
                h-full
            '
        >
            <h1
                className='
                    text-3xl 
                    font-bold 
                    pt-3 
                    text-neutral-200
                '
            >
                TOTP Аутентификация
            </h1>
            <div className='flex gap-4 max-[580px]:flex-col'>
                <div
                    className='
                        flex
                        items-center
                        justify-between
                        px-3
                        py-4
                        gap-1
                        min-h-[60px]
                        min-w-[235px]
                        bg-slate-700
                        rounded-md
                        text-neutral-400
                    '
                >
                    {generatedPassword && (
                        <>
                            <label>Пароль: </label>
                            <span className='hover:text-white transition'>
                                {generatedPassword}
                            </span>
                            <a
                                data-tooltip-id='tooltip'
                                data-tooltip-content='Скопировать'
                            >
                                <button
                                    className='w-fit h-fit'
                                    onClick={handleCopy}
                                >
                                    <BsCopy className='hover:text-white transition' />
                                </button>
                            </a>
                        </>
                    )}
                </div>
            </div>
            {!authenticated ? (
                <form
                    onSubmit={handleAuthenticate}
                    className='
                        flex
                        gap-4
                        py-6
                        max-[580px]:flex-col
                        items-center
                    '
                >
                    <input
                        type='text'
                        className='
                            flex
                            w-full
                            rounded-md
                            bg-neutral-700
                            border
                            border-transparent
                            px-3
                            py-3
                            text-sm
                            text-neutral-200
                            placeholder:text-neutral-400
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            focus:outline-none
                            focus:text-white
                            transition
                        '
                        placeholder='Введите пароль...'
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                    />
                    <button
                        type='submit'
                        className='
                            w-56
                            rounded-full
                            bg-green-500
                            border-transparent
                            px-3
                            py-3
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            text-black
                            font-bold
                            hover:opacity-75
                            transition
                        '
                    >
                        Войти
                    </button>
                </form>
            ) : (
                <>
                    <button
                        onClick={() => {
                            setAuthenticated(!authenticated)
                            setEnteredPassword('')
                        }}
                        className='
                            w-32
                            rounded-full
                            bg-green-500
                            border-transparent
                            px-3
                            py-3
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            text-black
                            font-bold
                            hover:opacity-75
                            transition
                        '
                    >
                        Назад
                    </button>
                    <h2
                        className='
                            text-center
                            text-2xl 
                            font-bold 
                            text-neutral-200
                        '
                    >
                        Вы успешно аутентифицированы!
                    </h2>
                </>
            )}
            <CountdownTimer
                handleGenerate={handleGenerate}
                lifeTime={lifeTime}
            />
        </div>
    )
}

export default TOTPAuthentication
