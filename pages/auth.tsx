import React, { useEffect, useCallback, useState } from 'react';
import { Anchor, Paper, Title, Text, Container, Group, Button } from '@mantine/core';

// web3
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
// import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

// components
import { CustomConnectButton } from '../components/CustomConnectButton/CustomConnectButton';
import NavBar from '../components/NavBar/NavBar';

export default function Auth() {
  const { address, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();

  const [state, setState] = useState<{
    address?: string;
    error?: Error;
    loading?: boolean;
  }>({});

  console.log('state: ', state);
  console.log('connected: ', isConnected);
  
  const { signMessageAsync } = useSignMessage();

  const signIn = useCallback(async () => {
    try {
      const chainId = activeChain?.id;
      if (!address || !chainId) return;

      setState((x) => ({ ...x, error: undefined, loading: true }));
      // Fetch random nonce, create SIWE message, and sign with wallet
      const nonceRes = await fetch('/api/nonce');
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: await nonceRes.text(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      });
      if (!verifyRes.ok) throw new Error('Error verifying message');

      setState((x) => ({ ...x, address, loading: false }));
    } catch (error) {
      setState((x: any) => ({ ...x, error, loading: false }));
    }
  }, []);

  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch('/api/me');
        const json = await res.json();
        setState((x) => ({ ...x, address: json.address }));
      } catch (_error) {}
    };
    // 1. page loads
    handler();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  return (
    <>
      <NavBar />
      <Container size={420} my={40}>
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

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Group>
            <div>
              {/* Account content goes here */}

              {state.address ? (
                <div>
                  <div>Signed in as {state.address}</div>
                  <Button
                    onClick={async () => {
                      await fetch('/api/logout');
                      setState({});
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button disabled={state.loading} onClick={signIn}>
                  Sign-In with Ethereum
                </Button>
              )}
            </div>
          </Group>
        </Paper>
      </Container>
    </>
  );
}
