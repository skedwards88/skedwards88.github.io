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

function Project({ name, id, description, site, code }) {
  const imagePath = images[id].default;

  return (
    <div className="project" key={id}>
      <h2>{name}</h2>
      <div className="iconLinks">
        <img className="icon"
          src={imagePath}
          alt={id}
        />
        <div className="links">
          <a href={site}>play now</a>
          <a href={code}>see code</a>
        </div>
      </div>
      <p>{description}</p>
    </div>
  )
}

function App() {

  const projects = [
    {
      id: "monkeys",
      name: "Monkeys of the Caribbean",
      description: "A spatial strategy game built in React",
      site: "https://skedwards88.github.io/monkeys/",
      code: "https://github.com/skedwards88/monkeys",
    },
    {
      id: "sector",
      name: "Sector",
      description: "A spatial strategy game built in JavaScript",
      site: "https://skedwards88.github.io/sector/",
      code: "https://github.com/skedwards88/sector",
    },
    {
      id: "stars_circles",
      name: "Stars and Circles",
      description: "A spatial strategy game built in React",
      site: "https://skedwards88.github.io/stars_circles_game/",
      code: "https://github.com/skedwards88/stars_circles_game",
    },
    {
      id: "stories",
      name: "Stories ",
      description: "A static site generator to share short stories",
      site: "https://skedwards88.github.io/ShortStories/",
      code: "https://github.com/skedwards88/ShortStories"
    }
  ]

  const displays = projects.map(project => {
    return Project(project)
  })

  return (
    <div className="App">
      <h1>CnS Games</h1>
      <h2>Games designed by Colin, built by Sarah</h2>
      <div id="projects">
        {displays}
      </div>
    </div>
  );

}

export default App;
