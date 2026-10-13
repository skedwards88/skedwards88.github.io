import projects, {type Project} from "./projects";
import AppleStore from "@skedwards88/shared-components/src/components/AppleStore";
import AppleStoreDisabled from "@skedwards88/shared-components/src/components/AppleStoreDisabled";
import GooglePlayStoreDisabled from "@skedwards88/shared-components/src/components/GooglePlayStoreDisabled";
import GooglePlayStore from "@skedwards88/shared-components/src/components/GooglePlayStore";

function Game({
  name,
  id,
  description,
  site,
  googleAppLink,
  appleAppLink,
  numPlayers,
  playTimeMinutes,
}: Project): React.JSX.Element {
  return (
    <div className="project" key={id}>
      <h2>{name}</h2>
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
            ? `${numPlayers} player${numPlayers != 1 ? "s" : ""}`
            : null}
        </p>
        <p>{numPlayers && playTimeMinutes ? " ● " : null}</p>
        <p>{playTimeMinutes ? playTimeMinutes + " min" : null}</p>
      </div>
      <div className="appStoreButtons">
        {googleAppLink ? (
          <GooglePlayStore
            appLink={googleAppLink}
            userId="untracked_ttg_site"
            sessionId="untracked_ttg_site"
          ></GooglePlayStore>
        ) : (
          <GooglePlayStoreDisabled />
        )}

        {appleAppLink ? (
          <AppleStore
            appLink={appleAppLink}
            userId="untracked_ttg_site"
            sessionId="untracked_ttg_site"
          ></AppleStore>
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

function App(): React.JSX.Element {
  const displays = projects.map((project) => {
    return Game(project);
  });

  return (
    <div className="App">
      <div id="logo"></div>
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
