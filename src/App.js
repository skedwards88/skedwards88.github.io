import React from "react";
import "./App.css";

// clean up the import image functions
// get font a good size
// favicon
// web manifest
// service worker
// github pages

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "").split(".")[0]] = r(item);
  });
  return images;
}

const images = importAll(
  require.context("./images", false, /\.(png|jpe?g|svg)$/)
);

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
  const imagePath = images[id].default;

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
  const projects = [
    {
      id: "monkeys",
      name: "Monkeys of the Caribbean",
      description: "Compete to control the most coconut routes",
      site: "https://skedwards88.github.io/monkeys/",
      code: "https://github.com/skedwards88/monkeys",
      numPlayers: 2,
      playTimeMinutes: 15,
    },
    {
      id: "sector",
      name: "Sector",
      description: "Control the largest sector of the universe",
      site: "https://skedwards88.github.io/sector/",
      code: "https://github.com/skedwards88/sector",
      numPlayers: 2,
      playTimeMinutes: 15,
    },
    {
      id: "stars_circles",
      name: "Stars and Circles",
      description: "Stake out your territory before your opponent claims it",
      site: "https://skedwards88.github.io/stars_circles_game/",
      code: "https://github.com/skedwards88/stars_circles_game",
      numPlayers: 2,
      playTimeMinutes: 15,
    },
    {
      id: "stories",
      name: "Stories ",
      description: "Short stories inspired by Reddit writing prompts",
      site: "https://skedwards88.github.io/ShortStories/",
      code: "https://github.com/skedwards88/ShortStories",
      activityDescription: "Read now",
    },
  ];

  const displays = projects.map((project) => {
    return Project(project);
  });

  return (
    <div className="App">
      <h1>CnS Games</h1>
      <h2>
        Designed by Colin Thom
        <br />
        Built by Sarah Edwards
      </h2>
      <div id="projects">{displays}</div>
    </div>
  );
}

export default App;
