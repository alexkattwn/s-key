import { assert, describe, it, expect } from 'vitest'

import {
    formatTime,
    millisecondsToSeconds,
    secondsToMilliseconds,
} from '@/helpers/formatTime.helper'

describe('Тестирование функций для форматирования времени', () => {
    it('Миллисекунды в секунды', () => {
        assert.equal(millisecondsToSeconds(3000), 3)
    })

    it('Секунды в миллисекунды', () => {
        expect(secondsToMilliseconds(45)).toBe(45000)
    })

    it('Для таймера', () => {
        expect(formatTime(2)).toBe('02')
    })
})
