import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

// components
import NavBar from '../components/NavBar/NavBar';
import Hero from '../components/Hero/Hero';

export default function HomePage() {
  console.log('Here!');

  return (
    <>
      <NavBar />
      <Hero />
      <Welcome />
      <ColorSchemeToggle />
    </>
  );
}
