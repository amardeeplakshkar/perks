import { FaTasks, FaWallet } from "react-icons/fa";
import { FaChartSimple, FaUserGroup } from "react-icons/fa6";
import { IoHomeSharp } from "react-icons/io5";
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
    href: "/tasks",
  },
  {
    label: "Leaderboard",
    icon: FaChartSimple,
    href: "/leaderboard",
  },
  {
    label: "Friends",
    icon: FaUserGroup,
    href: "/friends",
  },
  {
    label: "Wallet",
    icon: FaWallet,
    href: "/wallet",
  },
];

export const TASKS = [
  {
    id: 1,
    name: "Follow Cocks on Telegram",
    path: "https://t.me/cocks_community",
    points: 500,
    icon: <FaTelegramPlane />,
    completed: false,
  },
  {
    id: 2,
    name: "Follow Cocks on X",
    path: "https://x.com/cocks_community",
    points: 200,
    icon: <FaXTwitter />,
    completed: false,
  },
  {
    id: 3,
    name: "Follow Cocks on Instagram",
    path: "https://instagram.com/cocks_community",
    points: 100,
    icon: <AiFillInstagram />,
    completed: false,
  },
  {
    id: 4,
    name: "Follow Cocks on Youtube",
    path: "https://youtube.com/cocks_community",
    points: 250,
    icon: <FaYoutube />,
    completed: false,
  },
];
