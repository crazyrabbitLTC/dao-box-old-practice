import React, { useEffect } from 'react';
import {
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Loader,
  List,
  ThemeIcon,
} from '@mantine/core';
import { CircleCheck, CircleDashed } from 'tabler-icons-react';

// web3
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// import { ethers } from 'ethers';
import useAuth from '../hooks/useSIWE';

// components
// import { CustomConnectButton } from '../components/CustomConnectButton/CustomConnectButton';
import NavBar from '../components/NavBar/NavBar';

export default function Auth() {
  const { user, loading, error, signIn, logout } = useAuth();
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  const CONNECT_WALLET = 'Connect Wallet';
  const SIGN_IN_WITH_ETHEREUM = 'Sign in with Ethereum';
  const SIGNING_IN = 'Signing in...';
  const LOADING = 'loading...';

  const [buttonState, setButtonState] = React.useState({ text: LOADING, spinner: true, state: 0 });

  useEffect(() => {
    if (!isConnected) {
      setButtonState({ text: CONNECT_WALLET, spinner: false, state: 1 });
    }
    if (isConnected && !user?.address) {
      setButtonState({ text: SIGN_IN_WITH_ETHEREUM, spinner: false, state: 2 });
    }
    if (isConnected && user?.address) {
      setButtonState({ text: SIGNING_IN, spinner: true, state: 3 });
    }
  }, [isConnected, user]);

  const greenIcon = () => (
    <ThemeIcon color="teal" size={24} radius="xl">
      <CircleCheck size={16} />
    </ThemeIcon>
  );

  const blueIcon = () => (
    <ThemeIcon color="blue" size={24} radius="xl">
      <CircleDashed size={16} />
    </ThemeIcon>
  );

  // const iconState = () => {

  //   const color =
  //   return(
  //     <ThemeIcon color="blue" size={24} radius="xl">
  //     <CircleDashed size={16} />
  //   </ThemeIcon>
  //   )
  // }

  console.log('button ', buttonState.state);
  return (
    <>
      <NavBar />
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title
            align="center"
            sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
          >
            Get into a Box!
          </Title>
          <Text color="dimmed" size="sm" align="center" mt={5}>
            Need help? {''}
            <Anchor<'a'> href="#" size="sm" onClick={(event) => event.preventDefault()}>
              Get a Wallet
            </Anchor>
          </Text>
          <Group mt={5}>
            <List spacing="xs" size="sm" center>
              <List.Item
                icon={
                  <ThemeIcon color={buttonState.state > 1 ? 'teal' : 'blue'} size={24} radius="xl">
                    {buttonState.state > 1 ? <CircleCheck size={16} /> : <CircleDashed size={16} />}
                  </ThemeIcon>
                }
              >
                Connect Wallet
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color={buttonState.state > 2 ? 'teal' : 'blue'} size={24} radius="xl">
                    {buttonState.state > 2 ? <CircleCheck size={16} /> : <CircleDashed size={16} />}
                  </ThemeIcon>
                }
              >
                Sign in with Ethereum
              </List.Item>
            </List>
          </Group>
          <Group>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button
                  onClick={async () => {
                    if (!isConnected) {
                      openConnectModal();
                    } else {
                      signIn();
                    }
                  }}
                  type="button"
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  fullWidth
                  mt="xl"
                >
                  {buttonState.spinner && <Loader color="white" size="xs" />}
                  {buttonState.text}
                </Button>
              )}
            </ConnectButton.Custom>
          </Group>
        </Paper>

        <Button
          onClick={async () => {
            logout();
          }}
          variant="gradient"
          gradient={{ from: 'orange', to: 'red' }}
          fullWidth
          mt="xl"
        >
          Demo Sign Out
        </Button>
      </Container>
    </>
  );
}
