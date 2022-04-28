'use-strict';
const Axios = require('axios');

exports.search = async (page) => {

    try{
        // page start from 0
        page = parseInt(page, 0) + 1;
        const endpoint = `https://api.github.com/search/repositories?q=nodejs+description:NodeJS&per_page=10&page=${page}`;
        const response = await Axios.get(`${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'request',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET'
          },
        })
        console.log("endpoint", endpoint);
        return JSON.stringify(response.data);
    }catch (e) {
      console.error(e);
      return JSON.stringify({});
    }
};