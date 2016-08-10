module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: [
					'script/libs/jquery.2.1.4.js',
					'script/libs/moment.js', 
					'script/libs/jquery.validate.js', 
					'script/libs/additional-methods.js', 
					'script/libs/*.js',
					'script/bootstrap/tooltip.js',
					'script/bootstrap/*.js'
				],

				dest: 'script/libs.min.js'
			}
		},
		compass: {
			config: 'config',
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['uglify']);
}