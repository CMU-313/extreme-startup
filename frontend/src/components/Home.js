import React from 'react';
import { useState } from 'react';
import { Button, Modal, Stack, Title } from '@mantine/core';

import AddPlayer from './AddPlayer';
import GoToGame from './GoToGame';

import { requestGameCreation } from '../utils/requests'
import { showSuccessfulNotification } from '../utils/utils'


function Home() {
  const [openedCreateGame, setOpenedCreateGame] = useState(false);
  const [openedAddPlayer, setOpenedAddPlayer] = useState(false);
  const [newGameId, setNewGameId] = useState("")

  const createGameButtonAction = () => {
    return requestGameCreation()
      .then(game => {
        showSuccessfulNotification("Successfully Created Game!")
        setNewGameId(game.id)
        setOpenedCreateGame(true)
      })
  }

  return (
    <div className="Home">
      <Modal centered
        opened={openedCreateGame}
        onClose={() => setOpenedCreateGame(false)}
        title="Your game is ready!">
        <GoToGame getGameId={() => newGameId} />
      </Modal>
      <Modal centered
        opened={openedAddPlayer}
        onClose={() => setOpenedAddPlayer(false)}
        title="Join a Game!">
        <AddPlayer setOpened={setOpenedAddPlayer} />
      </Modal>

      <Stack align="center" spacing="xl" sx={(theme) => ({ backgroundColor: theme.colors.dark[7]})}>
        <Title order={1} color="red">🔥 Extreme Startup 🔥</Title>
        <Button variant="outline" color="green" radius="md" size="lg" onClick={createGameButtonAction}>Create a Game!</Button>
        <Button variant="outline" color="orange" radius="md" size="lg" onClick={() => { setOpenedAddPlayer(true) }}>Join a Game!</Button>
      </Stack>
    </div>
  )
}

export default Home
