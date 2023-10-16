import {
  Box,
  Card,
  Divider,
  Flex,
  Heading,
  ListItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import AccountDeletionForm from "./AccountDeletionForm/AccountDeletionForm";
import PasswordChangeForm from "./PasswordChangeForm";
import PersonalDetailsSettingsForm from "./PersonalDetailsSettingsForm";
import ProfileSettingsForm from "./ProfileSettingsForm/ProfileSettingsForm";

const UserProfileDetailsEdit = () => {
  const userProfile = useSelector((store) => store.user.userProfile);

  return (
    <Card
      mt={5}
      py={{ base: 2, md: 4 }}
      variant={useColorModeValue("outline", "elevated")}
      rounded="lg"
      boxShadow={"md"}
    >
      <Tabs
        isLazy
        // isFitted
        mx={4}
        orientation={useBreakpointValue({
          base: "horizontal",
          md: "vertical",
        })}
      >
        <TabList minW={"fit-content"}>
          <Tab justifyContent={"start"}>
            <Flex align="center">
              {/* <Icon as={FaTableCells} fontSize="xl" /> */}
              <Text as="span">Account</Text>
            </Flex>
          </Tab>
          <Tab justifyContent={"start"}>
            <Flex align="center">
              <Text as="span">Security</Text>
            </Flex>
          </Tab>
          <Tab justifyContent={"start"}>
            <Flex align="center">
              <Text as="span" color={useColorModeValue("red.600", "red.400")}>
                Delete account
              </Text>
            </Flex>
          </Tab>
        </TabList>
        <TabPanels>
          {/* initially mounted */}
          <TabPanel
            pt={{ base: 4, md: 0 }}
            pb={{ base: 2, md: 0 }}
            pl={{ base: 0, md: 4 }}
            pr={0}
          >
            <Flex
              minH={"100vh"}
              w="full"
              align={"start"}
              justify={"center"}
              bg={useColorModeValue("gray.50", "gray.600")}
              rounded="lg"
            >
              <Stack direction={"column"}>
                <Stack
                  pt={5}
                  pb={{ base: 0, md: 5 }}
                  px={{ base: 3, md: 5 }}
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: 6, md: 4 }}
                >
                  <Box flex={1} px={{ base: 2, md: 0 }}>
                    <Heading fontSize="lg" lineHeight="6">
                      Profile
                    </Heading>
                    <Text
                      mt={1}
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                    >
                      Here you can edit public information about yourself. This
                      information will be displayed publicly so be careful what
                      you share.
                    </Text>
                  </Box>

                  <Flex flex={2} justify="center">
                    <ProfileSettingsForm currUser={userProfile.currUser} />
                  </Flex>
                </Stack>

                <Box mx="5">
                  <Divider
                    borderColor="gray.300"
                    _dark={{ borderColor: "whiteAlpha.400" }}
                    visibility={{ base: "hidden", md: "visible" }}
                  />
                </Box>

                <Stack
                  pt={5}
                  pb={5}
                  px={{ base: 3, md: 5 }}
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: 6, md: 4 }}
                >
                  <Box flex={1} px={{ base: 2, md: 0 }}>
                    <Heading fontSize="lg" lineHeight="6">
                      Personal Information
                    </Heading>
                    <Text
                      mt={1}
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                    >
                      Provide your personal information here, even if the
                      account is used for a business, a pet or something else.
                      This won't be a part of your public profile.
                    </Text>
                  </Box>

                  <Flex flex={2} justify="center">
                    <PersonalDetailsSettingsForm
                      currUser={userProfile.currUser}
                    />
                  </Flex>
                </Stack>
              </Stack>
            </Flex>
          </TabPanel>
          {/* initially not mounted */}
          <TabPanel
            pt={{ base: 4, md: 0 }}
            pb={{ base: 2, md: 0 }}
            pl={{ base: 0, md: 4 }}
            pr={0}
          >
            <Flex
              minH={"100vh"}
              w="full"
              align={"start"}
              justify={"center"}
              bg={useColorModeValue("gray.50", "gray.600")}
              rounded="lg"
            >
              <Stack direction={"column"}>
                <Stack
                  pt={5}
                  pb={5}
                  px={{ base: 3, md: 5 }}
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: 6, md: 4 }}
                >
                  <VStack flex={1}>
                    <Box flex={1} px={{ base: 2, md: 0 }}>
                      <Heading fontSize="lg" lineHeight="6">
                        Password
                      </Heading>
                      <Text
                        mt={1}
                        fontSize="sm"
                        color="gray.600"
                        _dark={{ color: "gray.400" }}
                      >
                        Here you can change the password of your account.
                        Provide your current and new password here to modify the
                        password.
                      </Text>
                    </Box>

                    <Box
                      px={[2, 0]}
                      rounded="md"
                      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
                      boxShadow="md"
                    >
                      <Box m={3}>
                        <Heading fontSize="sm" lineHeight="6">
                          Rules for password
                        </Heading>
                        <Text
                          mt={1}
                          fontSize="sm"
                          color="gray.600"
                          _dark={{ color: "gray.400" }}
                        >
                          To create a new password, you have to meet all of the
                          following requirements:
                        </Text>
                        <UnorderedList
                          fontSize="sm"
                          color="gray.600"
                          _dark={{ color: "gray.400" }}
                        >
                          <ListItem>Minimum 8 characters</ListItem>
                          <ListItem>At least one alphabet</ListItem>
                          <ListItem>At least one digit</ListItem>
                          <ListItem>At least one special character</ListItem>
                          <ListItem>Can't be the same as previous</ListItem>
                        </UnorderedList>
                      </Box>
                    </Box>
                  </VStack>

                  <Flex flex={2} justify="center">
                    <PasswordChangeForm />
                  </Flex>
                </Stack>
              </Stack>
            </Flex>
          </TabPanel>
          {/* initially not mounted */}
          <TabPanel
            pt={{ base: 4, md: 0 }}
            pb={{ base: 2, md: 0 }}
            pl={{ base: 0, md: 4 }}
            pr={0}
          >
            <Flex
              minH={"100vh"}
              w="full"
              align={"start"}
              justify={"center"}
              bg={useColorModeValue("gray.50", "gray.600")}
              rounded="lg"
            >
              <Stack direction={"column"}>
                <Stack
                  pt={5}
                  pb={5}
                  px={{ base: 3, md: 5 }}
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: 6, md: 4 }}
                >
                  <Box flex={1} px={{ base: 2, md: 0 }}>
                    <Heading fontSize="lg" lineHeight="6">
                      Delete Account
                    </Heading>
                    <Text
                      mt={1}
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: "gray.400" }}
                    >
                      Permanently remove your account and all of its contents
                      from the Pixshare platform, effective immediately. This
                      action is not reversible, so please continue with caution.
                    </Text>
                  </Box>

                  <Flex flex={2} justify="center">
                    <AccountDeletionForm currUser={userProfile.currUser} />
                  </Flex>
                </Stack>
              </Stack>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default UserProfileDetailsEdit;
