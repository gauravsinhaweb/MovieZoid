import "./App.css";
import Hero from "./Hero/Hero";
import Summary from "./Components/Summary";
import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

function App() {
  const [selectedMovie, setSelectedMovie] = useState("");
  // this.unlisten = this.props.history.listen((location, action) => {
  //   console.log("on route change");
  // });

  return (
    <>
      <div className="body"></div>
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />

          <Switch>
            <Route exact path={`/movie/:id`}>
              <Summary
                selectedMovie={selectedMovie}
                setselectedMovie={setSelectedMovie}
              />
            </Route>

            <Route path="/">
              <Hero
                selectedMovie={selectedMovie}
                setSelectedMovie={setSelectedMovie}
              />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
