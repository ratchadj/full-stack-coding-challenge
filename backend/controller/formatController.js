'use-strict';

exports.transform = async (input_data) => {
    try {
        console.log(input_data);
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
                }else{ // root
                    response.push(temp[element.id]);
                }
            });
        }
        // console.log(response);
        return JSON.stringify(response);
    } catch (error) {
        console.log(error);
    }
};