'use-strict';

/**
 * Formatter API
 * @module formatController
 */

/**
 * @typedef {Object} data
 * @property {string} id
 * @property {string} title
 * @property {number} level
 * @property {Array.<Object>} children
 * @property {number} parent_id
 */

/**
 * @typedef {Object} input
 * @property {string} key - level of data
 * @property {Array.<data>} data - array of data with the same level
 */

/**
 * @typedef {Object} formatted
 * @property {Array.<data>} data - formatted data
 */

/**
 * This function formatted data
 * @param {input} input - input data has level as a key
 * @return {formatted} - transform data by adding child into the children array of its parent
 */
exports.transform = async (input_data) => {
    try {
        let response = [];
        let temp = [];
        for (const [key, value] of Object.entries(input_data)) {
            value.forEach(element => {
                temp[element.id] = element;
            });
        } 

        // Get the array of keys
        let keys = Object.keys( input_data );

        // Sort the keys in descending order
        keys.sort( function ( a, b ) { return b - a; } );

        // Iterate through the array of keys and push response data 
        for ( let i = 0; i < keys.length; i++ ) {
            const data = input_data[ keys[i]];
            data.forEach(element => {
                if(element.parent_id){
                    temp[element.parent_id] = temp[element.parent_id] || {};
                    temp[element.parent_id].children = temp[element.parent_id].children || [];
                    temp[element.parent_id].children.push(element);
                }else{ // root level
                    response.push(temp[element.id]);
                }
            });
        }
        return JSON.stringify(response);
    } catch (error) {
        console.log(error);
    }
};