'use client'

import ReferralSystem from '../../../components/ReferralSystem'
import { useEffect, useState } from 'react'

export default function Home() {
    const [initData, setInitData] = useState('')
    const [userId, setUserId] = useState('')
    const [startParam, setStartParam] = useState('')

    useEffect(() => {
        const initWebApp = async () => {
            if (typeof window !== 'undefined') {
                const WebApp = (await import('@twa-dev/sdk')).default;
                WebApp.ready();
                setInitData(WebApp.initData);
                setUserId(WebApp.initDataUnsafe.user?.id.toString() || '');
                setStartParam(WebApp.initDataUnsafe.start_param || '');
            }
        };

        initWebApp();
    }, [])

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-24">
            <h1 className="mb-8 text-4xl font-bold">Telegram Referral Demo</h1>
            <ReferralSystem initData={initData} userId={userId} startParam={startParam} />
        </main>
    )
}