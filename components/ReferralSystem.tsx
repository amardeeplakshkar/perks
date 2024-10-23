import { useState, useEffect } from 'react';
import { initUtils } from '@telegram-apps/sdk';
import Image from "next/image";
import { toast } from 'react-toastify'; // Import ToastContainer and toast
import Loader from './Loader'; // Import the Loader component

interface Referral {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  profilePicUrl?: string; // Add this if needed
}

interface ReferralSystemProps {
  initData: string;
  userId: string;
  startParam: string;
}

const getRandomBrightColorClass = () => {
  const brightColors = [
    "bg-yellow-500",
    "bg-green-400",
    "bg-pink-500",
    "bg-blue-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-teal-400",
    "bg-orange-500",
  ];
  return brightColors[Math.floor(Math.random() * brightColors.length)];
};

const ReferralSystem: React.FC<ReferralSystemProps> = ({ initData, userId, startParam }) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referrer, setReferrer] = useState<Referral | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null); // State for profile picture
  const [loading, setLoading] = useState<boolean>(true);
  const INVITE_URL = "https://t.me/cockscryptobot/start";
  const RandomColor = getRandomBrightColorClass();

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

    const extractProfilePic = () => {
      try {
        const data = JSON.parse(initData);
        if (data && data.photo_url) {
          setProfilePic(data.photo_url); // Assuming photo_url is the key for the profile pic
        }
      } catch (error) {
        console.error('Error parsing initData:', error);
      }
    };

    const fetchAllData = async () => {
      await checkReferral();
      await fetchReferrals();
      extractProfilePic();
      setLoading(false); // Set loading to false once all data is fetched
    };

    fetchAllData();
  }, [userId, initData, startParam]);

  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}?startapp=${userId}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  if (loading) {
    return <Loader />; // Show Loader while data is being fetched
  }

  return (
    <main className="relative flex flex-col items-center h-screen py-1">
      <h2 className="py-2 text-2xl font-bold text-center">
        Invite Friends and <br /> get more $COCKS
      </h2>
      <Image
        src='/6.png'
        alt="Cocks Logo"
        height={150}
        width={150}
        className="no-interaction"
      />
      <div className="flex flex-col w-full mb-2 space-y-2">
        <button
          onClick={handleCopyLink}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Copy Invite Link
        </button>
      </div>
      <h3 className="text-xl font-bold place-self-start">Total Friends</h3>
      <div className="flex-grow overflow-y-auto max-h-[calc(100dvh-70dvh)]  w-full overflow-x-hidden ">
        {referrals.length > 0 && (
          <>
            {referrals.map((referral, index) => (
              <div key={index}
                className={`flex justify-between items-center p-2 rounded-lg w-full bg-slate-500/20 mt-1`}
              >
                <div className="flex justify-center items-center gap-2">
                  <div
                    className={`h-[3rem] aspect-square rounded-full uppercase flex justify-center items-center ${RandomColor}`}
                  >
                    {profilePic ? (
                      <Image
                        src={profilePic}
                        alt="User Profile Picture"
                        height={150}
                        width={150}
                        className="rounded-full"
                      />
                    ) : (
                      <span>{referral.username.slice(0, 2) || referral.firstName.slice(0, 2)}</span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold">{referral.username || referral.firstName}</h4>
                  </div>
                </div>
                <p className="font-bold">+500</p>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
};

export default ReferralSystem;
