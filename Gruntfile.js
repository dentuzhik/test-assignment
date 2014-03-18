'use strict';

module.exports = function(grunt) {
  // Loading all the grunt tasks, specified in package.json file
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    config: {
      paths: {
        app: 'app',
        dist: 'dist'
      },
      connect: {
        hostname: 'localhost',
        port: 9000,
        base: 'app'
      }
    },

    connect: {
      server: {
        options: {
          hostname: '<%= config.connect.hostname %>',
          port: '<%= config.connect.port %>',
          base: '<%= config.connect.base %>',
          debug: true,
          livereload: true
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: '<%= config.paths.app %>/*.html'
      },
      scripts: {
        files: '<%= config.paths.app %>/scripts/**/*.js',
        tasks: [],
      },
      styles: {
        files: '<%= config.paths.app %>/styles/**/*.css',
        tasks: []
      }
    },

    open: {
      dev: {
        path: 'http://<%= config.connect.hostname %>:<%= config.connect.port %>'
      }
    }
  });

  grunt.registerTask('dev', [
    'connect',
    'open',
    'watch',
  ])

  grunt.registerTask('default', [
  ]);
};