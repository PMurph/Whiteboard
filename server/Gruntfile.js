'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var serverSourceFiles = [
        'src/**/*.js',
    ];

    var serverTestFiles = [
        'tests/*Spec.js'
    ];

    grunt.initConfig({
        watch: {
        },
        jshint: {
            options: {
                jshintrc: '../.jshintrc'
            },
            src: serverSourceFiles.concat(serverTestFiles)
        },
        jasmine_node: {
            options: {
                match: '.',
                specNameMatcher: 'Spec'
            },
            all: ['tests/']
        },
        nodemon: {
            all: {
                script: 'src/main.js',
                cwd: __dirname + '/src/',
                watch: serverSourceFiles
            }
        }
    });

    grunt.registerTask('run', [
        'nodemon'
    ]);

    grunt.registerTask('test', [
        'jasmine_node'
    ]);


    grunt.registerTask('default', [
        'jshint',
        'test'
    ]);
};
