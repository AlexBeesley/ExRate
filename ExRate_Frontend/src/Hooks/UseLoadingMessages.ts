import { useState, useEffect } from "react";

export default function UseLoadingMessages(messages: string[], interval: number = 5000): string {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === messages.length - 1 ? prevIndex : prevIndex + 1));
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [interval, messages.length]);

  return messages[currentIndex];
}
