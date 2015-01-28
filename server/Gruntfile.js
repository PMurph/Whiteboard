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
            jasmineWin: {
                command: 'jasmine'
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
            process.env.JASMINE_CONFIG_PATH="jasmine.json";
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

    grunt.registerTask('test', "Jasmine Test Runner (with MongoDB)", function() {
        if (process.platform === "win32" || process.platform === "win64"){
            process.env.JASMINE_CONFIG_PATH="jasmine.json";
            grunt.task.run([
                'shell:mongoInstallWin',
                'shell:mongoStartWin',
                'watch-mongo',
                'shell:jasmineWin',
                'shell:mongoStopWin'
            ]);
        }else{
            grunt.task.run([
                'shell:mongoStart',
                'watch-mongo',
                'shell:jasmine',
                'shell:mongoStop'
           ]);
        }
    });


    grunt.registerTask('default', [
        'jshint',
        'test'
    ]);
};
