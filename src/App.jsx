import { useState } from "react";
import Footer from "./components/footer.component";
import Header from "./components/header.component";
import LandingPage from "./views/landingPage";

function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="App">
      {!isExpanded && <Header />}

      <LandingPage isExpanded={isExpanded} onClickSsExpanded={setIsExpanded} />

      {!isExpanded && <Footer />}
    </div>
  );
}

export default App;
