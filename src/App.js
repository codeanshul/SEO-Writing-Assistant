import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import { Navbar } from "./navbar";
import BodyContent from "./bodyContent/BodyContent";
function App() {
  return (
    <>
      <Navbar />
      <BodyContent />
    </>

  );
}
export default App;
