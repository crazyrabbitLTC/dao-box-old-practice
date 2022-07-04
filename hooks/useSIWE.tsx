import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
// import { useLocation } from 'react-router-dom';

// web3
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
// import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

interface User {
  address?: string;
}

interface AuthContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  user?: User;
  error?: Error;
  loading?: boolean;
  signIn: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Export the provider as we need to wrap the entire app with it
export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, setState] = useState<AuthContextType>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  const { address } = useAccount();
  const { chain: activeChain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  // We are using `react-router` for this example,
  // but feel free to omit this or use the
  // router of your choice.
  //   const history = useHistory();
  //   const location = useLocation();

  // If we change page, reset the error state.
  //   useEffect(() => {
  //     if (error) setError(null);
  //   }, [location.pathname]);

  //SIWE
  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch('/api/me');
        const json = await res.json();
        setState((x) => ({ ...x, user: { address: json.address } }));
      } catch (_error) {}
    };

    // 1. page loads
    handler();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  //SIWE
  const signIn = async () => {
    console.log('signIn');
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

      setState((x) => ({ ...x, user: { address }, loading: false }));
    } catch (e) {
      setState((x: any) => ({ ...x, error: e, loading: false }));
    }
  };

  // Call the logout endpoint and then remove the user
  // from the state.
  async function logout() {
    await fetch('/api/logout');
    setState((x) => ({ ...x, user: { address: undefined } }));
  }

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo(
    () => ({
      state,
      loading,
      error,
      signIn,
      logout,
    }),
    [state, loading, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  console.log('MemoedValue: ', memoedValue);
  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>;
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useAuth() {
  return useContext(AuthContext);
}
