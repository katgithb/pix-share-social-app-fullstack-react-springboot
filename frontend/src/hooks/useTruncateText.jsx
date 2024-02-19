import { Text } from "@chakra-ui/react";
import React, { useState } from "react";

const useTruncateText = (text, maxChars = 100) => {
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);

  if (text.length <= maxChars) {
    return (
      <Text whiteSpace="pre-line" wordBreak={"break-word"}>
        {text}
      </Text>
    );
  }

  const truncatedText = isTextOverflowing
    ? text
    : `${text.substring(0, maxChars)}...`;

  const readMoreLink = (
    <Text
      as="span"
      alignSelf="start"
      color={"gray.500"}
      _dark={{ color: "gray.400" }}
      fontWeight="semibold"
      cursor="pointer"
      _hover={{
        textDecorationLine: "underline",
      }}
      onClick={() => setIsTextOverflowing(!isTextOverflowing)}
    >
      {isTextOverflowing ? "less" : "more"}
    </Text>
  );

  return (
    <>
      <Text
        noOfLines={!isTextOverflowing ? 2 : {}}
        whiteSpace="pre-line"
        wordBreak={"break-word"}
      >
        {truncatedText}
      </Text>

      {readMoreLink}
    </>
  );
};

export default useTruncateText;
