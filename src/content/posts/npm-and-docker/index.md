---
title: Using private NPM packages with Docker on CI
publish: true
excerpt: How a simple npm script failed to run on Docker and what we learned from it 
tags: javascript, front-end, docker, npm
date: '2020-05-25'
---
Our team recently came across a strange issue where one of our application was failing to build after we installed another internal library as a dependency to this app. This was very strange as we were able to get it working on our local machines and the only thing separating the two environments is Docker, which is basically is just a barebone linux container following a set of commands and returning the output build. But the world does not always work as we intend and here we were trying to figure out what was wrong. This post-mortem post details about the issue and what we did to solve it.


## Setting up the context
Recently we built an internal JavaScript library which was supposed to power hundreds of other internal applications at Grofers. After building v0.0.1 of this library, we were excited to release it as beta to one of our candidate application. Since we did not intend to publish this library to public just yet and since we were using npm for building our JavaScript apps, we decided to use github for tagging and creating releases. We would then add it as a dependency in package.json of application.

> You can install a npm github package by referencing shorthand `author/repo` in package dependencies.
> ```json
"dependencies": {
  "react": "facebook/react#v16.13.1"
}
```
> This example will _try to_ install react version 16.13.1 from [their releases](https://github.com/facebook/react/releases/tag/v16.13.1). As to why it fails, we will get to that in a bit. You can read more about how npm dependencies work at [npm docs](https://docs.npmjs.com/files/package.json#dependencies)

## Library's `package.json` structure
But since we were not publishing our library to npm just yet, we changed it's `package.json` to build while the client does `npm install`. The library's package.json looked something like this
```json
{
  ...
  "files": [
    "dist/*"
  ],
  "main": "dist/index.js",
  "scripts": {
    "prepare": "npm run build"
  }
  ...
}
```
Let's look at what it means:
- `files`: Add the value as entries of the package. In this case, all the files inside `dist` folder
- `main`: The main entrypoint for the package. In this case, `dist/index.js`
- `prepare`: A script invoked by npm which runs before the package is packed, published or issued an `npm install`

> There are several other npm scripts like this `preinstall`, `postInstall`, `prepublish` to name just a few. The reason why React could not be installed from the tag was because it tried to run a script after install as defined in it's [postInstall script](https://github.com/facebook/react/blob/v16.13.1/package.json#L108). Since this postInstall has separate dependencies which you might not have in your local setup, the install throws error. You can read more about them at [npm docs](https://docs.npmjs.com/misc/scripts#description)

## Installing the dependencies
Now we add the library to `package.json` of the client application and run the magical command `npm install`. Following things happen after issuing this command:

1. npm looks at the `package.json` of the library and finds a `prepare` script
2. It runs the `prepare` script of library which is `npm run build`. So it starts building the library
3. It puts the output file of the build i.e. `dist/` into `node_modules` of application

The directory structure will look something like this:
```
Local Machine

application
│-package.json
│-package_lock.json
└─node_modules
  └─library
    │-package.json
    └─dist
      |─ index.js
      |─ <other_source_files>
```

So far so good. We tested our library with the application in our local machines and it all looked ready to 🚢. Our testing environment sits behind a Docker container which consumes the changes, builds the app and serves it over Nginx.

## What the Dock?
After pushing this integration to our CI, we started noticing that the app's builds were failing after introducing our library as a dependency to the app which was weird. Since the only thing sitting between the app and the version control was Docker, we started dissecting it. We realised that dist of library inside Docker's node_modules was empty

```
Docker container

application
│-package.json
│-package_lock.json
└─node_modules
  └─library
    │-package.json
    └─ <no dist?!?>
```
And this was the reason the app could not find the reference to our library and hence it was failing at build.

Two things were happening here

1. The clichéd "It works on ~~my~~ our machine!"
2. The library was **actually** getting installed on Docker (since the folder was present) but the `dist/` folder not showing up!


## Come `unsafe-perm`
Since we could narrow it down to the `dist/` folder not visible, the next obvious assumption was that the build was not running on Docker.
After several hours of head scratching and brainstorming we came across [`unsafe-perm`](https://docs.npmjs.com/misc/config#unsafe-perm). `unsafe-perm` is one of another npm's weird script which tries to stop the switching of user and group id while running npm scripts. It is set to `true` when running as non-root user and `false` when running as root. This is probably done so that a package, while installing it's dependency does not switch between machine's users and groups role and end up running the code as root user which might be vulnerable and hence "unsafe". Since Docker container runs in `sudo` mode by default, the `unsafe-perm` is false by default. Because of this, application was able to fetch our library but the `prepare` script silently failed to install it.

## The solution
The temporary solution for us was to set the `unsafe-perm` to `true`.
```shell
npm config set unsafe-perm true
```

But ideally the best way is to switch to a non-root user role and then run `npm install` since that way, the outcome will be predictable and would be mimicking your local setup. Each CI service would have it's own way of setting the user but Docker does not provide this out of the box. If you are doing something similar, it would be worthwhile to figure out a way to switch user or if that does not work, you can set `unsafe-perm` in your CI.