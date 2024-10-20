"use client"
import React, { useEffect, useRef } from 'react';
import styles from '../../../components/Loader.module.css'; // Use CSS Modules for styling
import {BlinkBlur} from 'react-loading-indicators'

const Loader = () => {
  const loaderRef = useRef(null); // Use ref to access the loader DOM element

  // Trigger the transition animation
  const triggerTransition = () => {
    if (loaderRef.current) {
      loaderRef.current.style.transform = 'translateX(0%) rotate(0deg)'; // Start position

      loaderRef.current.addEventListener('transitionend', () => {
        loaderRef.current.style.transform = 'translateX(100%) rotate(0deg)'; // End position
      }, { once: true }); // Ensure it only runs once per transition
    }
  };

  useEffect(() => {
    // Repeat the animation every 2 seconds
    const interval = setInterval(() => {
      triggerTransition();
    }, 3000); // Adjust as needed

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className={styles.container}>
      <div ref={loaderRef} className={styles.loader}></div>
      <div className={styles.loadingText}>
        <img src='https://res.cloudinary.com/duscymcfc/image/upload/v1729088502/Cocks/logo.png' className="h-[10rem]  w-[10rem] animate-bounce" />

        <BlinkBlur color="#fff" size="small" text="" textColor="" />
      </div>
    </div>
  );
};

export default Loader;
