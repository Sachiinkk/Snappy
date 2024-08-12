import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    // Define the async function inside useEffect
    const fetchUserData = async () => {
      try {
        // Retrieve data from localStorage
        const item = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);

        if (!item) {
          navigate('/login'); // Redirect to login if no item found
        } else {
          // Parse the data and update state
          const userData = JSON.parse(item);
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle any errors that may occur
      }
    };

    fetchUserData(); // Call the async function
  }, [navigate]);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchContacts = async () => {
      try {
        if (currentUser) {
          if (currentUser.isAvatarImageSet) {
            const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(response.data); // Update state with the contacts
          } else {
            navigate('/setAvatar'); // Redirect if avatar is not set
          }
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        // Handle errors as needed
      }
    };

    fetchContacts(); // Call the async function
  }, [currentUser, navigate]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
