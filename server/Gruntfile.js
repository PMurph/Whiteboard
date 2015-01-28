'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var serverSourceFiles = [
        'src/**/*.js',
    ];

    var serverTestFiles = [
        'tests/**/*Spec.js'
    ];

    var mongoCommand = "mongod --dbpath db_data/ --logpath db_data/log.txt --smallfiles ",
        jasmineCommand = "JASMINE_CONFIG_PATH=jasmine.json jasmine";

    grunt.initConfig({
        watch: {
        },
        jshint: {
            options: {
                jshintrc: '../.jshintrc'
            },
            src: serverSourceFiles.concat(serverTestFiles)
        },
        nodemon: {
            all: {
                script: 'src/main.js',
                cwd: __dirname + '/src/',
                watch: serverSourceFiles
            }
        },
        shell: {
            mongoStart: {
                command: mongoCommand + '--fork'
            },
            mongoStop: {
                command: mongoCommand + '--shutdown'
            },
            jasmine: {
                command: jasmineCommand
            }
        }
    });

    grunt.registerTask('watch-mongo', function () {
        var execSync = require('exec-sync');
     
        console.log('Watching mongo database...');
        process.on('SIGINT', function () {
            console.log('Stopping mongo database...');
            execSync(mongoCommand + '--shutdown')
        });
    });

    grunt.registerTask('run', [
        'shell:mongoStart',
        'watch-mongo',
        'nodemon',
        'shell:mongoStop'
    ]);

    grunt.registerTask('test', [
        'shell:mongoStart',
        'watch-mongo',
        'shell:jasmine',
        'shell:mongoStop'
    ]);


    grunt.registerTask('default', [
        'jshint',
        'test'
    ]);
};