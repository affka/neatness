module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['browserify', 'uglify', 'watch']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			bundleOptions: {
				standalone: 'window'
			},
			main: {
				src: 'index.js',
				dest: 'Joints.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			index: {
				files: {
					'Joints.min.js': ['Joints.js']
				}
			}
		},
		watch: {
			files: [
				'src/*',
				'index.js'
			],
			tasks: ['default']
		}
	});
}