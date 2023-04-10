import Link from 'next/link'
import { useRouter } from 'next/router'

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
          <li className="mb-4">
            <button onClick={() => router.push("/Dashboard")} className={`w-full rounded-lg text-center ${isActive("/Dashboard")}`}>
              <Link href="/Dashboard">Home</Link>
            </button>
          </li>
          <li className="mb-4">
            <button onClick={() => router.push("/Marketplace")} className={`w-full rounded-lg text-center ${isActive("/Marketplace")}`}>
              <Link href="">Marketplace</Link>
            </button>
          </li>
          <li className="mb-4">
            <button onClick={() => router.push("/VerifyLand")} className={`w-full rounded-lg text-center ${isActive("/VerifyLand")}`}>
              <Link href="/VerifyLand">Verify Land</Link>
            </button>
          </li>
          <li className="mb-4">
            <button onClick={() => router.push("/MyProperties")} className={`w-full rounded-lg text-center ${isActive("/MyProperties")}`}>
              <Link href="/MyProperties">My Properties</Link>
            </button>
          </li>
          <li>
            <button onClick={() => router.push("/Ongoing")} className={`w-full rounded-lg text-center ${isActive("/Ongoing")}`}>
              <Link href="/Ongoing">On-going Transactions</Link>
            </button>
          </li>
        </ul>
        <div className="h-px bg-gray-700 my-6"></div>
        <div className="text-white font-bold text-xl mb-4">Settings</div>
        <ul>
          <li>
            <button onClick={() => router.push("/MyAccount")} className={`w-full rounded-lg text-center ${isActive("/MyAccount")}`}>
              <Link href="">My Account</Link>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar;

