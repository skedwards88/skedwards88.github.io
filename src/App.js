import React from "react";
import "./App.css";
import projects from "./projects.js";
import getImageLookup from "./imageLookup.js";

const imageLookup = getImageLookup();

function Project({
  name,
  id,
  description,
  site,
  code,
  activityDescription = "Play now",
  numPlayers,
  playTimeMinutes,
}) {
  const imagePath = imageLookup[id].default;

  return (
    <div className="project" key={id}>
      <h3>{name}</h3>
      <img className="icon" src={imagePath} alt={id} />
      <div id="playParameters">
        <p>{numPlayers ? numPlayers + " players" : null}</p>
        <p>{numPlayers && playTimeMinutes ? " ● " : null}</p>
        <p>{playTimeMinutes ? playTimeMinutes + " min" : null}</p>
      </div>
      <p>{description}</p>
      <div className="links">
        <a href={site}>{activityDescription}</a>
        <div>&nbsp;●&nbsp;</div>
        <a href={code}>See code</a>
      </div>
    </div>
  );
}

function App() {
  const displays = projects.map((project) => {
    return Project(project);
  });

  return (
    <div className="App">
      <h1>SECT Games</h1>
      <h2>Game and puzzle web apps</h2>
      <h3>
        Designed by Colin Thom
        <br />
        Built by Sarah Edwards
      </h3>
      <div id="projects">{displays}</div>
    </div>
  );
}

export default App;
