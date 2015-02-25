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
                options: {
                    failOnError: false
                }
            },
            jasmineRunnerInteg: {
                command: 'node tests/jasmineRunner integ',
                options: {
                    failOnError: false
                }
            },
            jasmineRunnerAll: {
                command: 'node tests/jasmineRunner unit integ',
                options: {
                    failOnError: false
                }
            },
            nodeDebug: {
                command: 'node-debug src/main.js',
                options: {
                    failOnError: false
                }
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

    function startMongo(taskList) {
        var fullTaskList = [];
        var mongoStart = [];
        var mongoStop = [];

        if (process.platform === "win32" || process.platform === "win64"){
            mongoStart = [
                'shell:mongoInstallWin',
                'shell:mongoStartWin',
                'watch-mongo'
           ];
            mongoStop = [
                'shell:mongoStopWin'
            ];
        }else{
            mongoStart = [
                'shell:mongoStart',
                'watch-mongo',
            ];

            mongoStop = [
                'shell:mongoStop'
            ];
        }

        fullTaskList = mongoStart.concat(taskList).concat(mongoStop);
        grunt.task.run(fullTaskList);
    }

    grunt.registerTask('run', "Node.JS and MongoDB starter", function(){
        startMongo(['nodemon']);
    });

    grunt.registerTask('debug-run', "Node.JS debugger and MongoDB starter", function(){
        startMongo(['shell:nodeDebug']);
    });

    grunt.registerTask('test-all', "Jasmine Test Runner (with MongoDB)", function() {
        startMongo(['shell:jasmineRunnerAll']);
    });

    grunt.registerTask('test-unit',[
        'shell:jasmineRunnerUnit'
    ]);
    
    grunt.registerTask('test-integ',[
        'shell:jasmineRunnerInteg'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test'
    ]);
};
