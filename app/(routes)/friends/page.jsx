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
      <main className="relative flex flex-col justify-center items-center p-2">
        <h2 className="text-2xl font-bold py-2">
          Invite Friends and <br /> get more $COCKS
        </h2>
        <Image
          src={Logo}
          alt="Cocks Logo"
          height={250}
          width={250}
          className="no-interaction"
          onContextMenu={preventInteraction}
          onTouchStart={preventInteraction}
          draggable={false}
        />
        <Link
          href="https://t.me/CocksCryptoBot?startapp="
          className="font-bold text-center w-full p-2 bg-white text-black rounded-md mb-4"
        >
          Invite Friends
        </Link>
        <h3 className="place-self-start font-bold text-xl">Total Friends</h3>
        <Card rank="+685" username="Amardeep" />
        <Card rank="+243" username="Priya" />
        <Card rank="+351" username="Shravan" />
      </main>
    </>
  );
};

export default Friends;
