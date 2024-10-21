'use client'; // Required for Next.js app directory

import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Loader from "./Loader.jsx";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WelcomeSlider = () => {
    const router = useRouter();
    const sliderRef = useRef(null);
    const [animateProgress, setAnimateProgress] = useState(false);
    const [randomValue, setRandomValue] = useState(0);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const value = Math.floor(Math.random() * (1500 - 700 + 1)) + 700;
        setRandomValue(value);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();

            const initDataUnsafe = tg.initDataUnsafe || {};

            if (initDataUnsafe.user) {
                fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(initDataUnsafe.user),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.error) {
                            setError(data.error);
                        } else {
                            setUser(data || {});
                        }
                        setLoading(false);
                    })
                    .catch((err) => {
                        setError('Failed to fetch user data: ' + err.message);
                        setLoading(false);
                    });
            } else {
                setError('No user data available');
                setLoading(false);
            }
        } else {
            setError('This app should be opened in Telegram');
            setLoading(false);
        }
    }, []);

    const handleClaimPoints = async () => {
        try {
            const response = await fetch('/api/claim-points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    telegramId: user?.telegramId,
                    points: randomValue + 527,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`🎉 Points claimed! You now have ${data.user.points} points.`);
                router.push("/"), 3000; // Redirect after 3 seconds
            } else {
                toast.error(data.error || 'Something went wrong.');
            }
        } catch (err) {
            console.error('Error claiming points:', err);
            toast.error('Failed to claim points.');
        }
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        swipe: false,
        beforeChange: (oldIndex, newIndex) => {
            setAnimateProgress(newIndex === 1);
        },
    };

    const handleNext = () => {
        sliderRef.current?.slickNext();
    };

    if (loading) return <Loader />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="max-w-[100dvw] max-h-[90dvh] bg-black text-white bg-[url('https://i.pinimg.com/originals/cf/ec/88/cfec8819d8376a57c86e3c6e53ed618e.gif')]">
            <Slider ref={sliderRef} {...settings}>
                {/* Slide 1 */}
                <div className="flex flex-col items-center justify-center relative h-screen py-[6rem]">
                    <div className="flex justify-center items-center">
                        <div className="w-36 h-36 mb-6 bg-cover bg-[url('https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Star%20Struck.webp')]" />
                    </div>
                    <h2 className="text-3xl mb-4 text-center">👋 Hey {
                        user?.firstName ||
                        'there'}!</h2>
                    <p className="text-lg text-center px-4">
                        Welcome back! Get ready to claim your rewards 🐔
                    </p>
                    <div className="absolute bottom-[5rem] w-full">
                        <button
                            onClick={handleNext}
                            className="mt-6 px-6 py-3 w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                        >
                            Wow, let's go!!!
                        </button>
                    </div>
                </div>

                {/* Slide 2 */}
                <div className="flex flex-col items-center justify-center h-screen relative">
                    <h2 className="text-2xl mb-6 text-center">🔍 Checking Your Account...</h2>
                    <div className="py-[4.5rem]">
                        {['Calculating Check Count', 'Activity Level Analysis', 'Checking OG Status'].map((title, index) => (
                            <div className="mb-4" key={index}>
                                <p className="py-3 text-sm">{title}</p>
                                <div className="w-full bg-gray-800 rounded-full h-4">
                                    <div
                                        className={`h-4 rounded-full ${index === 0 ? 'bg-sky-500' : index === 1 ? 'bg-emerald-500' : 'bg-yellow-500'
                                            } ${animateProgress ? 'w-full' : 'w-0'} transition-all duration-2000 ease-in-out delay-${index * 500}`}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-[5rem] w-full">
                        <button
                            onClick={handleNext}
                            className="mt-6 px-6 py-3 w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                        >
                            Continue
                        </button>
                    </div>
                </div>

                {/* Slide 3 */}
                <div className="flex flex-col items-center justify-center h-screen py-[4rem] relative">
                    <h1 className="text-4xl mb-2 text-center">Raising Star!</h1>
                    <p className="text-lg mb-4 text-center">You’ve Joined Telegram</p>
                    <div className="flex justify-center items-center">
                        <div className="text-7xl font-bold mb-2 h-[15rem] w-[15rem] bg-cover bg-[url('https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Animals%20and%20Nature/Unicorn.webp')] flex justify-center items-center">
                            <h1 className="text-7xl font-bold drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]">{randomValue}</h1>
                        </div>
                    </div>
                    <p className="text-lg text-center">
                        Your Account ID is
                        #{user.telegramId}
                        . You're in the top 90% 🔥
                    </p>
                    <div className="absolute bottom-[5rem] w-full">
                        <button
                            onClick={handleNext}
                            className="mt-6 px-6 py-3 w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                        >
                            Continue
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center h-screen py-[4rem] relative">
                    <h2 className="text-3xl mb-4 text-center">You are Amazing</h2>
                    <p className="text-lg mb-2 text-center">Here is your COCKS reward</p>
                    <div className="flex justify-center">
                        <div className="w-[12rem] h-[12rem] mb-6 bg-cover bg-[url('https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Animals%20and%20Nature/Chicken.webp')]" />
                    </div>
                    <h1 className="text-5xl font-bold text-center mb-4">{randomValue + 527}</h1>
                    <div className="absolute bottom-[5rem] w-full">
                        <p className="text-lg text-center">Thanks for your time on Telegram 🐔</p>
                        <button
                            onClick={
                                handleClaimPoints
                            }
                            className="mt-6 px-6 py-3 w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                        >
                            Claim Points
                        </button>
                    </div>
                </div>
            </Slider>
        </div>
    );
};

export default WelcomeSlider;
