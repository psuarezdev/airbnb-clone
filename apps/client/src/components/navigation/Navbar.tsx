import Container from '../Container';
import Categories from './Categories';
import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';

export default function Navbar() {
  return (
    <header className="fixed z-10 w-full bg-white shadow-sm">
      <nav className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <UserMenu />
          </div>
        </Container>
      </nav>
      <Categories />
    </header>
  );
}
