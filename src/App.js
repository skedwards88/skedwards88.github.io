import React from "react";
import "./App.css";

// clean up the import image functions
// get colored monkeys icon
// get higher resolution icons where needed
// make dynamic based on viewport width
// add frame around each project
// get font a good size
// style background
// change name
// link to repo and linkedin
// set up commit hooks, see if can make global

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '').split(".")[0]] = r(item); });
  return images;
}

const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

function Project({ name, id, description, site, code, activityDescription="Play now" }) {
  const imagePath = images[id].default;

  return (
    <div className="project" key={id}>
      <h2>{name}</h2>
      <img className="icon"
        src={imagePath}
        alt={id}
      />
      <p>{description}</p>
      <div className="links">
        <a href={site}>{activityDescription}</a>
        <div>&nbsp;●&nbsp;</div>
        <a href={code}>See code</a>
      </div>

    </div>
  )
}

function App() {

  const projects = [
    {
      id: "monkeys",
      name: "Monkeys of the Caribbean",
      description: "2 players ● 15 min ● Compete to control the most coconut routes",
      site: "https://skedwards88.github.io/monkeys/",
      code: "https://github.com/skedwards88/monkeys",
    },
    {
      id: "sector",
      name: "Sector",
      description: "2 players ● 15 min ● Control the largest sector of the universe",
      site: "https://skedwards88.github.io/sector/",
      code: "https://github.com/skedwards88/sector",
    },
    {
      id: "stars_circles",
      name: "Stars and Circles",
      description: "2 players ● 15 min ● Stake out your territory before your opponent claims it",
      site: "https://skedwards88.github.io/stars_circles_game/",
      code: "https://github.com/skedwards88/stars_circles_game",
    },
    {
      id: "stories",
      name: "Stories ",
      description: "Short stories inspired by Reddit writing prompts",
      site: "https://skedwards88.github.io/ShortStories/",
      code: "https://github.com/skedwards88/ShortStories",
      activityDescription: "Read now",
    }
  ]

  const displays = projects.map(project => {
    return Project(project)
  })

  return (
    <div className="App">
      <h1>CnS Games</h1>
      <h2>Designed by Colin Thom<br/>Built by Sarah Edwards</h2>
      <div id="projects">
        {displays}
      </div>
    </div>
  );
}

export default App;
