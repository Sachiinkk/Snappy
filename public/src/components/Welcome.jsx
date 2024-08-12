import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    // Define the async function inside useEffect
    const fetchUserName = async () => {
      try {
        // Retrieve and parse data from localStorage
        const storedData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
        if (storedData) {
          const data = JSON.parse(storedData);
          setUserName(data.username); // Update state with the username
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        // Handle errors as needed
      }
    };

    fetchUserName(); // Call the async function
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
