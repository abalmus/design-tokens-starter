const gulp = require('gulp');
const del = require('del');
const path = require('path');

const tokens = require('./scripts/tokens');
const lint = require('./scripts/lint');
const paths = require('./scripts/paths');

/* Clean */
gulp.task('clean', () =>
  del([
    paths.dist,
    path.join(paths.designTokens, 'dist')
  ])
);

/* Design Tokens Generator */
gulp.task('lint:tokens:yml', lint.tokensYml);
gulp.task('generate:tokens:sass:default', tokens.sassDefault);
gulp.task('generate:tokens:all', tokens.all);
gulp.task('generate:tokens:sass:map', tokens.sassMap);
gulp.task('copy:tokens:dist', tokens.copyDesignTokens);

gulp.task(
    'generate:tokens:sass',
    gulp.parallel('generate:tokens:sass:default', 'generate:tokens:sass:map')
);

gulp.task('generate:tokens:components:imports', tokens.componentsImports);

// gulp.task(
//     'generate:tokens:all',
//     gulp.series('generate:tokens:components:imports', tokens.all)
// );

gulp.task('dist', gulp.series('copy:tokens:dist'));
gulp.task('build', gulp.series('clean', 'lint:tokens:yml', 'generate:tokens:all'));
