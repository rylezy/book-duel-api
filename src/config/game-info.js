// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'book-duel',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'Bookish',            // the name players will see
  team: 'Group1 (3-1)',            // your group's name and section, for example Bookworms (3-1)
  developer: 'rylezy',       // YOUR GitHub username: this build is yours
  description: 'Book Duel is a multiplayer trivia game where players answer questions, earn points, and manage their HP to outlast their opponents and become the last player standing.',     // one sentence about how the game is played
  min_players: 1,               // change to the limits your game is designed for
  max_players: 30,
  version: pkg.version,         // read from package.json, do not edit here
};
