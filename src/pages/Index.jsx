import React, { useState, useEffect } from "react";
import { ChakraProvider, Box, VStack, Heading, FormControl, FormLabel, Input, Button, Text, InputGroup, InputRightElement, useToast, Divider, HStack, IconButton, Stack, Textarea } from "@chakra-ui/react";
import { FaSearch, FaUserPlus, FaPaperPlane } from "react-icons/fa";

const API_BASE_URL = "https://backengine-oic0.fly.dev";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");
  const toast = useToast();

  // Login function
  const login = async () => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      setIsLoggedIn(true);
      setUserId(email); // For simplicity, we'll use email as user ID
      toast({
        title: "Login successful.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Login failed.",
        description: "Please check your credentials.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Search for users
  const searchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/search?query=${searchQuery}`);
    const data = await response.json();
    setSearchResults(data);
  };

  // Connect with a user
  const connectWithUser = async (targetUserId) => {
    const response = await fetch(`${API_BASE_URL}/connect/${targetUserId}`, {
      method: "POST",
    });
    if (response.ok) {
      toast({
        title: "Connection established.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Post a status
  const addPost = async () => {
    // Here you'd send a request to your backend to add the post,
    // but since there's no such endpoint in the API, we'll just add it locally.
    setPosts([...posts, { userId, content: post }]);
    setPost("");
  };

  // Fetch connected user's posts
  const fetchConnectedPosts = async () => {
    const response = await fetch(`${API_BASE_URL}/connected-posts`);
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchConnectedPosts();
    }
  }, [isLoggedIn]);

  return (
    <ChakraProvider>
      <Box p={8}>
        <VStack spacing={8}>
          <Heading>Social Media App</Heading>
          {!isLoggedIn ? (
            <>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                  <Input pr="4.5rem" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </InputGroup>
              </FormControl>
              <Button colorScheme="blue" onClick={login}>
                Login
              </Button>
            </>
          ) : (
            <VStack spacing={4} align="stretch">
              <FormControl id="search">
                <InputGroup>
                  <Input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <InputRightElement children={<FaSearch />} onClick={searchUsers} />
                </InputGroup>
              </FormControl>
              {searchResults.map((user) => (
                <HStack key={user.id}>
                  <Text>{user.name}</Text>
                  <IconButton icon={<FaUserPlus />} onClick={() => connectWithUser(user.id)} />
                </HStack>
              ))}
              <Divider />
              <FormControl id="post">
                <FormLabel>Add a post</FormLabel>
                <Textarea placeholder="What's on your mind?" value={post} onChange={(e) => setPost(e.target.value)} />
                <Button leftIcon={<FaPaperPlane />} colorScheme="blue" onClick={addPost} mt={2}>
                  Post
                </Button>
              </FormControl>
              <Stack spacing={4}>
                {posts.map((post, index) => (
                  <Box key={index} p={4} shadow="md" borderWidth="1px">
                    <Text>{post.content}</Text>
                  </Box>
                ))}
              </Stack>
            </VStack>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default Index;
