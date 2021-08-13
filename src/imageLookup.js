export default function getImageLookup() {
  const context = require.context("./images", false, /\.(png|jpe?g|svg)$/);
  const imageLookup = {};
  context.keys().forEach((item) => {
    const parsedName = item.replace("./", "").split(".")[0];
    imageLookup[parsedName] = context(item);
  });
  return imageLookup;
}