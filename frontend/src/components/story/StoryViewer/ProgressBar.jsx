import { Progress, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

const ProgressBar = ({
  index,
  activeIndex,
  duration,
  progressUpdateDelayInMs,
  resetProgress,
  isPaused,
}) => {
  const [progress, setProgress] = useState(0);
  const isActive = index === activeIndex;

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        if (!isPaused) {
          setProgress((prevProgress) => {
            if (prevProgress < 100) {
              const nextProgress =
                prevProgress + 100 / (duration / progressUpdateDelayInMs);
              return nextProgress <= 100 ? nextProgress : 0;
            }
            clearInterval(interval);
            return prevProgress;
          });
        }
      }, progressUpdateDelayInMs);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, duration, progressUpdateDelayInMs, isPaused, progress]);

  useEffect(() => {
    setProgress(0);
  }, [activeIndex]);

  useEffect(() => {
    if (resetProgress) {
      setProgress(0);
    }
  }, [resetProgress]);

  useEffect(() => {
    if (isActive && progress === 100) {
      setProgress(0);
    }
  }, [isActive, progress]);

  // console.log("Progress: " + progress + " at index : " + activeIndex);

  return (
    <Progress
      value={isActive ? progress : 0}
      max={100}
      size="xs"
      rounded="full"
      colorScheme={useColorModeValue("linkedin", "gray")}
      color="gray.100"
      bg={useColorModeValue("whiteAlpha.700", "whiteAlpha.600")}
      transition="width 0.3s ease-in-out"
      flex="1"
    />
  );
};

export default ProgressBar;
