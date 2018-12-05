const async = require('async');
const gulp = require('gulp');
const gulpTheo = require('gulp-theo');
const gulpUtil = require('gulp-util');
const _ = require('lodash');
const path = require('path');
const through = require('through2');
const Vinyl = require('vinyl');

const paths = require('./paths');
const distPath = path.resolve.bind(path, paths.dist);

const transformValue = (value) => {
    return value + '***'
};

// Some transforms are commented out because the use cases are lacking
let formatTransforms = _({
    web: [
        'html',
        'default.scss',
        'map.scss',
        'json',
        'module.js'
    ]
})
    .map((formats, transform) =>
        formats.map((name) => ({
            name: name,
            transform: transform
        }))
    )
    .flatten()
    .value();

export const all = (done) => {
    const convert = ({ name, transform }, done) => {
        gulp.src(path.resolve(paths.designTokens, '*.yml'))
            .pipe(
                gulpTheo.plugin({
                    transform: {
                        type: transform,
                    },
                    format: {
                        type: name,
                        options: {
                            transformValue
                        }
                    },
                })
            )
            .pipe(gulp.dest(path.resolve(paths.dist, 'design-tokens')))
            .on('finish', done);
    };

    async.each(formatTransforms, convert, done);
};

export const sassDefault = () =>
    gulp
        .src(path.resolve(paths.designTokens, '*.yml'))
        .pipe(
            gulpTheo.plugin({
                transform: { type: 'web' },
                format: { type: 'default.scss' }
            })
        )
        .pipe(gulp.dest(path.resolve(paths.dist, 'design-tokens')))

export const sassMap = () =>
    gulp
        .src(path.resolve(paths.designTokens, '*.yml'))
        .pipe(
            gulpTheo.plugin({
                transform: { type: 'web' },
                format: { type: 'map.scss' }
            })
        )
        .pipe(gulp.dest(path.resolve(paths.dist, 'design-tokens')))

export const componentsImports = () =>
    gulp
        .src(path.resolve(paths.ui, 'components/**/tokens/**/*.yml'))
        .pipe(gulpUtil.buffer())
        .pipe(
            through.obj((files, enc, next) => {
                const filepaths = files.map((file) => file.path).sort();
                const componentTokenImports = filepaths.reduce(
                    (prev, filepath) =>
                        `${prev}\n- ${path.relative(paths.designTokens, filepath)}`,
                    '# File generated automatically, do not edit manually\nimports:'
                );
                const file = new Vinyl({
                    path: 'components.yml',
                    contents: Buffer.from(componentTokenImports)
                });
                next(null, file);
            })
        )
        .pipe(gulp.dest(paths.designTokens));

export const copyDesignTokens = () =>
    gulp
        .src('**/*.*', {
            base: `${paths.designTokens}`,
            cwd: `${paths.designTokens}`
        })
        .pipe(gulp.dest(distPath('design-tokens')));
