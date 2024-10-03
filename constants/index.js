import { FaTasks } from 'react-icons/fa';
import { FaChartSimple, FaUserGroup } from 'react-icons/fa6'
import { IoHomeSharp } from 'react-icons/io5';
import { FaYoutube } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const ROUTES = [
    {
      label: "Home",
      icon: IoHomeSharp,
      href: "/",
    },
    {
      label: "Tasks",
      icon: FaTasks,
      href:'/tasks'
    },
    {
        label: "Leaderboard",
        icon: FaChartSimple,
        href:'/leaderboard'
      },
      {
        label: "Friends",
        icon: FaUserGroup,
        href:'/friends'
      },
  ] ;

  export const TASKS = [
    {
      label: "Follow Cocks on Telegram",
      href:'https://t.me/cocks_community',
      amount: 200,
      icon:FaTelegramPlane,
    },
    {
      label: "Follow Cocks on X",
      href: "https://x.com/cocks_community",
      amount: 200,
      icon:FaXTwitter,
    },
    {
      label: "Follow Cocks on Instagram",
      href:'https://instagram.com/cocks_community',
      amount: 200,
      icon:AiFillInstagram,
    },
    {
      label: "Follow Cocks on Youtube",
      href:'https://youtube.com/cocks_community',
      amount: 200,
      icon:FaYoutube,
    },
  ];