module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-text-replace');

	grunt.registerTask('default', ['browserify', 'replace', 'uglify', 'watch']);

	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg: pkg,
		browserify: {
			bundleOptions: {
				standalone: 'window'
			},
			main: {
				src: 'index.js',
				dest: 'Neatness.js'
			}
		},
		replace: {
			index: {
				src: ['Neatness.js'],
				overwrite: true,
				replacements: [{
					from: '%JOINTS_CURRENT_VERSION%',
					to: pkg.version
				}]
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			index: {
				files: {
					'Neatness.min.js': ['Neatness.js']
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