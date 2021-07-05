import { Link } from "react-router-dom";
import logo from "../assets/mo_logo.png";
import "../css/nav.css";

const NavBar = () => (
  <nav>
    <Link to="/" className="flex">
      <img className="logo" alt="MO Logo" src={logo} />
      <h1>Mystical Odour</h1>
    </Link>
    <div className="flex">
      <div className="subnav">
        <button className="subnavbtn">
          Overview <i className="fa fa-caret-down"></i>
        </button>
        <div className="subnav-content">
          <Link to="/classes">Classes</Link>
          <Link to="/roles">Roles</Link>
          <Link to="/ranks">Ranks</Link>
          <Link to="/raids">Raids</Link>
        </div>
      </div>
      <Link className="link" to="/loot-council">
        Loot Council
      </Link>
    </div>
  </nav>
);

export default NavBar;
