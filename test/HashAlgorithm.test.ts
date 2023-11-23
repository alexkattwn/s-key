import { assert, describe, it, expect, test } from 'vitest'

import { sha256, simpleHash } from '@/utils/HashAlgorithm'

test('Простое хеширование', () => {
    expect(simpleHash('test-string-6')).toBe(729671765)
    expect(simpleHash('test-string-7')).toBe(729671766)
})

describe('SHA-256', () => {
    it('1 тест', () => {
        assert.equal(sha256('test-string'), '3415ff')
    })

    it('2 тест', () => {
        expect(sha256('test-string-5')).toBe('079abf')
    })

    it('3 тест', () => {
        expect(sha256('test-string-2-12340594')).toBe('410e5a')
    })

    it('snapshot', () => {
        expect({ hash: '410e5a' }).toMatchSnapshot()
    })
})
