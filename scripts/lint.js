
const gulp = require('gulp');
const path = require('path');
const paths = require('./paths');
const yamlValidate = require('gulp-yaml-validate');

export const tokensYml = () => gulp
    .src(path.resolve(paths.designTokens, '*.yml'))
    .pipe(yamlValidate())

