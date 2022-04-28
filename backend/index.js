'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const Pack = require('./package');

const formatter = require('./controller/formatController');
const github = require('./controller/githubContoller');

const init = async () => {

    const server = Hapi.server({
        port: 8000,
        host: 'localhost',        
        "routes": {
            "cors": {
                "origin": ["http://localhost:3000"],
                "headers": ["Accept", "Content-Type"],
                "additionalHeaders": ["X-Requested-With"]
            }
        }
    });

    const swaggerOptions = {
        info: {
            title: 'API Documentation',
            version: Pack.version,
        },
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    
    const reqSchema = Joi.object({
        id: Joi.number().required(),
        title: Joi.string().required(),
        level: Joi.number().required(),
        children: Joi.array().items().required().default([]),
        parent_id: Joi.number().allow(null).required().default(null)
    });

    const objReqSchema = Joi.object().pattern(
        Joi.string(),
        Joi.array().items(Joi.object()
          .concat(reqSchema))
    );

    server.route({
        method: 'GET',
        path: '/search',
        options: {
            description: 'Github Search API',
            tags: ['api'],
            handler: async (request, h) => {
                const page = request.query.page || 1;
                const result = await github.search(page);
                return result;
            },
            cache: {
                expiresIn: 30 * 1000,
                privacy: 'private'
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/format',
        options: {
            description: 'Returns the input into the parent and children format',
              tags: ['api'],
              validate: {
                payload: objReqSchema
            },
            handler: (request, h) => formatter.transform(request.payload)
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

