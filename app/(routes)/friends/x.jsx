"use client";
import Card from "../../../components/Card";
import Logo from "../../../app/favicon.ico";
import Image from "next/image";
import Link from "next/link";

const Friends = () => {
  const preventInteraction = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <main className="relative flex flex-col items-center justify-center h-screen p-2">
        <h2 className="py-2 text-2xl font-bold text-center">
          Invite Friends and <br /> get more $COCKS
        </h2>
        <Image
          src={Logo}
          alt="Cocks Logo"
          height={200}
          width={200}
          className="no-interaction"
          onContextMenu={preventInteraction}
          onTouchStart={preventInteraction}
          draggable={false}
        />
        <Link
          href="https://t.me/CocksCryptoBot?startapp="
          className="w-full p-2 mb-2 font-bold text-center text-black bg-white rounded-md"
        >

        </Link>
        <h3 className="text-xl font-bold place-self-start">Total Friends</h3>
        <div className="flex-grow overflow-y-auto max-h-[calc(100vh-80vh)] w-full overflow-x-hidden">
          <Card rank="+685" username="Amardeep" />
          <Card rank="+243" username="Priya" />
          <Card rank="+351" username="Shravan" />
          <Card rank="+685" username="Amardeep" />
          <Card rank="+243" username="Priya" />
          <Card rank="+351" username="Shravan" />
          <Card rank="+351" username="Shravan" />
        </div>
      </main>
    </>
  );
};

export default Friends;
