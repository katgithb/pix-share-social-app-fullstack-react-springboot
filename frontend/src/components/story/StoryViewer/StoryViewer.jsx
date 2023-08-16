import {
  Avatar,
  Box,
  Fade,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Progress,
  ScaleFade,
  Slide,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { BsSkipForwardFill } from "react-icons/bs";
import {
  FaArrowsToEye,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEyeLowVision,
  FaEyeSlash,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa6";
import { HiMiniPause, HiMiniPlay } from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import { Link as RouteLink, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "./ProgressBar";

const StoryViewer = ({
  userId,
  userIds,
  stories,
  fullnames,
  isCollapsedStoriesList,
}) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [userIdIndex, setUserIdIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [resetProgress, setResetProgress] = useState(false);
  const [storiesLength, setStoriesLength] = useState(stories?.length);
  const [showStoryOverlay, setShowStoryOverlay] = useState(true);
  const [showLeftOverlay, setShowLeftOverlay] = useState(false);
  const [showRightOverlay, setShowRightOverlay] = useState(false);
  const imageRef = useRef(null);

  const durationInMs = 4800;
  const progressUpdateDelayInMs = 100;
  const storyAnimateDurationInMs = 400;
  const currentStory = stories[activeIndex];
  const id = userIds[userIdIndex];
  const gender = id % 2 === 0 ? "men" : "women";
  const image = `https://picsum.photos/1280/720?random=${Math.random() * 100}`;
  const user = {
    dp: `https://randomuser.me/api/portraits/${gender}/${Math.round(id)}.jpg`,
    username: generateRandomUsername(fullnames[userIdIndex]),
    caption: generateRandomCaption(),
  };

  function generateRandomName() {
    const names = [
      "John Doe",
      "Jane Smith",
      "Alex Johnson Hades Kate Wilber Robert",
      "Sarah Thompson",
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  }

  function generateRandomUsername(fullname) {
    const username = fullname.replace(/\s+/g, "_").toLowerCase();

    return username;
  }

  function generateRandomCaption() {
    const captions = [
      "Laborum nemo error odio. Ratione explicabo et odio.",
      "Vel aperiam doloribus mollitia et et. Fuga autem omnis voluptates nihil in fugit totam adipisci. Voluptatum voluptatem exercitationem rerum molestiae cum et hic. Molestias dolores ex et molestiae. Quaerat qui et voluptate adipisci autem.",
      "Est asperiores dignissimos fuga. Voluptas id at voluptatum. Ea facere magni necessitatibus et praesentium aut.",
      "Porro et nulla nulla quo rem rerum exercitationem. Facilis quia dolorem beatae sed eos exercitationem voluptas reprehenderit et. Cum voluptate repudiandae laborum ut tempore. Laborum maxime nihil ab veniam in. In distinctio laboriosam.",
      "Et est in est rerum est. Vel labore veniam repellat fugit eum distinctio quia eaque consequatur. Est eos deserunt in.",
      "Delectus sit cupiditate est. Quod maxime consequatur consequatur.",
      "Ipsa ratione harum consectetur quas repudiandae quibusdam sint amet ducimus.",
      "Enim rem odio eos est repudiandae eveniet distinctio voluptatum reprehenderit.",
    ];
    const randomIndex = Math.floor(Math.random() * captions.length);
    return captions[randomIndex];
  }

  console.log(stories?.length);

  useEffect(() => {
    const img = imageRef.current;
    img.style.opacity = 0;
    const direction = Math.floor(Math.random() * 2) === 0 ? -1 : 1;
    img.style.transform = `translateY(${direction * 100}%)`;

    setTimeout(() => {
      img.style.opacity = 1;
      img.style.transform = "translateY(0)";
    }, storyAnimateDurationInMs);
  }, [currentStory]);

  const handleStoryLoad = () => {
    const img = imageRef.current;
    img.style.opacity = 1;
    img.style.transform = "translateY(0)";
  };

  const toggleStoryOverlay = () => {
    setShowStoryOverlay(!showStoryOverlay);
  };

  const handleSwipe = (event) => {
    const swipeThreshold = 50;
    const touchStartX = event.touches[0]?.clientX;
    let touchEndX;

    const handleTouchMove = (event) => {
      touchEndX = event.touches[0]?.clientX;
    };

    const handleTouchEnd = () => {
      const deltaX = touchEndX - touchStartX;
      if (
        touchEndX &&
        deltaX > swipeThreshold &&
        activeIndex < stories?.length - 1
      ) {
        setActiveIndex(activeIndex + 1);
        // alert("Swiped right");
      } else if (touchEndX && deltaX < -swipeThreshold && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
        // alert("Swiped left");
      }

      touchEndX = null;
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    if (event.touches.length > 0) {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }
  };

  const handleDoubleClick = (event) => {
    const { clientX, target } = event;
    const { x, width } = target.getBoundingClientRect();
    const tapPosition = clientX - x;
    const isLeftTap = tapPosition < width / 2;
    const isRightTap = tapPosition > width / 2;

    if (isLeftTap) {
      handlePrev();
      setShowLeftOverlay(true);
      setTimeout(() => setShowLeftOverlay(false), 500);
    } else if (isRightTap) {
      handleNext();
      setShowRightOverlay(true);
      setTimeout(() => setShowRightOverlay(false), 500);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setResetProgress(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    setResetProgress(true);
  };

  const handlePrev = () => {
    const prevUserIdIndex =
      userIdIndex === 0 ? userIds?.length - 1 : userIdIndex - 1;
    setUserIdIndex(prevUserIdIndex);
    const prevUserId = userIds[prevUserIdIndex];
    navigate(`/story/${prevUserId}`);
  };

  const handleNext = () => {
    const nextUserIdIndex =
      userIdIndex === userIds?.length - 1 ? 0 : userIdIndex + 1;
    setUserIdIndex(nextUserIdIndex);
    const nextUserId = userIds[nextUserIdIndex];
    navigate(`/story/${nextUserId}`);
  };

  const handleSkipForward = () => {
    const isLastImage = activeIndex === stories?.length - 1;

    if (isLastImage || stories?.length === 0) {
      const nextUserIdIndex = (userIdIndex + 1) % userIds.length;
      setUserIdIndex(nextUserIdIndex);
      const nextUserId = userIds[nextUserIdIndex];
      navigate(`/story/${nextUserId}`);
    } else {
      setActiveIndex((prevIndex) => (prevIndex + 1) % stories?.length);
    }
  };

  useEffect(() => {
    setActiveIndex(0);
    setResetProgress(true);
    if (userId.toString() !== userIds[userIdIndex].toString()) {
      const currentUserIdIndex = userIds?.indexOf(parseInt(userId));
      if (currentUserIdIndex !== -1) {
        setUserIdIndex(currentUserIdIndex);
      }
    }
  }, [userId, userIdIndex, userIds]);

  useEffect(() => {
    if (stories?.length !== storiesLength) {
      setActiveIndex(0);
      setStoriesLength(stories?.length);
    }
  }, [stories?.length, storiesLength]);

  useEffect(() => {
    let interval;

    if (!isPaused) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % stories?.length);

        const isLastImage = activeIndex === stories?.length - 1;

        if (isLastImage || stories?.length === 0) {
          const nextUserIdIndex = (userIdIndex + 1) % userIds.length;
          setUserIdIndex(nextUserIdIndex);
          const nextUserId = userIds[nextUserIdIndex];
          navigate(`/story/${nextUserId}`);
        }
      }, durationInMs);
    }

    return () => {
      clearInterval(interval);
    };
  }, [
    stories?.length,
    durationInMs,
    activeIndex,
    isPaused,
    userIds?.length,
    userIdIndex,
    userIds,
    navigate,
    userId,
  ]);

  useEffect(() => {
    if (resetProgress) {
      setResetProgress(false);
    }
  }, [resetProgress]);

  console.log(activeIndex);
  console.log(userIds[userIdIndex]);

  return (
    <VStack
      role={"group"}
      rounded="lg"
      mx={"2"}
      boxShadow="md"
      overflow={"auto"}
    >
      <Box
        position={"relative"}
        minW={"xs"}
        w="full"
        maxW={{ base: "md", md: "md" }}
        rounded="lg"
        justifyContent={"center"}
        overflow="hidden"
        _groupHover={{ boxShadow: "lg" }}
        onTouchStart={handleSwipe}
        onTouchEnd={handleSwipe}
      >
        <Flex
          minH="250px"
          align="center"
          justify="center"
          w="full"
          onDoubleClick={handleDoubleClick}
        >
          <Flex
            align="center"
            h={{
              base: isCollapsedStoriesList ? "85vh" : "79.5vh",
              md: "95vh",
            }}
          >
            <Image
              src={currentStory}
              alt="Story Image"
              objectFit="contain"
              rounded="lg"
              ref={imageRef}
              transition={`opacity ${storyAnimateDurationInMs}ms ease-in-out, transform ${storyAnimateDurationInMs}ms ease-in-out`}
              onLoad={handleStoryLoad}
            />
          </Flex>
        </Flex>

        <Box
          position="absolute"
          transition="opacity 0.3s ease-in-out"
          opacity={showStoryOverlay ? 1 : 0}
          left={2}
          top="50%"
        >
          <IconButton
            icon={<FaChevronLeft />}
            onClick={handlePrev}
            variant="ghost"
            color="gray.50"
            rounded="full"
            fontSize="2xl"
            boxShadow="sm"
            transform="translateY(-50%)"
            zIndex="1"
            _hover={{
              bg: { base: {}, md: "blue.400" },
              color: "gray.100",
            }}
          />
        </Box>

        <Box
          position="absolute"
          transition="opacity 0.3s ease-in-out"
          opacity={showStoryOverlay ? 1 : 0}
          right={2}
          top="50%"
        >
          <IconButton
            icon={<FaChevronRight />}
            onClick={handleNext}
            variant="ghost"
            color="gray.50"
            rounded="full"
            fontSize="2xl"
            boxShadow="sm"
            transform="translateY(-50%)"
            zIndex="1"
            _hover={{
              bg: { base: {}, md: "blue.400" },
              color: "gray.100",
            }}
          />
        </Box>

        {showLeftOverlay && (
          <Box
            position="absolute"
            transition="opacity 0.3s ease-in-out"
            opacity={showLeftOverlay ? 1 : 0}
            top={0}
            left={0}
            width="50%"
            height="100%"
            bgGradient="linear(to-r, blackAlpha.600, transparent)"
          />
        )}
        {showRightOverlay && (
          <Box
            position="absolute"
            transition="opacity 0.3s ease-in-out"
            opacity={showRightOverlay ? 1 : 0}
            top={0}
            right={0}
            width="50%"
            height="100%"
            bgGradient="linear(to-l, blackAlpha.600, transparent)"
          />
        )}

        <Flex
          position="absolute"
          bgGradient="linear(to-b, blackAlpha.600, transparent)"
          top={0}
          flexDirection="column"
          justify="center"
          w="full"
          p={3}
        >
          <Flex w="full" gap={4} justify={"center"}>
            {stories?.map((story, index) => (
              <ProgressBar
                key={index}
                index={index}
                activeIndex={activeIndex}
                duration={durationInMs}
                progressUpdateDelayInMs={progressUpdateDelayInMs}
                resetProgress={resetProgress}
                isPaused={isPaused}
                transition="all 0.3s ease"
                boxShadow={"md"}
              />
            ))}
          </Flex>
          <HStack pl={2} py="4" align="center" justify="space-between">
            <HStack
              transition="opacity 0.3s ease-in-out"
              opacity={showStoryOverlay ? 1 : 0}
              spacing="2"
              align="center"
            >
              <Link
                as={RouteLink}
                to={`/username`}
                bgGradient="linear(to-tr, whiteAlpha.600, whiteAlpha.800)"
                p="1"
                rounded="full"
                boxShadow={"md"}
              >
                <Avatar boxSize={9} src={user.dp} alt="User Avatar" />
              </Link>
              <Box
                transition="opacity 0.3s ease-in-out"
                opacity={showStoryOverlay ? 1 : 0}
                justifyContent={"start"}
                wordBreak="break-word"
              >
                <Link
                  as={RouteLink}
                  to={`/username`}
                  style={{ textDecoration: "none" }}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={useColorModeValue("gray.100", "gray.200")}
                    noOfLines={1}
                  >
                    {user.username}
                  </Text>
                </Link>
                <Text
                  display={stories?.length > 0 ? "inherit" : "none"}
                  fontSize="xs"
                  color={useColorModeValue("gray.200", "gray.300")}
                  textTransform="lowercase"
                  letterSpacing="wide"
                >
                  7 hours ago
                </Text>
              </Box>
            </HStack>

            <HStack spacing={0}>
              <IconButton
                display={stories?.length > 0 ? "inherit" : "none"}
                transition="opacity 0.3s ease-in-out"
                opacity={showStoryOverlay ? 1 : 0}
                icon={isPaused ? <HiMiniPlay /> : <HiMiniPause />}
                rounded="full"
                color={useColorModeValue("gray.100", "gray.200")}
                fontSize={{ base: "md", md: "lg" }}
                variant="ghost"
                aria-label={isPaused ? "Play" : "Pause"}
                onClick={isPaused ? handleResume : handlePause}
                _hover={{
                  bg: {
                    base: {},
                    md: useColorModeValue("gray.500", "gray.600"),
                  },
                }}
              />
              <IconButton
                display={stories?.length > 0 ? "inherit" : "none"}
                icon={showStoryOverlay ? <FaEyeSlash /> : <FaEye />}
                rounded="full"
                color={useColorModeValue("gray.100", "gray.200")}
                fontSize={{ base: "md", md: "lg" }}
                variant="ghost"
                aria-label={showStoryOverlay ? "Hide" : "Show"}
                onClick={toggleStoryOverlay}
                _hover={{
                  bg: {
                    base: {},
                    md: useColorModeValue("gray.500", "gray.600"),
                  },
                }}
              />
              <Link as={RouteLink} to={"/"} style={{ textDecoration: "none" }}>
                <IconButton
                  icon={<MdClose />}
                  rounded="full"
                  color={useColorModeValue("gray.100", "gray.200")}
                  fontSize={{ base: "md", md: "lg" }}
                  variant="ghost"
                  aria-label="Close"
                  _hover={{
                    bg: {
                      base: {},
                      md: useColorModeValue("gray.500", "gray.600"),
                    },
                  }}
                />
              </Link>
            </HStack>
          </HStack>

          <HStack mt={-5} mb={-2.5} pl={2.5} spacing={0} align="center">
            <IconButton
              display={stories?.length > 0 ? "inherit" : "none"}
              transition="opacity 0.3s ease-in-out"
              opacity={showStoryOverlay ? 1 : 0}
              icon={<BsSkipForwardFill />}
              rounded="full"
              color={useColorModeValue("gray.100", "gray.200")}
              fontSize={{ base: "md", md: "lg" }}
              variant="ghost"
              aria-label="Skip Forward"
              onClick={handleSkipForward}
              _hover={{
                bg: { base: {}, md: useColorModeValue("gray.500", "gray.600") },
              }}
            />
          </HStack>
        </Flex>

        {stories?.length > 0 && (
          <Flex
            position="absolute"
            bgGradient="linear(to-t, blackAlpha.700, transparent)"
            bottom={0}
            flexDirection="column"
            justify="center"
            w="full"
            p={3}
          >
            <HStack px="2" py="4" align="center" justify="space-between">
              <Box
                transition="opacity 0.3s ease-in-out"
                opacity={showStoryOverlay ? 1 : 0}
                justifyContent={"start"}
                wordBreak="break-word"
                textAlign="center"
              >
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color={"gray.100"}
                  _dark={{ color: "gray.200" }}
                  letterSpacing="wide"
                >
                  {user.caption}
                </Text>
              </Box>
            </HStack>
          </Flex>
        )}
      </Box>
    </VStack>
  );
};

export default StoryViewer;
