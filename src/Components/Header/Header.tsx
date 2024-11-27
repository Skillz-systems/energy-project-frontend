const Header: React.FC<{ title: string }> = ({ title }) => (
    <header className="py-4 border-b mb-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {/* Add breadcrumbs here if needed */}
    </header>
  );
  export default Header;
  