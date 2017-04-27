module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    grunt.initConfig({
        concat: {
            dist: {
            src: ['./webapp/js/main.js', './webapp/js/services.js', './webapp/js/controllers.js'],
            dest: './public/js/common.js',
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    "./public/js/common.js": ["./public/js/common.js"]
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, filter: 'isFile', cwd: './webapp', dest: './public', src: ['index.html']},
                    {expand: true, filter: 'isFile', cwd: './webapp', dest: './public', src: ['css/main.css']},
                    {expand: true, filter: 'isFile', cwd: './webapp/css/glyphicons/png', dest: './public/media', src: [
                        'glyphicons-307-bicycle.png', 
                        'glyphicons-650-bike-park.png',
                        'glyphicons-200-ban-circle.png',
                        'glyphicons-503-map.png'
                        ]
                    }
                ]
            },
        }
    });

    grunt.registerTask ('build', function () {
        grunt.task.run('concat');
        grunt.task.run('uglify');
        grunt.task.run('copy');
    });

    grunt.registerTask('help', function () {
        console.log("Ask to developer");
    });
};