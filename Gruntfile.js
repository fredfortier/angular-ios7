module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['src/**/*.js'],
                // the location of the resulting JS file
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'dist/<%= pkg.name %>-standalone.css': ['vendor/project-tyson/css/style.css'],
                    'dist/<%= pkg.name %>-with-bootstrap.css': ['vendor/project-tyson/css/style.css', 'vendor/css/bootstrap.css']
                }
            }
        },
        copy: {
            cordova: {
                src: ['dist/**', 'bower_components/**', 'demo/**'],
                dest: 'cordova/www/'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy:cordova']);
}