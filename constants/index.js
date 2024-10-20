import { FaTasks } from "react-icons/fa";
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
    label:"Welcome",
    icon: FaUserGroup,
    href: "/welcome"
  }
];

export const TASKS = [
  {
    id: "607f1f77bcf86cd799439011", // Replace with valid 24-character hex string
    name: "Follow Cocks on Telegram",
    path: "https://t.me/cocks_community",
    points: 500,
    icon: <FaTelegramPlane />,
    completed: false,
  },
  {
    id: "607f1f77bcf86cd799439012",
    name: "Follow Cocks on X",
    path: "https://x.com/cocks_community",
    points: 200,
    icon: <FaXTwitter />,
    completed: false,
  },
  {
    id: "607f1f77bcf86cd799439013",
    name: "Follow Cocks on Instagram",
    path: "https://instagram.com/cocks_community",
    points: 100,
    icon: <AiFillInstagram />,
    completed: false,
  },
  {
    id: "607f1f77bcf86cd799439014",
    name: "Follow Cocks on Youtube",
    path: "https://youtube.com/cocks_community",
    points: 250,
    icon: <FaYoutube />,
    completed: false,
  },
];
