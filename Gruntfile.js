module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngtemplates: {
            mobileClone: {
                src: '**/partials/**.html',
                dest: 'templates.js'
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['src/**/*.js', '<%= ngtemplates.mobileClone.dest %>'],
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
                    'dist/css/<%= pkg.name %>-standalone.css': ['vendor/project-tyson/css/style.css'],
                    'dist/css/<%= pkg.name %>-with-bootstrap.css': ['vendor/project-tyson/css/style.css', 'vendor/css/bootstrap.css']
                }
            }
        },
        copy: {
            resources: {
                src: ['vendor/project-tyson/img/*'],
                dest: 'dist/img/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            cordova: {
                src: ['dist/**', 'bower_components/**', 'demo/js/**'],
                dest: 'cordova/www/'
            }
        }
    });
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['ngtemplates', 'concat', 'uglify', 'cssmin', 'copy:resources', 'copy:cordova']);
}