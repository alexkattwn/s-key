import { useState } from 'react'
import { motion } from 'framer-motion'

import SKeyAuthentication from './components/SKeyAuthentication'
import TOTPAuthentication from './components/TOTPAuthentication'

import { containerVariants } from './utils/animation'

const App = () => {
    const [isSKey, setIsSKey] = useState<boolean>(true)

    return (
        <motion.div
            className='
                flex
                flex-col
                items-center
                bg-neutral-900
                rounded-lg 
                h-[100vh]
                w-full 
            '
            initial='hidden'
            animate='visible'
            variants={containerVariants}
        >
            <button
                className='   
                    mt-3                         
                    w-56
                    rounded-full
                    bg-neutral-600
                    border-transparent
                    px-3
                    py-3
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    text-slate-300
                    font-bold
                    hover:opacity-75
                    transition
                '
                onClick={() => setIsSKey(!isSKey)}
            >
                Переключить на {isSKey ? 'TOTP' : 'SKey'}
            </button>
            {isSKey ? <SKeyAuthentication /> : <TOTPAuthentication />}
        </motion.div>
    )
}

export default App
