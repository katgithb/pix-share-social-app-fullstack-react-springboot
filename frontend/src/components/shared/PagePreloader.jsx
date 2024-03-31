import { Flex, keyframes, useColorMode, useTheme } from "@chakra-ui/react";
import { motion } from "framer-motion";
import "ldrs/squircle";
import React from "react";

const PagePreloader = () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const loader1AnimationKeyframes = keyframes`
    0% { transform: scale(1) rotate(225deg);   }
    20% { transform: scale(1) rotate(225deg);  }
    40% { transform: scale(1.25) rotate(0deg);  }
    60% { transform: scale(1.25) rotate(0deg);  }
    80% { transform: scale(1) rotate(225deg);  }
    100% { transform: scale(1) rotate(225deg);  }
  `;

  const loader1Animation = `${loader1AnimationKeyframes} 5s ease-in-out infinite`;

  const loader2AnimationKeyframes = keyframes`
    0% { transform: scale(1) rotate(45deg); margin-right: 0rem; margin-left: 0rem; }
    20% { transform: scale(1) rotate(45deg);  margin-right: 0rem; margin-left: 0rem; }
    40% { transform: scale(1.25) rotate(0deg); margin-right: 2.5rem; margin-left: 2.5rem; }
    60% { transform: scale(1.25) rotate(0deg); margin-right: 2.5rem; margin-left: 2.5rem;  }
    80% { transform: scale(1) rotate(45deg); margin-right: 0rem; margin-left: 0rem;  }
    100% { transform: scale(1) rotate(45deg); margin-right: 0rem; margin-left: 0rem; }
  `;

  const loader2Animation = `${loader2AnimationKeyframes} 5s ease-in-out infinite`;

  const loader3AnimationKeyframes = keyframes`
    0% { transform: scale(1) rotate(225deg);  }
    20% { transform: scale(1) rotate(225deg);  }
    40% { transform: scale(1.25) rotate(0deg);  }
    60% { transform: scale(1.25) rotate(0deg);  }
    80% { transform: scale(1) rotate(225deg);  }
    100% { transform: scale(1) rotate(225deg);  }
  `;

  const loader3Animation = `${loader3AnimationKeyframes} 5s ease-in-out infinite`;

  return (
    <Flex align="center" justify="center" h="100vh">
      <Flex>
        <Flex
          as={motion.div}
          animation={loader1Animation}
          mr={-2.5}
          zIndex={3}
          transform="rotate(225deg)"
        >
          <l-squircle
            size="55"
            speed="2"
            color={
              colorMode === "dark"
                ? theme.colors.red[300]
                : theme.colors.red[500]
            }
          ></l-squircle>
        </Flex>

        <Flex
          as={motion.div}
          animation={loader2Animation}
          transform="rotate(45deg)"
          zIndex={2}
        >
          <l-squircle
            size="55"
            speed="2"
            color={
              colorMode === "dark"
                ? theme.colors.blue[300]
                : theme.colors.blue[500]
            }
          ></l-squircle>
        </Flex>

        <Flex
          as={motion.div}
          animation={loader3Animation}
          ml={-2.5}
          zIndex={1}
          transform="rotate(225deg)"
        >
          <l-squircle
            size="55"
            speed="2"
            color={
              colorMode === "dark"
                ? theme.colors.green[300]
                : theme.colors.green[500]
            }
          ></l-squircle>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PagePreloader;
