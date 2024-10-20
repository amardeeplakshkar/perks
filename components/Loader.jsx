import React, { useEffect, useRef } from 'react';
import styles from './Loader.module.css'; // Use CSS Modules for styling

const Loader = () => {
  const loaderRef = useRef(null); // Use ref to access the loader DOM element

  // Trigger the transition animation
  const triggerTransition = () => {
    if (loaderRef.current) {
      loaderRef.current.style.transform = 'translateX(0%)'; // Start position

      loaderRef.current.addEventListener('transitionend', () => {
        loaderRef.current.style.transform = 'translateX(100%)'; // End position
      }, { once: true }); // Ensure it only runs once per transition
    }
  };

  useEffect(() => {
    // Repeat the animation every 2 seconds
    const interval = setInterval(() => {
      triggerTransition();
    }, 2000); // Adjust as needed

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className={styles.container}>
      <div ref={loaderRef} className={styles.loader}></div>
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default Loader;
