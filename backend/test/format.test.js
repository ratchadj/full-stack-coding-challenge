'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it, experiment, test } = exports.lab = Lab.script();
const { start } = require('../server');

const requestDefaults = {
    method: 'POST',
    url: '/format',
    payload: {}
};

let server;

beforeEach(async () => {
    server = await start();
});

afterEach(async () => {
    await server.stop();
});

describe('The format controller | POST /format', () => {

    it('| invalid payload -> 400 Bad Request', async () => {
        const request = Object.assign({}, requestDefaults);
        const res = await server.inject(request);
        expect(res.statusCode).to.equal(400);
    });
    
    it('| invalid id -> 400 Bad Request', async () => {
        const request = Object.assign({}, requestDefaults, {
            payload: {
                "0": [
                    { "id": 17, "title": "Blue Window", "level": 2, "children": [], "parent_id": 12 },
                    { "title": "Door", "level": 2, "children": [], "parent_id": 13 },
                ]
            }
        });
        const res = await server.inject(request);
        expect(res.statusCode).to.equal(400);
    });
    
    it('| invalid title -> 400 Bad Request', async () => {
        const request = Object.assign({}, requestDefaults, {
            payload: {
                "0": [
                    { "id": 17, "title": "", "level": 2, "children": [], "parent_id": 12 },
                    { "id": 16, "title": "Door", "level": 2, "children": [], "parent_id": 13 },
                ]
            }
        });
        const res = await server.inject(request);
        expect(res.statusCode).to.equal(400);
    });

    it('| invalid level -> 400 Bad Request', async () => {
        const request = Object.assign({}, requestDefaults, {
            payload: {
                "0": [
                    { "id": 17, "title": "Blue Window", "children": [], "parent_id": 12 },
                    { "id": 16, "title": "Door", "level": 2, "children": [], "parent_id": 13 },
                ]
            }
        });
        const res = await server.inject(request);
        expect(res.statusCode).to.equal(400);
    });

    it('| invalid children -> 400 Bad Request', async () => {
        const request = Object.assign({}, requestDefaults, {
            payload: {
                "0": [
                    { "id": 17, "title": "Blue Window", "level": 1, "parent_id": 12 },
                    { "id": 16, "title": "Door", "level": 2, "children": [], "parent_id": 13 },
                ]
            }
        });
        const res = await server.inject(request);
        expect(res.statusCode).to.equal(400);
    });

    it('| invalid parent_id -> 400 Bad Request', async () => {
        const request = Object.assign({}, requestDefaults, {
            payload: {
                "0": [
                    { "id": 17, "title": "Blue Window", "level": 1, "parent_id": 12 },
                    { "id": 16, "title": "Door", "level": 2, "children": [] },
                ]
            }
        });
        const res = await server.inject(request);
        expect(res.statusCode).to.equal(400);
    });

    it('| valid request -> 200 OK', async () => {

        const request = Object.assign({}, requestDefaults, {
            payload: { "0": [ { "id": 10, "title": "House", "level": 0, "children": [], "parent_id": null }, { "id": 11, "title": "House", "level": 0, "children": [], "parent_id": null } ], "1": [ { "id": 112, "title": "11Red Roof", "level": 1, "children": [], "parent_id": 11 }, { "id": 12, "title": "Red Roof", "level": 1, "children": [], "parent_id": 10 }, { "id": 18, "title": "Blue Roof", "level": 1, "children": [], "parent_id": 10 }, { "id": 13, "title": "Wall", "level": 1, "children": [], "parent_id": 10 } ], "2": [ { "id": 17, "title": "Blue Window", "level": 2, "children": [], "parent_id": 12 }, { "id": 16, "title": "Door", "level": 2, "children": [], "parent_id": 13 }, { "id": 15, "title": "Red Window", "level": 2, "children": [], "parent_id": 12 } ] }
        });

        const response = [{"id":10,"title":"House","level":0,"children":[{"id":12,"title":"Red Roof","level":1,"children":[{"id":17,"title":"Blue Window","level":2,"children":[],"parent_id":12},{"id":15,"title":"Red Window","level":2,"children":[],"parent_id":12}],"parent_id":10},{"id":18,"title":"Blue Roof","level":1,"children":[],"parent_id":10},{"id":13,"title":"Wall","level":1,"children":[{"id":16,"title":"Door","level":2,"children":[],"parent_id":13}],"parent_id":10}],"parent_id":null},{"id":11,"title":"House","level":0,"children":[{"id":112,"title":"11Red Roof","level":1,"children":[],"parent_id":11}],"parent_id":null}];

        const res = await server.inject(request);
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.be.an.string();
        expect(res.result).to.have.include(JSON.stringify(response));
    });

});