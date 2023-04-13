import { useState, useEffect } from "react";

export const useLoadingMessages = (
  messages: string[],
  interval: number = 34285
) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [interval, messages.length]);

  return messages[currentIndex];
};
