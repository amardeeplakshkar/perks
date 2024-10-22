import { useState, useEffect } from 'react';
import { initUtils } from '@telegram-apps/sdk';
import Image from "next/image";
import Link from "next/link";

// Define a type for referral objects
interface Referral {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
}

interface ReferralSystemProps {
  initData: string;
  userId: string;
  startParam: string;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ initData, userId, startParam }) => {
  // Referrals should now hold an array of Referral objects
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referrer, setReferrer] = useState<Referral | null>(null);
  const INVITE_URL = "https://t.me/cockscryptobot/start";
  const preventInteraction = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    const checkReferral = async () => {
      if (startParam && userId) {
        try {
          const response = await fetch('/api/referrals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, referrerId: startParam }),
          });
          if (!response.ok) throw new Error('Failed to save referral');
        } catch (error) {
          console.error('Error saving referral:', error);
        }
      }
    };

    const fetchReferrals = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/referrals?userId=${userId}`);
          if (!response.ok) throw new Error('Failed to fetch referrals');
          const data = await response.json();
          setReferrals(data.referrals); // data.referrals is an array of Referral objects
          setReferrer(data.referrer); // referrer is a single object
        } catch (error) {
          console.error('Error fetching referrals:', error);
        }
      }
    };

    checkReferral();
    fetchReferrals();
  }, [userId, startParam]);

  const handleInviteFriend = () => {
    const utils = initUtils();
    console.log('utils:', utils); // Check if utils is initialized correctly
    const inviteLink = `${INVITE_URL}?startapp=${userId}`;
    const shareText = `Join the fun at @cocks_community . 
    Lets crow and rule the roost`;
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;

    try {
      utils.openTelegramLink(fullUrl);
    } catch (error) {
      console.error('Error opening Telegram link with SDK:', error);
      window.open(fullUrl, '_blank'); // Fallback
    }
  };

  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`;
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  return (
    <main className="relative flex flex-col items-center h-screen p-2">
      <h2 className="py-2 text-2xl font-bold text-center">
        Invite Friends and <br /> get more $COCKS
      </h2>
      <Image
        src='/6.png'
        alt="Cocks Logo"
        height={150}
        width={150}
        className="no-interaction"
        onContextMenu={preventInteraction}
        onTouchStart={preventInteraction}
        draggable={false}
      />
      <div className="flex flex-col w-full mb-2 space-y-2">
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
      <h3 className="text-xl font-bold place-self-start">Total Friends</h3>
      <div className="flex-grow overflow-y-auto max-h-[calc(100vh-80vh)] w-full overflow-x-hidden">
      {referrals.length > 0 && (
        <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold">Your Referrals</h2>
          <ul>
            {referrals.map((referral, index) => (
              <li key={index} className="p-2 mb-2 bg-gray-100 rounded">
                User {referral.firstName} {referral.lastName} ({referral.username || 'No username'}) - Telegram ID: {referral.telegramId}
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </main>
  );
};

export default ReferralSystem;
