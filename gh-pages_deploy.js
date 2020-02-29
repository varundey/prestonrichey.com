const ghPages = require('gh-pages');

ghPages.publish(
  'public', {
    user: {
      name: 'Varun Dey',
      email: 'varundey20@gmail.com'
    },
    branch: 'master',
    message: 'Deploy commit from gh-pages',
  }, (success, error) => console.log(success, error)
);