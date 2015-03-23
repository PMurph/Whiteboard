'use strict';

module.exports = function (grunt) {
    // load all grunt tasks using matchdep npm module
    require('matchdep').filterDev('grunt-contrib-*').forEach(grunt.loadNpmTasks);

    var clientSourceFiles =  [
        'app/scripts/**/*.js',
        '!app/scripts/vendor/*',
    ];

    var clientTestFiles = [
        'tests/**/*Spec.js',
    ];

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 8000
                }
            }
        },
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
            terminal: {
                src: clientSourceFiles,
                keepRunner: true,
                options: {
                    specs: clientTestFiles,
                    vendor: ['./node_modules/jasmine-ajax/lib/mock-ajax.js'],
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: 'app/scripts/config.js',
                        requireConfig: {
                            baseUrl: 'app/scripts',
                            paths: {
                                tests: '../../tests/',
                                squirejs: '../../node_modules/squirejs/src/'
                            }
                        }
                    }
                }
            },
            debug_host: {
                src: clientSourceFiles,
                keepRunner: true,
                options: {
                    host: "127.0.0.1:8000",
                    specs: clientTestFiles,
                    vendor: ['./node_modules/jasmine-ajax/lib/mock-ajax.js'],
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: 'app/scripts/config.js',
                        requireConfig: {
                            baseUrl: 'app/scripts',
                            paths: {
                                tests: '../../tests/',
                                squirejs: '../../node_modules/squirejs/src/'
                            }
                        }
                    }
                }
            }
        },
    });

    grunt.registerTask('test', [
        'jasmine:terminal'
    ]);

    grunt.registerTask('test-debug', [
        'connect',
        'jasmine:debug_host'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
    ]);
};
