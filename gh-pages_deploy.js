const ghPages = require('gh-pages');

ghPages.publish(
  'public', {
    branch: 'master',
    repo: 'https://github.com/varundey/varudey.github.io.git',
  }, _ => console.log('Deploy Complete!')
);
