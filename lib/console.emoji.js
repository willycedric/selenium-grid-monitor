/**
 *  console.emoji — Custom Console Logging with Emoji
 *
 *  inspired by & adapted from console.frog by Tim Holman
 *  https://github.com/tholman/console-dot-frog/
 *
 *  MIT licensed
 *
 */

// Define your custom commands and emoji
console.unicorn = console.log.bind(console, '🦄');
console.pizza = console.log.bind(console, '🍕');
console.beer = console.log.bind(console,'\x1b[32m%s%s\x1b[0m', '🍺');
console.poo = console.log.bind(console,'\x1b[31m%s%s\x1b[0m', '💩');

// Log to the console!
// console.unicorn("Magical!");
// console.beer("Cheers!");
// console.pizza("Tasty!");
// console.poo("Oh f*ck!");

module.exports = console