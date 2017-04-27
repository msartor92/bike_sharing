module.exports = function (grunt) {
    const configuration = require('./configuration.json');

    //load support modules
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    
    //load configuration
    grunt.initConfig(configuration);

    grunt.registerTask ('build', function () {
        grunt.task.run('concat');
        grunt.task.run('uglify');
        grunt.task.run('copy');
        grunt.task.run('cssmin');

        grunt.log.ok("toBike build completed!");
    });

    grunt.registerTask('help', function () {
        grunt.log.ok("To use front-end, run grunt build which create contat and minified files");
    });
};