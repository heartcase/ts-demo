# Ts Demo

## Packages

### Bundle

- webpack
- webpack-cli
- babel-loader

### Developing Environment

- webpack-dev-server
- @storybook/react

### Javascript

- eslint
- prettier

### CSS Preprocessor

- node-sass

### Compiler

- @babel/core
- @babel/cli
- @babel/preset-env

### Type

- typescript
- @types/react
- @types/react-dom

### Testing

- jest
- enzyme
- enzyme-adapter-react-16

### Git

- husky

### Tools

- webpack-merge

## Settings

### Webpack

- Add npm scripts

```
"scripts": {
    "start": "webpack-dev-server --open --env.NODE_ENV=development",
    "build": "webpack --env.NODE_ENV=production"
},
```

- Disambiguate configs between different environments

```
const getEnvConfig = env => {
  switch (env) {
    case "production":
      return require("./configs/webpage.prod.config");
    case "development":
      return require("./configs/webpage.dev.config");
    default:
      return require("./configs/webpage.prod.config");
  }
};

merge(commonConfig, envConfig);
```

- DevServer

> webpack-dev-server doesn't write any output files after compiling.
> Instead, it keeps bundle files in memory and serves them as if they
> were real files mounted at the server's root path.
