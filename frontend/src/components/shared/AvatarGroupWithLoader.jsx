import { Avatar, AvatarGroup, Skeleton } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AvatarGroupWithLoader = ({
  loaderHeight,
  avatars = [],
  children,
  ...props
}) => {
  const [isAvatarGroupLoaded, setIsAvatarGroupLoaded] = useState(false);
  const [loadedAvatars, setLoadedAvatars] = useState(new Set());
  const [failedAvatars, setFailedAvatars] = useState(new Set());
  const navigate = useNavigate();

  const handleImageLoad = useCallback(
    (id) => {
      if (!loadedAvatars.has(id)) {
        setLoadedAvatars((prev) => new Set(prev).add(id));
      }
    },
    [loadedAvatars]
  );

  const handleImageError = useCallback(
    (id) => {
      if (!failedAvatars.has(id)) {
        setFailedAvatars((prev) => new Set(prev).add(id));
      }
    },
    [failedAvatars]
  );

  const handleImageClick = (username) => {
    navigate(`/profile/${username}`);
  };

  useEffect(() => {
    if (loadedAvatars.size + failedAvatars.size === avatars.length) {
      setIsAvatarGroupLoaded(true);
    }
  }, [loadedAvatars, failedAvatars, avatars]);

  return (
    <Skeleton
      isLoaded={isAvatarGroupLoaded}
      rounded="lg"
      h={isAvatarGroupLoaded ? "initial" : loaderHeight}
    >
      <AvatarGroup
        {...props}
        max={avatars.length + 1}
        visibility={isAvatarGroupLoaded ? "visible" : "hidden"}
      >
        {avatars.map((avatar) => (
          <Avatar
            key={avatar.id}
            name={avatar.name}
            src={avatar.image ? avatar.image : {}}
            cursor="pointer"
            loading="lazy"
            onLoad={() => handleImageLoad(avatar.id)}
            onError={() => handleImageError(avatar.id)}
            onClick={() => handleImageClick(avatar.username)}
          />
        ))}

        {children}
      </AvatarGroup>
    </Skeleton>
  );
};

export default AvatarGroupWithLoader;
