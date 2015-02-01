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

    var mongoCommand = "mongod --dbpath db_data/ --logpath db_data/log.txt --smallfiles ";

    grunt.initConfig({
        jasmine_runner: {
            unit: 'tests/unit/**/*Spec.js',
            all: serverTestFiles
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
            mongoInstallWin: {
                command: mongoCommand + '--install',
                options: {
                    failOnError: false
                }
            },
            mongoStartWin: {
                command: 'net start MongoDB',
                options: {
                    failOnError: false
                }
            },
            mongoStopWin: {
                command: 'net stop MongoDB',
                options: {
                    failOnError: false
                }
            },
            jasmineRunnerUnit: {
                command: 'node tests/jasmineRunner unit',
            }
        }
    });

    grunt.registerTask('watch-mongo', function () {
        var shelljs = require('shelljs');
     
        console.log('Watching mongo database...');
        process.on('SIGINT', function () {
            console.log('Stopping mongo database...');
            shelljs.exec(mongoCommand + '--shutdown')
        });
    });

    grunt.registerTask('run', "Node.JS and MongoDB starter", function(){
        if (process.platform === "win32" || process.platform === "win64"){
            grunt.task.run([
                'shell:mongoInstallWin',
                'shell:mongoStartWin',
                'watch-mongo',
                'nodemon',
                'shell:mongoStopWin'
           ]);
        }else{
            grunt.task.run([
                'shell:mongoStart',
                'watch-mongo',
                'nodemon',
                'shell:mongoStop'
            ]);

        }

    });

    grunt.registerTask('test-all', "Jasmine Test Runner (with MongoDB)", function() {
        if (process.platform === "win32" || process.platform === "win64"){
            grunt.task.run([
                'shell:mongoInstallWin',
                'shell:mongoStartWin',
                'watch-mongo',
                'shell:jasmine:all',
                'shell:mongoStopWin'
            ]);
        }else{
            grunt.task.run([
                'shell:mongoStart',
                'watch-mongo',
                'jasmine_runner:all',
                'shell:mongoStop'
           ]);
        }
    });

    grunt.registerTask('test',[
                'shell:jasmineRunnerUnit'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test'
    ]);
};
