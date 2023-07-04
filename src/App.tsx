import { Navbar } from "./navbar";
import BodyContent from "./bodyContent/BodyContent";
import React , {useEffect} from "react";
function App() {
  useEffect(() => {
    const _origin = window.location.origin;
    fetch('http://localhost:3000/', {
      headers: {
        'Access-Control-Allow-Origin': _origin,
      },
    });
  }, []);
  return (
    <>
      <Navbar />
      <BodyContent />
    </>

  );
}
export default App;
