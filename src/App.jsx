import "./App.css";
import Header from "./components/Header";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Success from "./components/Success";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="App">
      <Routes>
  <Route path="/" element={<Home/>} />
</Routes>


      <Routes>
  <Route path="/cart" element={<Cart/>} />
</Routes>
<Routes>
  <Route path="/success" element={<Success/>} />
</Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;