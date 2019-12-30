const ghPages = require('gh-pages');

ghPages.publish(
  'public', {
    branch: 'master',
    repo: 'https://github.com/varundey/varundey.github.io.git',
  }, _ => console.log('Deploy Complete!')
);
