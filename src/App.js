import React from "react";
import projects from "./projects.js";

function Game({
  name,
  id,
  description,
  site,
  activityDescription = "Play now",
  numPlayers,
  playTimeMinutes,
}) {
  return (
    <div className="project" key={id}>
      <h3>{name}</h3>
      <a
        href={site}
        className={`game-image ${id}`}
        role="img"
        aria-label={`Screenshot of the ${name} game.`}
      ></a>
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
      </div>
    </div>
  );
}

function App() {
  const displays = projects.map((project) => {
    return Game(project);
  });

  return (
    <div className="App">
      <h1>Puzzles and Games</h1>
      <h4>
        {
          'All of these apps are installable and work offline.\nGoogle "Progressive Web App" to learn how to install on your device.'
        }
      </h4>
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
