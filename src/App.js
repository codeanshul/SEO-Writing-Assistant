import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Navbar from "./components/Navbar";
import TextInput from "./components/FrontPage";
// import OutputDisplay from "./components/Output";

function App() {

  // takeFile();

  return (
    <>

      <Navbar />
      <TextInput />

    </>

  );
}

export default App;
