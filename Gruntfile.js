module.exports = function (grunt) {

    var libpath = require('path');

    grunt.initConfig({
        clean: {
            dist: 'dist/',
            lib : 'lib/',
            tmp : 'tmp/'
        },

        copy: {
            tmp: {
                expand : true,
                flatten: true,
                src    : 'tmp/src/*.js',
                dest   : 'lib/'
            }
        },

        concat: {
            dist_with_locales: {
                src: ['dist/dust-intl.js', 'dist/locale-data/*.js'],
                dest: 'dist/dust-intl-with-locales.js'
            }
        },

        jshint: {
            all: ['index.js', 'src/*.js', '!src/en.js', 'tests/*.js']
        },

        extract_cldr_data: {
            options: {
                fields : ['second', 'minute', 'hour', 'day', 'month', 'year'],
                plurals: true
            },

            src_en: {
                dest: 'src/en.js',

                options: {
                    locales: ['en'],
                    prelude: '// GENERATED FILE\n',

                    wrapEntry: function (entry) {
                        return 'export default ' + entry + ';';
                    }
                }
            },

            lib_all: {
                dest: 'lib/locales.js',

                options: {
                    prelude: [
                        '// GENERATED FILE',
                        'var DustIntl = require("./helpers");\n\n'
                    ].join('\n'),

                    wrapEntry: function (entry) {
                        return 'DustIntl.__addLocaleData(' + entry + ');';
                    }
                }
            },

            dist_all: {
                dest: 'dist/locale-data/',

                options: {
                    wrapEntry: function (entry) {
                        return 'DustIntl.__addLocaleData(' + entry + ');';
                    }
                }
            }
        },

        bundle_jsnext: {
            dest: 'dist/dust-intl.js',

            options: {
                namespace: 'DustIntl'
            }
        },

        cjs_jsnext: {
            dest: 'tmp/'
        },

        uglify: {
            options: {
                preserveComments: 'some',
            },

            dist: {
                options: {
                    sourceMap              : true,
                    sourceMapIn            : 'dist/dust-intl.js.map',
                    sourceMapIncludeSources: true
                },

                files: {
                    'dist/dust-intl.min.js': [
                        'dist/dust-intl.js'
                    ]
                }
            },

            dist_with_locales: {
                files: {
                    'dist/dust-intl-with-locales.min.js': [
                        'dist/dust-intl-with-locales.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bundle-jsnext-lib');
    grunt.loadNpmTasks('grunt-extract-cldr-data');

    grunt.registerTask('cldr', ['extract_cldr_data']);

    grunt.registerTask('compile', [
        'jshint',
        'bundle_jsnext',
        'concat:dist_with_locales',
        'uglify',
        'cjs_jsnext',
        'copy:tmp'
    ]);

    grunt.registerTask('default', [
        'clean',
        'cldr',
        'compile'
    ]);
};
