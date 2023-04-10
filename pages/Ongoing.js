import OngoingComp from "../components/OngoingComp"

const Ongoing = () => {
  return (
    <div>
      <>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} logout={logout} />

        <div className="md:flex">
          <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
            <Sidebar />
          </div>

          <div className="w-full">
              
          </div>
        </div>
      </>
    </div>
  )
}

export default Ongoing