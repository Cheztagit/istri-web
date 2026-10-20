import { NavLink } from 'react-router-dom';
import { Home, Flower, Cards, Package, Mail } from './Icons';

const items = [
  { to: '/', label: 'Peta', Icon: Home, end: true },
  { to: '/bunga', label: 'Surat', Icon: Mail, end: false },
  { to: '/game', label: 'Kartu', Icon: Cards, end: false },
  { to: '/tracking', label: 'Resi', Icon: Package, end: false },
];

const topLink = ({ isActive }: { isActive: boolean }) => `toplink${isActive ? ' on' : ''}`;
const tabLink = ({ isActive }: { isActive: boolean }) => `tab${isActive ? ' on' : ''}`;

export default function Navbar() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <NavLink to="/" className="brand">
            <Flower /> Nadya cantiku
          </NavLink>
          <nav className="toplinks" aria-label="Menu utama">
            {items.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={topLink}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <nav className="tabbar" aria-label="Menu utama mobile">
        {items.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={tabLink}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
