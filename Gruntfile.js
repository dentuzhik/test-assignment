
module.exports = function(grunt) {
  'use strict';
  // Loading all the grunt tasks, specified in package.json file
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    config: {
      paths: {
        app: 'app',
        dest: 'dist'
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
        files: '<%= config.paths.app %>/scripts/**.js',
        tasks: [],
      },
      styles: {
        files: '<%= config.paths.app %>/styles/**.css',
        tasks: []
      }
    },

    open: {
      dev: {
        path: 'http://<%= config.connect.hostname %>:<%= config.connect.port %>'
      }
    },

    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      src: [
        'Gruntfile.js',
        '<%= config.paths.app %>/scripts/**.js'
      ]
    },

    clean: {
      dest: {
        src: [
          '.tmp',
          '<%= config.paths.dest %>'
        ]
      }
    },

    useminPrepare: {
      options: {
        dest: '<%= config.paths.dest %>'
      },
      html: {
        src: ['<%= config.paths.app %>/index.html'],
      }
    },

    copy: {
      dest: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= config.paths.app %>',
            dest: '<%= config.paths.dest %>',
            src: [
              '**.html'
            ]
        }]
      }
    },

    rev: {
        dist: {
            files: {
                src: [
                    '<%= config.paths.dest %>/scripts/{,*/}*.js',
                    '<%= config.paths.dest %>/styles/{,*/}*.css'
                ]
            }
        }
    },

    usemin: {
      css: '<%= config.paths.dest %>/styles/**.css',
      html: '<%= config.paths.dest %>/index.html'
    },

    htmlmin: {
        dest: {
          options: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeCommentsFromCDATA: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            useShortDoctype: true
          },
          files: [{
            expand: true,
            cwd: '<%= config.paths.dest %>',
            src: '{,*/}*.html',
            dest: '<%= config.paths.dest %>'
          }]
        }
    },

    'gh-pages': {
      options: {
        base: 'dist',
        message: 'Deploy to gh-pages branch from master',
        user: {
          name: 'Denis Tuzhik',
          email: 'dentuzhik@gmail.com'
        }
      },
      src: ['**']
    }
  });

  grunt.registerTask('dev', [
    'connect',
    'open',
    'watch',
  ]);

  grunt.registerTask('test', [
    'jshint'
  ]);

  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'copy',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);

  grunt.registerTask('deploy', [
    'test',
    'build',
    'gh-pages'
  ]);
};