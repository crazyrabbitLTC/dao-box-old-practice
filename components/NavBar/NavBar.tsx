import { HeaderAction } from './HeaderAction';
import links from './attributes.json';

//component

// interface HeaderActionProps {
//   links: { link: string; label: string; links: { link: string; label: string }[] }[];
// }

const NavBar = () => (
    <>
      <HeaderAction links={links.links} />
    </>
  );

export default NavBar;
