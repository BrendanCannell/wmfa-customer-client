let create = path =>
  require('indexr')(__dirname, {
    modules: path,
    submodules: '*.js',
    outputFilename: 'index.js',
    submodulesIgnore: 'index.js',
    namedExports: true,
    exts: ['js']
  });

create('../epics')
.then(() => create('../reducers'))
.then(() => create('../actions'))
.then(() => create('../util'))
