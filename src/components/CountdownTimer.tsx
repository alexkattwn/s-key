import React, { useState, useEffect } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

import { formatTime, millisecondsToSeconds } from '@/helpers/formatTime.helper'

interface CountdownTimerProps {
    // Функция генерации пароля
    handleGenerate: () => Promise<void>
    // Время жизни пароля
    lifeTime: number
}

// Круглый таймер обратного отсчета
const CountdownTimer: React.FC<CountdownTimerProps> = ({
    handleGenerate,
    lifeTime,
}) => {
    // Состояние для таймера
    const [timeLeft, setTimeLeft] = useState(
        Math.floor(30 - (millisecondsToSeconds(Date.now()) % lifeTime))
    )

    useEffect(() => {
        // Задается интервал в 1 секунду
        const intervalId = setInterval(() => {
            // Переменная в состоянии уменьшается на 1
            setTimeLeft((prevTime) => prevTime - 1)
        }, 1000)

        // Генерация пароля при запуске приложения
        handleGenerate()

        // При размонтировании компонента интервал анулируется
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        // Если таймер дошел до 0
        if (timeLeft === 0) {
            // Рестарт таймера
            setTimeLeft(lifeTime)
            // Генерация пароля
            handleGenerate()
        }
    }, [timeLeft])

    // Вычисление процентов для заполнения круга
    const percentage = (timeLeft / lifeTime) * 100

    return (
        <div className='w-100 mx-auto'>
            <div>
                <CircularProgressbar
                    value={percentage}
                    text={formatTime(timeLeft)}
                    styles={buildStyles({
                        textSize: '16px',
                        pathColor: 'rgb(34 197 94)',
                        textColor: '#f88',
                        trailColor: 'rgb(38 38 38)',
                        backgroundColor: '#3e98c7',
                    })}
                />
            </div>
        </div>
    )
}

export default CountdownTimer
