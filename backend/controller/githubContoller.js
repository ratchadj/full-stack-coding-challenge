'use-strict';
const Axios = require('axios');

/**
* This function return github API endpoint
* For example page parameter '1' will turn into 'https://api.github.com/search/repositories?q=nodejs+description:NodeJS&per_page=10&page=1'
* @param {string} page - the page we want to retrive data from github API
* @returns {string} - github endpoint for retrieving data
*/
getEndpoint = (page) => {
  page = isNaN(page) || page <= 0 ? 1 : Math.abs(parseInt(page)+1);
  const endpoint = `https://api.github.com/search/repositories?q=nodejs+description:NodeJS&per_page=10&page=${page}`;
  return endpoint;
}

/**
 * This function return search data from github API
 * @param {string} page - the page we want to retrive data from github API.
 * @return {Object} - search data from Github API
 */
search = async (page) => {
    try{
        // start page value eq 0
        const endpoint = getEndpoint(page);
        const response = await Axios.get(`${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'request',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET'
          },
        });
        return JSON.stringify(response.data);
    }catch (e) {
      console.error(e);
      return JSON.stringify({});
    }
};

/**
 * Github API connector
 * @module githubController
 */
module.exports = { getEndpoint, search }