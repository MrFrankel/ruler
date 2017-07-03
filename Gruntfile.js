'use strict';

module.exports = function (grunt) {
  // Add require for connect-modewrite
  var modRewrite = require('connect-modrewrite');

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    app: './app',
    demo: './docs',

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= app %>/js/{,*/}*.js', '<%= demo %>/{,*/}*.js'],

        options: {
          livereload: true
        }
      },
      styles: {
        files: ['<%= app %>/css/{,*/}*.css'],
        options: {
          livereload: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= app %>/{,*/}*.html',
          '<%= app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729,
        base: ['./dist',
          '<%= app %>',
          '<%= demo %>']

      },
      livereload: {
        options: {
          open: 'http://localhost:<%= connect.options.port %>',
          base: [
            '.tmp',
            '<%= app %>',
            '<%= demo %>'
          ],
          // MODIFIED: Add this middleware configuration
          middleware: function (connect, options) {
            var middlewares = [];

            middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
            options.base.forEach(function (base) {
              middlewares.push(connect.static(base));
            });
            return middlewares;
          }
        }
      }

    },
    concat: {
      dist: {
        src: ['<%= app %>/js/**/*.js'],
        dest: 'dist/ruler.js'
      }
    },
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app %>/css/',
          src: ['*.css', '!*.min.css'],
          dest: 'dist',
          ext: '.min.css'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/ruler.min.js': ['dist/ruler.js']
        }
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['./dist/*'], dest: '<%= demo %>', filter: 'isFile'},
        ]
      }
    }
  });
  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('build', [
    'concat',
    'cssmin',
    'uglify',
    'copy'
  ]);

  // Register new tasks
  grunt.registerTask('serve', ['build', 'connect', 'watch']);
}
