import { Link } from "react-router-dom";
import { useAuth } from "@/helper/auth";

const NotFound = () => {
  const { LoggedInUserData, FirstLoader } = useAuth();

  return (<>
    {FirstLoader ?
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Loading...</p>
        </div>
      </div>
      :
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </Link>
        </div>
      </div>
    }
  </>);
};

export default NotFound;
