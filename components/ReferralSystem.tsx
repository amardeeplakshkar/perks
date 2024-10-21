import { useState, useEffect } from 'react'
import { initUtils } from '@telegram-apps/sdk'

interface ReferralSystemProps {
    initData: string
    userId: string
    startParam: string
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ initData, userId, startParam }) => {
    const [referrals, setReferrals] = useState<string[]>([])
    const [referrer, setReferrer] = useState<string | null>(null)
    const INVITE_URL = "https://t.me/cockscryptobot/start"

    useEffect(() => {
        const checkReferral = async () => {
            if (startParam && userId) {
                try {
                    const response = await fetch('/api/referrals', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, referrerId: startParam }),
                    })
                    if (!response.ok) throw new Error('Failed to save referral')
                } catch (error) {
                    console.error('Error saving referral:', error)
                }
            }
        }

        const fetchReferrals = async () => {
            if (userId) {
                try {
                    const response = await fetch(`/api/referrals?userId=${userId}`)
                    if (!response.ok) throw new Error('Failed to fetch referrals')
                    const data = await response.json()
                    setReferrals(data.referrals)
                    setReferrer(data.referrer)
                } catch (error) {
                    console.error('Error fetching referrals:', error)
                }
            }
        }

        checkReferral()
        fetchReferrals()
    }, [userId, startParam])

    const utils = initUtils() // Initialize utils only once

    const handleInviteFriend = () => {
        const inviteLink = `${INVITE_URL}?start=${userId}`
        const shareText = `Join me on this awesome Telegram mini app!`
        const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`

        try {
            utils.openTelegramLink(fullUrl) // Ensure the SDK method is called correctly
        } catch (error) {
            console.error('Error opening Telegram link:', error)
        }
    }

    const handleCopyLink = () => {
        const inviteLink = `${INVITE_URL}?start=${userId}`
        navigator.clipboard.writeText(inviteLink)
        alert('Invite link copied to clipboard!')
    }

    return (
        <div className="w-full max-w-md">
            {referrer && (
                <p className="mb-4 text-green-500">You were referred by user {referrer}</p>
            )}
            <div className="flex flex-col space-y-4">
                <button
                    onClick={handleInviteFriend}
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                    Invite Friend
                </button>
                <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
                >
                    Copy Invite Link
                </button>
            </div>
            {referrals.length > 0 && (
                <div className="mt-8">
                    <h2 className="mb-4 text-2xl font-bold">Your Referrals</h2>
                    <ul>
                        {referrals.map((referral, index) => (
                            <li key={index} className="p-2 mb-2 bg-gray-100 rounded">
                                User {referral}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default ReferralSystem
