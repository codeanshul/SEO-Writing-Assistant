import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import Navbar from "./components/Navbar";
import BodyContent from "./components/BodyContent";
function App() {
  return (
    <>
      <Navbar />
      <BodyContent />
    </>

  );
}
export default App;
