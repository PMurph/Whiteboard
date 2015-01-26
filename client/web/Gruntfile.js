'use strict';

module.exports = function (grunt) {
    // load all grunt tasks using matchdep npm module
    require('matchdep').filterDev('grunt-contrib-*').forEach(grunt.loadNpmTasks);

    var clientSourceFiles =  [
        'app/scripts/**/*.js',
        '!app/scripts/vendor/*',
    ];

    var clientTestFiles = [
        'tests/*Spec.js',
    ];

    grunt.initConfig({
        watch: {
            files: clientSourceFiles,
            tasks: ['jshint']
        },
        jshint: {
            options: {
                jshintrc: '../../.jshintrc'
            },
            src: clientSourceFiles.concat(clientTestFiles)
        },
        jasmine: {
            all: {
                src: clientSourceFiles,
                keepRunner: true,
                options: {
                    specs: clientTestFiles,
                    vendor: ['./node_modules/jasmine-ajax/lib/mock-ajax.js'],
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: 'app/scripts/config.js',
                        requireConfig: {
                            baseUrl: 'app/scripts'
                        }
                    }
                }
            }
        },
    });

    grunt.registerTask('test', [
        'jasmine'
    ]);


    grunt.registerTask('default', [
        'jshint',
        'test',
    ]);
};
