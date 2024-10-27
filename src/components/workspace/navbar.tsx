import React from "react";

const Navbar = () => {
  return (
    <nav className="flex w-full h-14 p-2">
      <div className="flex max-w-7xl w-full mx-auto">
        <div id="logo">Code Snippets</div>
        <div>Navigation</div>
        <div>User</div>
      </div>
    </nav>
  );
};

export default Navbar;
