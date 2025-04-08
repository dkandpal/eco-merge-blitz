import React from 'react';
import styled from 'styled-components';
import Game from './components/Game';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #faf8ef;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  color: #776e65;
  font-size: 3em;
  margin: 0;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #776e65;
  font-size: 1.2em;
  text-align: center;
  max-width: 600px;
`;

function App() {
  return (
    <AppContainer>
      <Title>EcoMerge Blitz</Title>
      <Subtitle>
        Merge eco-friendly tiles to create sustainable solutions! 
        Score as many points as you can in 60 seconds.
      </Subtitle>
      <Game />
    </AppContainer>
  );
}

export default App;
