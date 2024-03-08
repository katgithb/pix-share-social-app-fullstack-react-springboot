import { Flex, Image, Skeleton } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";

const ImageWithLoader = ({ skeletonProps = {}, ...imageProps }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const imageSkeletonProps = useMemo(() => {
    return {
      isLoaded: isImageLoaded || isImageError,
      flex: "1",
      maxH: "inherit",
      rounded: "lg",
      ...skeletonProps,
    };
  }, [isImageError, isImageLoaded, skeletonProps]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setIsImageError(true);
  };

  return (
    <Skeleton {...imageSkeletonProps}>
      <Flex
        flex={1}
        align="center"
        justify="center"
        h="full"
        textAlign="center"
        maxH="full"
      >
        <Image
          {...imageProps}
          //   fallbackSrc="path/to/placeholder.jpg"
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          visibility={isImageLoaded || isImageError ? "visible" : "hidden"}
          opacity={isImageLoaded || isImageError ? 1 : 0}
          transition="opacity 0.3s ease-in-out"
        />
      </Flex>
    </Skeleton>
  );
};

export default ImageWithLoader;
