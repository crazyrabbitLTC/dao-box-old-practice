import React from 'react';
import { Anchor, Paper, Title, Text, Container, Group, Button } from '@mantine/core';

// web3
import { useProvider, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

// components
import { CustomConnectButton } from '../components/CustomConnectButton/CustomConnectButton';
import NavBar from '../components/NavBar/NavBar';

export default function Auth() {
  const domain = window.location.host;
  const { origin } = window.location;
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();

  function createSiweMessage(address: string, statement: string) {
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
      chainId: 1,
    });
    return message.prepareMessage();
  }

  async function signInWithEthereum() {
    const message = createSiweMessage(
      await signer.getAddress(),
      'Sign in with Ethereum to the app.'
    );
    console.log(await signer.signMessage(message));
  }

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
            Step 1: Connect your wallet
            <CustomConnectButton />
          </Group>
          <Group position="apart" mt="md">
            Step 2: Sign in with your wallet
            <Button onClick={() => signInWithEthereum()}>Sign in to DAO BOX</Button>
          </Group>
        </Paper>
        {/* <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@mantine.dev" required />
          <PasswordInput label="Password" placeholder="Your password" required mt="md" />
          <Group position="apart" mt="md">
            <Checkbox label="Remember me" />
            <Anchor<'a'> onClick={(event) => event.preventDefault()} href="#" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl">
            Sign in
          </Button>
        </Paper> */}
      </Container>
    </>
  );
}
