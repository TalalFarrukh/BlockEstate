function Header({ toggleSidebar, isSidebarOpen, logout }) {

  return (
    <header className="flex items-center justify-between bg-slate-800 px-4 py-4 h-16">
      <h1 className="text-lg lg:text-xl font-bold lg:ml-16 md:ml-8"><span className="text-yellow-600">Block</span><span className="text-white">Estate</span></h1>
      <div className="flex items-center">
        <button onClick={logout} className="text-gray-400 hover:text-white mr-4">Sign Out</button>
        <button className="text-gray-400 hover:text-white focus:outline-none md:hidden" onClick={toggleSidebar}>
          <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isSidebarOpen ? (
              <path className="block" d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path className="block" d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header
