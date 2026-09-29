import { useEffect, useState } from "react";
import { getHealth } from "../api/health";

function HomePage() {
  const [apiStatus, setApiStatus] = useState("checking...");

  useEffect(() => {
    getHealth()
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus("unreachable"));
  }, []);

  return (
    <>
      <h1>Home</h1>
      <p>API status: {apiStatus}</p>
    </>
  );
}

export default HomePage;