'use strict';

module.exports = function (grunt) {
    // load all grunt tasks using matchdep npm module
    require('matchdep').filterDev('grunt-contrib-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('grunt-bower-requirejs');

    var clientSourceFiles =  [
        'app/scripts/**/*.js',
        '!app/scripts/vendor/*',
    ];

    grunt.initConfig({
        watch: {
            files: clientSourceFiles,
            tasks: ['jshint']
        },
        bowerRequirejs: {
              all: {
                    rjsConfig: 'app/scripts/config.js'
                    }
        },
        jshint: {
            options: {
                jshintrc: '../../.jshintrc'
            },
            src: clientSourceFiles
        },
        jasmine: {
            all: {
                src: 'app/scripts/**/*.js',
                options: {
                    specs: 'tests/*Spec.js',
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
        'bowerRequirejs',
        'jshint',
        'test',
    ]);
};
