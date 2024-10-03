"use client"; 
import React from 'react';
import { TASKS } from '../../../constants'; 
import Logo from "../../../app/favicon.ico"; 
import TaskCard from '../../../components/TaskCard'; 
import Image from "next/image";

// Optional: Function to prevent context menu and drag actions
const preventInteraction = (e) => {
  e.preventDefault();
};

const TaskList = () => {
  return (
    <main className="flex flex-col justify-center items-center p-2">
      <h2 className="text-2xl font-bold py-2">Complete Tasks and <br /> get more $COCKS</h2>
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
      <h3 className="place-self-start font-bold text-xl">Total Friends</h3>
      {TASKS.map(task => (
        <TaskCard
          key={task.href}
          icon={task.icon}
          taskname={task.label}
          tasklink={task.href}
          amount={task.amount}
          scheme="white"
        />
      ))}
    </main>
  );
};

export default TaskList;
