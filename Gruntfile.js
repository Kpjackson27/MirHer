'use strict';

module.exports = function(grunt){
	grunt.initConfig({
		env: {
			dev: {
				NODE_ENV: 'development'
			},
			test: {
				NODE_ENV: 'test'
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					ext: 'js,html',
					watch:['server.js', 'config/**/*.js', 'app/**/*.js']
				}
			}
		},
		jshint:{
			all:{
				src: ['server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/*.js', 'public/modules/**/*.js']
			},
			options: {
				node: true
			}
		},
		csslint:{
			all:{
				src: 'public/modules/**/*.css'
			}
		},
		watch:{
			js:{
				files: ['server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/*.js', 'public/modules/**/*.js'],
				tasks: ['jshint']
			},
			css: {
				files:'public/modules/**/*.css',
				tasks: ['csslint']
			}
		},
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options:{
					logConcurrentOutput: true
				}
			},
			debug:{
				tasks:['nodemon:debug', 'watch', 'node-inspector'],
				options:{
					logConcurrentOutput: true
				}
			}
		},
		'node-inspector': {
			debug: {}
		}
	});

	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-node-inspector');

	grunt.registerTask('default', ['env:dev', 'lint', 'concurrent:dev']);
	grunt.registerTask('debug', ['env:dev', 'lint', 'concurrent:debug']);
	grunt.registerTask('lint', ['jshint','csslint']);
};