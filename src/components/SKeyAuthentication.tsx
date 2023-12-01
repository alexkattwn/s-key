import { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCopy } from 'react-icons/bs'
import { motion } from 'framer-motion'

import {
    generateSKeyPassword,
    verificationSKeyPassword,
} from '@/utils/SKeyPassword'
import {
    getCounterFromLocalStorage,
    setCounterInLocalStorage,
} from '@/helpers/localStorage.helper'
import { containerVariants } from '@/utils/animation'

const SKeyAuthentication: React.FC = () => {
    // Состояние для счетчика
    const [counter, setCounter] = useState<number>(
        getCounterFromLocalStorage() + 1
    )

    // Состояние для введенного пользователем пароля
    const [enteredPassword, setEnteredPassword] = useState<string>('')

    // Состояние для сгенерированного пароля
    const [generatedPassword, setGeneratedPassword] = useState<string>('')

    // Состояние для введенного пользователем кода
    const [enteredCode, setEnteredCode] = useState<string>('')

    // Состояние для отслеживания успешной аутентификации
    const [authenticated, setAuthenticated] = useState<boolean>(false)

    // Обработчик для генерации одноразового пароля
    const handleGenerate = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        // Предотвращение перезагрузки страницы браузера
        e.preventDefault()
        // Если пароль не введен
        if (!enteredCode) {
            toast.error('Код для генерации не введен')
            return
        }
        // Генерация пароля
        const newPassword = await generateSKeyPassword(enteredCode, counter)
        // Изменение состояния для сгенерированного пароля
        setGeneratedPassword(newPassword)
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

        // Проверка пароля
        const isValid = await verificationSKeyPassword(
            enteredPassword,
            enteredCode,
            counter
        )

        if (isValid) {
            // Обновление счетчика
            setCounter((prev) => prev + 1)
            setAuthenticated(true)
            toast.success('Аутентификация успешна')
            // Сохранение счетчика в локальной памяти браузера
            setCounterInLocalStorage(counter)
            return
        }

        // Если пароль неверный, устанавливаем флаг аутентификации в false и выводим сообщение об ошибке
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
        <motion.div
            className='
                flex 
                flex-col 
                items-center 
                gap-4
                h-full
            '
            initial='hidden'
            animate='visible'
            variants={containerVariants}
        >
            <h1
                className='
                    text-3xl 
                    font-bold 
                    pt-3 
                    text-neutral-200
                '
            >
                S/Key Аутентификация
            </h1>
            <form
                className='flex gap-4 max-[580px]:flex-col'
                onSubmit={handleGenerate}
            >
                <button
                    type='submit'
                    className='
                        w-80
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
                    Сгенерировать
                </button>
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
                    placeholder='Введите код...'
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                />
            </form>
            <div
                className='
                    flex
                    items-center
                    justify-between
                    px-3
                    py-4
                    gap-1
                    w-[350px]
                    min-h-[60px]
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
            {!authenticated ? (
                <form
                    onSubmit={handleAuthenticate}
                    className='
                        flex
                        max-[480px]:flex-col
                        items-center
                        gap-4
                    '
                >
                    <input
                        type='text'
                        className='
                            flex
                            w-80
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
                <motion.div
                    className='flex flex-col items-center gap-3'
                    initial='hidden'
                    animate='visible'
                    variants={containerVariants}
                >
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
                </motion.div>
            )}
        </motion.div>
    )
}

export default SKeyAuthentication
