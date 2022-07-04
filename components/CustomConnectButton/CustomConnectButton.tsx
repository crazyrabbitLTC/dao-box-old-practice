import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@mantine/core';

export const CustomConnectButton = () => (
  <ConnectButton.Custom>
    {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => (
      <div
        {...(!mounted && {
          'aria-hidden': true,
          style: {
            opacity: 0,
            pointerEvents: 'none',
            userSelect: 'none',
          },
        })}
      >
        {(() => {
          if (!mounted || !account || !chain) {
            return (
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
            );
          }
          if (chain.unsupported) {
            return (
              <Button onClick={openChainModal} type="button">
                Wrong network
              </Button>
            );
          }
          return (
            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                onClick={openChainModal}
                style={{ display: 'flex', alignItems: 'center' }}
                type="button"
              >
                {chain.hasIcon && (
                  <div
                    style={{
                      background: chain.iconBackground,
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      overflow: 'hidden',
                      marginRight: 4,
                    }}
                  >
                    {chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        style={{ width: 12, height: 12 }}
                      />
                    )}
                  </div>
                )}
                {/* {chain.name} */}
                Connected!
              </Button>
              <Button onClick={openAccountModal} type="button" variant="outline">
                {/* {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''} */}
                Change Wallet
              </Button>
            </div>
          );
        })()}
      </div>
    )}
  </ConnectButton.Custom>
);
