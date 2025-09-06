import React from "react";
import projects from "./projects.js";
import AppleStore from "@skedwards88/shared-components/src/components/AppleStore";
import AppleStoreDisabled from "@skedwards88/shared-components/src/components/AppleStoreDisabled";
import GooglePlayStoreDisabled from "@skedwards88/shared-components/src/components/GooglePlayStoreDisabled";
import GooglePlayStore from "@skedwards88/shared-components/src/components/GooglePlayStore";
// import NoStore from "@skedwards88/shared-components/src/components/NoStore";

function Game({
  name,
  id,
  description,
  site,
  googleAppLink,
  appleAppLink,
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
      <p>{description}</p>
      <div id="playParameters">
        <p>
          {numPlayers
            ? `${numPlayers} player${numPlayers > 1 ? "s" : ""}`
            : null}
        </p>
        <p>{numPlayers && playTimeMinutes ? " ● " : null}</p>
        <p>{playTimeMinutes ? playTimeMinutes + " min" : null}</p>
      </div>
      <div className="appStoreButtons">
        {googleAppLink ? (
          <GooglePlayStore appLink={googleAppLink}></GooglePlayStore>
        ) : (
          <GooglePlayStoreDisabled />
        )}

        {appleAppLink ? (
          <AppleStore appLink={appleAppLink}></AppleStore>
        ) : (
          <AppleStoreDisabled />
        )}

        <a
          className="appStoreButton"
          id="pwa"
          href={site}
          aria-label="Play in your browser"
        ></a>
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
      <h1>Twisted Trail Games</h1>
      <p>
        <a href="https://www.patreon.com/TwistedTrailGames">
          Follow on Patreon
        </a>{" "}
        (for free) to get sneak previews and learn about new releases.
      </p>
      <div id="projects">{displays}</div>
      <p>
        Designers: Colin Thom & Sarah Edwards
        <br />
        Software Developer: Sarah Edwards
      </p>
    </div>
  );
}

export default App;
