import React, { useEffect } from 'react';
import { Anchor, Paper, Title, Text, Container, Group, Button, Loader } from '@mantine/core';

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

  const [buttonState, setButtonState] = React.useState({ text: 'loading', spinner: true });

  useEffect(() => {
    if (!isConnected) {
      setButtonState({ text: 'Connect Wallet', spinner: false });
    }
    if (isConnected) {
      setButtonState({ text: 'Disconnect Wallet', spinner: false });
    }
    if (isConnected && user?.address) {
      setButtonState({ text: 'loading', spinner: true });
    }
  }, [isConnected, user]);

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
            We use Sign in with Ethereum, need help?{' '}
            <Anchor<'a'> href="#" size="sm" onClick={(event) => event.preventDefault()}>
              Get a Wallet
            </Anchor>
          </Text>
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
                  {buttonState.spinner ? (
                    <Loader color="white" size="xs" />
                  ) : isConnected ? (
                    'Sign in'
                  ) : (
                    'Connect Wallet'
                  )}
                </Button>
              )}
            </ConnectButton.Custom>

            {/* <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} fullWidth mt="xl">
              {buttonState.spinner ? <Loader color="white" size="xs" /> : 'Connect Wallet'}
            </Button> */}

            {/* {!isConnected && !user?.address && (
              <Button
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                fullWidth
                mt="xl"
              >
                spinner
              </Button>
            )}
            {isConnected && user?.address && (
              <Button
                onClick={async () => {
                  logout();
                }}
                variant="gradient"
                gradient={{ from: 'orange', to: 'red' }}
                fullWidth
                mt="xl"
              >
                Sign Out
              </Button>
            )}

            {isConnected && !user?.address && (
              <Button
                onClick={async () => {
                  signIn();
                }}
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                fullWidth
                mt="xl"
              >
                Sign In
              </Button>
            )}

            {!isConnected && (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    onClick={openConnectModal}
                    type="button"
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    fullWidth
                    mt="xl"
                  >
                    Connect Wallet
                  </Button>
                )}
              </ConnectButton.Custom>
            )} */}
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
