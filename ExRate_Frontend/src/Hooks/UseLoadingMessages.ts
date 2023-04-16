import { useState, useEffect } from "react";

export default function useLoadingMessages(messages: string[], interval: number = 34285): string {
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
}
