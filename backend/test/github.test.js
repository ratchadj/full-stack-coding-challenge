'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it, experiment, test } = exports.lab = Lab.script();
const { start } = require('../server');
const github = require('../controller/githubContoller');

let server;

beforeEach(async () => {
    server = await start();
});

afterEach(async () => {
    await server.stop();
});

describe('The format controller | POST /search', () => {
    
    it('| valid endpoint -> 200 OK', async () => {
        const res = await server.inject({
            method: 'GET',
            url: `/search`,
            payload: {}
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result).not.to.be.null();
    });

    it('| request parameter page = test -> endpoint page = 1', async () => {
        const endpoint = github.getEndpoint('test');
        const expectedEndpoint = `https://api.github.com/search/repositories?q=nodejs+description:NodeJS&per_page=10&page=1`;
        expect(endpoint).to.be.a.string();
        expect(endpoint).to.be.have.include(expectedEndpoint);
    });

    it('| request parameter page = null -> endpoint page = 1', async () => {
        const endpoint = github.getEndpoint();
        const expectedEndpoint = `https://api.github.com/search/repositories?q=nodejs+description:NodeJS&per_page=10&page=1`;
        expect(endpoint).to.be.a.string();
        expect(endpoint).to.be.have.include(expectedEndpoint);
    });

    it('| request parameter page = -1 -> endpoint page = 1', async () => {
        const endpoint = github.getEndpoint(-1);
        const expectedEndpoint = `https://api.github.com/search/repositories?q=nodejs+description:NodeJS&per_page=10&page=1`;
        expect(endpoint).to.be.a.string();
        expect(endpoint).to.be.have.include(expectedEndpoint);
    });

    it('| request parameter page = 0 -> endpoint page = 1', async () => {
        const endpoint = github.getEndpoint(0);
        const expectedEndpoint = `https://api.github.com/search/repositories?q=nodejs+description:NodeJS&per_page=10&page=1`;
        expect(endpoint).to.be.a.string();
        expect(endpoint).to.be.have.include(expectedEndpoint);
    });

    it('| request parameter page = 1 -> endpoint page = 1', async () => {
        const endpoint = github.getEndpoint(1);
        const expectedEndpoint = `https://api.github.com/search/repositories?q=nodejs+description:NodeJS&per_page=10&page=2`;
        expect(endpoint).to.be.a.string();
        expect(endpoint).to.be.have.include(expectedEndpoint);
    });

    it('| request parameter page = 2 -> endpoint page = 1', async () => {
        const endpoint = github.getEndpoint(2);
        const expectedEndpoint = `https://api.github.com/search/repositories?q=nodejs+description:NodeJS&per_page=10&page=3`;
        expect(endpoint).to.be.a.string();
        expect(endpoint).to.be.have.include(expectedEndpoint);
    });

});