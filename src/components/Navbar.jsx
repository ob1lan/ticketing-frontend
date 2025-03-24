import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Navbar({ user, profile, onOpenProfile, onOpenSettings }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><a href="/dashboard">Tickets</a></li>
            <li><a href="/companies">Companies</a></li>
            <li><a href="/users">Users</a></li>
            <li><a href="/#">About</a></li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl" href="/">Ticketing System</a>
      </div>
      <div className="navbar-end">
        <div className="p-2">Welcome, {profile.first_name}</div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar avatar-online">
            {user && (
              <div className={user?.role === "admin" ? "ring-warning ring-offset-base-100 w-10 rounded-full ring ring-offset-2" : "ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2"} >

                <img
                  alt="Avatar"
                  src={profile?.avatar ? profile?.avatar : `https://api.dicebear.com/7.x/identicon/svg?seed=username`}>
                </img>
              </div>
            )}
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            {user && (
              <>
                <span className="text-sm opacity-75 block mb-1">
                  Connected as <strong>{user.username}</strong>
                </span>

                {/* Single evaluation for user.role */}
                <span
                  className={`badge badge-dash ${user.role === "admin" ? "badge-warning" : "badge-primary"
                    } mx-auto mb-1`}
                >
                  {user.role === "admin" ? "Admin" : "Customer"}
                </span>
              </>
            )}
            <li>
              <a className="justify-between" onClick={onOpenProfile}>
                Profile
              </a>
            </li>
            <li><a onClick={onOpenSettings}>Settings</a></li>
            <li><a onClick={handleLogout}>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  user: PropTypes.object,
  profile: PropTypes.object.isRequired,
  onOpenProfile: PropTypes.func.isRequired,
  onOpenSettings: PropTypes.func.isRequired,
};

export default Navbar;