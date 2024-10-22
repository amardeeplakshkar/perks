'use client'
import Card from "../../../components/Card";
import Logo from "../../../app/favicon.ico";
import Image from "next/image";
import Link from "next/link";
import ReferralSystem from '../../../components/ReferralSystem'
import { useEffect, useState } from 'react'

export default function Home() {
  const preventInteraction = (e) => {
    e.preventDefault();
  };
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
    <>
      <ReferralSystem initData={initData} userId={userId} startParam={startParam} />
    </>
  )
}
