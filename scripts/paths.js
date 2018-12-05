const path = require('path');

const root = path.resolve(__dirname, '../');
const rootPath = path.resolve.bind(path, root);

const node_modules = rootPath('node_modules');

module.exports = {
    rootPath,
    node_modules,
    designTokens: rootPath('src/themes'),
    dist: rootPath('dist')
};
