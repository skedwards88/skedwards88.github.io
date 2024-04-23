import React from "react";
import projects from "./projects.js";
import getImageLookup from "./imageLookup.js";

const imageLookup = getImageLookup();

function Project({
  name,
  id,
  description,
  site,
  activityDescription = "Play now",
  numPlayers,
  playTimeMinutes,
  googlePlay,
}) {
  const imagePath = imageLookup[id].default;

  return (
    <div className="project" key={id}>
      <h3>{name}</h3>
      <img className="icon" src={imagePath} alt={id} />
      <div id="playParameters">
        <p>
          {numPlayers
            ? `${numPlayers} player${numPlayers > 1 ? "s" : ""}`
            : null}
        </p>
        <p>{numPlayers && playTimeMinutes ? " ● " : null}</p>
        <p>{playTimeMinutes ? playTimeMinutes + " min" : null}</p>
      </div>
      <p>{description}</p>
      <div className="links">
        <a href={site}>{activityDescription}</a>
        {googlePlay ? <div>&nbsp;●&nbsp;</div> : <></>}
        {googlePlay ? <a href={googlePlay}>Find on Google Play</a> : <></>}
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
      <h1>Puzzles and Games</h1>
      <h4>{'All of these apps are installable and work offline.\nGoogle "Progressive Web App" to learn how to install on your device.'}</h4>
      <div id="projects">{displays}</div>
      <h3>
        Designers: Colin Thom & Sarah Edwards
        <br />
        Software Developer: Sarah Edwards
      </h3>
    </div>
  );
}

export default App;
