/**
 * Created by okagour on 02-08-2016.
 */
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["dist", '.tmp'],
        delta: {
            options: {
                livereload: true
            }
        },
        copy: {
            js: {
                files: [{
                    src : ['**/*.js'],
                    dest : 'dist'
                }]
            },
            css: {
                files: [{
                    src : ['**/*.css'],
                    dest : 'dist'
                }]
            }
        },
        /*  livereload  : {
         options   : {
         base    : 'dist'
         },
         files     : ['public/!**!/!*']
         },*/

        connect: {
            options: {
                port: 9000,
                hostname: "192.168.99.99",
                livereload: 35729
            },
            // No need for keepalive anymore as watch will keep Grunt running
            //keepalive: true,

            // Livereload needs connect to insert a cJavascript snippet
            // in the pages it serves. This requires using a custom connect middleware

            livereload: {
                options: {
                    open: true,
                    base: ['dist'],

                    middleware: function (connect, options) {
                        // Load the middleware provided by the livereload plugin
                        // that will take care of inserting the snippet

                        // Serve the project folder
                        var require=  require('grunt-contrib-livereload/lib/utils').livereloadSnippet

                            return [
                                require,
                            connect.static(require['path'].resolve('dist'))
                        ];
                    }
                }
            }
        }
    /*
        // grunt-open will open your browser at the project's URL
        open: {
            all: {
                // Gets the port from the connect configuration
                path: 'http://localhost:<%= connect.all.options.port%>'
            }
        },

        // grunt-regarde monitors the files and triggers livereload
        // Surprisingly, livereload complains when you try to use grunt-contrib-watch instead of grunt-regarde
        regarde: {
            all: {
                // This'll just watch the index.html file, you could add **!/!*.js or **!/!*.css
                // to watch Javascript and CSS files too.
                files:['index.html'],
                // This configures the task that will run when the file change
                tasks: ['livereload']
            }
        }*/
    });

    // Creates the `server` task
 /*  grunt.registerTask('server',[

        // Starts the livereload server to which the browser will connect to
        // get notified of when it needs to reload
        'livereload',
        'watch'
        // Connect is no longer blocking other tasks, so it makes more sense to open the browser after the server starts

    ]);*/


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // grunt.loadNpmTasks('grunt-express');
    //grunt.registerTask('server',['express','watch']);
    grunt.loadNpmTasks('grunt-livereload');



    // Tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [
        'watch','livereload'
    ]);
    grunt.registerTask('build',['copy:js','copy:css']);
    grunt.renameTask('watch','delta');

    grunt.registerTask('watch', [
        'build',"connect:livereload",'delta'
    ])
};