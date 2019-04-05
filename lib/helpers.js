/*
 * Helpers for various tasks
 *
 */

// Dependencies

// Container for all the helpers
var helpers = {};



// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str)=>{
  try{
    const obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// Export the module
module.exports = helpers;