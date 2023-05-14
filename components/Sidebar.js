import Link from "next/link"
import { useRouter } from "next/router"

function Sidebar() {

  const router = useRouter()

  const isActive = (pathname) => {
    return router.pathname === pathname ? "bg-yellow-600 text-white" : "text-gray-400 hover:text-white hover:bg-yellow-400 focus:outline-none focus:text-white focus:bg-yellow-400"
  }


  return (
    <div className="lg:w-64 md:w-48 md:h-screen md:sticky md:top-0 bg-slate-800 px-8 py-4 flex flex-col justify-between border-t-2 border-white">
      <div className="text-center">
        <div className="text-white font-bold text-xl mb-4">Menu</div>
        <ul>
          <li className={`w-full rounded-lg text-center mb-4 ${isActive("/Dashboard")}`}>
            <Link href="/Dashboard">Home</Link>
          </li>
          <li className={`w-full rounded-lg text-center mb-4 ${isActive("/Marketplace")}`}>
            <Link href="/Marketplace">Marketplace</Link>
          </li>
          <li className={`w-full rounded-lg text-center mb-4 ${isActive("/VerifyLand")}`}>
            <Link href="/VerifyLand">Verify Land</Link>
          </li>
          <li className={`w-full rounded-lg text-center mb-4 ${isActive("/MyProperties")}`}>
            <Link href="/MyProperties">My Property</Link>
          </li>
          <li className={`w-full rounded-lg text-center mb-4 ${isActive("/Ongoing")}`}>
            <Link href="/Ongoing">On-going Transactions</Link>
          </li>
          <li className={`w-full rounded-lg text-center ${isActive("/History")}`}>
            <Link href="/History">Transaction History</Link>
          </li>
        </ul>
        <div className="h-px bg-gray-700 my-6"></div>
        <div className="text-white font-bold text-xl mb-4">Settings</div>
        <ul>
          <li className={`w-full rounded-lg text-center ${isActive("/MyAccount")}`}>
            <Link href="/MyAccount">My Account</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar;

