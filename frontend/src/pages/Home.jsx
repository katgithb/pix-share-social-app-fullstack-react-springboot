import { Box, Flex, Grid, GridItem, Link, Text } from "@chakra-ui/react";
import React from "react";
import BasicProfileCard from "../components/profile/BasicProfileCard";
import Footer from "../components/shared/Footer";
import PostFeed from "../components/post/PostFeed/PostFeed";
import StoriesBar from "../components/story/StoriesBar/StoriesBar";
import SuggestionsList from "../components/suggestions/SuggestionsList/SuggestionsList";

const Home = () => {
  const userIdList = [
    20, 72, 58, 29, 89, 17, 94, 69, 11, 23, 10, 90, 18, 81, 79,
  ];

  const postIdList = Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 100)
  );

  const userId = userIdList[Math.floor(Math.random() * userIdList.length)];
  const gender = userId % 2 === 0 ? "men" : "women";
  const fullname = generateRandomName();

  const currUser = {
    dp: `https://randomuser.me/api/portraits/${gender}/${Math.round(
      userId
    )}.jpg`,
    fullname: fullname,
    username: generateUsernameFromName(fullname),
  };

  const posts = postIdList.map((postId) => {
    const userId = userIdList[Math.floor(Math.random() * userIdList.length)];
    const gender = userId % 2 === 0 ? "men" : "women";
    const userDp = `https://randomuser.me/api/portraits/${gender}/${Math.round(
      userId
    )}.jpg`;
    const fullname = generateRandomName();
    const username = generateUsernameFromName(fullname);

    const post = {
      id: postId,
      user: {
        dp: userDp,
        fullname: fullname,
        username: username,
      },
      image: `https://picsum.photos/id/${postId}/1280/720`,
      caption: generateRandomCaption(),
      comments: generateRandomComments(),
    };

    return post;
  });

  const fullnameList = [
    "Jane Smith",
    "Alex Johnson Hades Kate Wilber Robert",
    "Sarah Thompson",
    "John Doe",
    "Jane Smith",
    "Alex Johnson Hades Kate Wilber Robert",
    "Sarah Thompson",
    "John Doe",
    "Jane Smith",
    "Alex Johnson Hades Kate Wilber Robert",
    "Sarah Thompson",
    "John Doe",
    "Jane Smith",
    "Alex Johnson Hades Kate Wilber Robert",
    "Sarah Thompson",
  ];

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

  function generateUsernameFromName(fullname) {
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

  function generateRandomComments() {
    const randomComments = [];
    const comments = [
      "Laborum nemo error odio. Ratione explicabo et odio.",
      "Vel aperiam doloribus mollitia et et. Fuga autem omnis voluptates nihil in fugit totam adipisci. Voluptatum voluptatem exercitationem rerum molestiae cum et hic. Molestias dolores ex et molestiae. Quaerat qui et voluptate adipisci autem.",
      "Est asperiores dignissimos fuga. Voluptas id at voluptatum. Ea facere magni necessitatibus et praesentium aut.",
      "Porro et nulla nulla quo rem rerum exercitationem. Facilis quia dolorem beatae sed eos exercitationem voluptas reprehenderit et. Cum voluptate repudiandae laborum ut tempore. Laborum maxime nihil ab veniam in. In distinctio laboriosam.",
      "Et est in est rerum est. Vel labore veniam repellat fugit eum distinctio quia eaque consequatur. Est eos deserunt in.",
      "Delectus sit cupiditate est. Quod maxime consequatur consequatur.",
      "Ipsa ratione harum consectetur quas repudiandae quibusdam sint amet ducimus.",
      "Enim rem odio eos est repudiandae eveniet distinctio voluptatum reprehenderit.",
    ];

    const randomIndex = Math.floor(Math.random() * comments.length);
    for (let i = 0; i < randomIndex; i++) {
      const comment = comments[i];
      randomComments.push(comment);
    }

    return randomComments;
  }

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      <GridItem
        px={{ base: "4", md: "12", lg: "0" }}
        colSpan={{ base: "3", lg: "2" }}
      >
        <StoriesBar currUser={currUser} />

        <PostFeed currUser={currUser} posts={posts} />
      </GridItem>

      <GridItem
        colSpan={{ base: "1", lg: "auto" }}
        display={{ base: "none", lg: "block" }}
      >
        <Flex
          flexDirection="column"
          position="sticky"
          top="20"
          left="0"
          px="3"
          pb={3}
          flex={1}
          overflow="hidden"
        >
          <BasicProfileCard user={currUser} />
          <SuggestionsList userIds={userIdList} fullnames={fullnameList} />
          <Footer />
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Home;
