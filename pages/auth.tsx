import React, { useEffect, useCallback, useState } from 'react';
import { Anchor, Paper, Title, Text, Container, Group, Button } from '@mantine/core';

import useAuth from '../hooks/useSIWE';

// web3
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
// import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

// components
import { CustomConnectButton } from '../components/CustomConnectButton/CustomConnectButton';
import NavBar from '../components/NavBar/NavBar';

export default function Auth() {
  const { user, loading, error, signIn, logout } = useAuth();

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

              {user?.address ? (
                <div>
                  <div>Signed in as {user?.address}</div>
                  <Button
                    onClick={async () => {
                      logout();
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button disabled={loading} onClick={signIn}>
                  Sign-In with Ethereum
                </Button>
              )}
            </div>
          </Group>
          <Button
            onClick={async () => {
              logout();
            }}
          >
            Sign Out
          </Button>
        </Paper>
      </Container>
    </>
  );
}
