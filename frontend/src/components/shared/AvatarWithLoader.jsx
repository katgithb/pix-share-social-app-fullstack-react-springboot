import { Avatar, SkeletonCircle } from "@chakra-ui/react";
import React, { useState } from "react";

const AvatarWithLoader = ({ loaderSize, ...props }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setIsImageError(true);
  };

  return (
    <SkeletonCircle isLoaded={isImageLoaded || isImageError} size={loaderSize}>
      <Avatar
        {...props}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
        // hidden={!(isImageLoaded || isImageError)}
        visibility={isImageLoaded || isImageError ? "visible" : "hidden"}
      />
    </SkeletonCircle>
  );
};

export default AvatarWithLoader;
