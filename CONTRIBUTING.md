# How to contribute

> Unblocked Agent is an open-source project built by core maintainers and contributors. We want to make it easy for anyone to participate. Contribute to core or improve documentation. It all helps SecretAgent on its mission to keep the web easily scriptable.

Read the [code of conduct](./code-of-conduct).

## Contributing to the Code

Unblocked Agent uses a **monorepo** pattern to manage its dependencies and core plugins. To contribute, you'll probably want to to setup the SecretAgent repository locally.

### Setting Up the Agent Repository

Install [Node.js 14](https://nodejs.org/en/download/) or higher and [Yarn](https://yarnpkg.com/lang/en/docs/install/).

1. Clone the `https://github.com/unblocked-web/agent.git` repository.

**Yarn** will add dependencies from your test projects to the root `yarn.lock` file. So you should not commit changes in that file unless you have added dependencies to any of the core packages. If you need to commit it, remove your projects from the `~/projects` folder temporary and run `yarn` in the root folder. Yarn will then clean up the lock file with only core dependencies. Commit the file and move your projects back and run `yarn` again to start developing.

## Contributing to the docs

We are a strong believer that documentation is very important for any open-source projects. Agent is intended to be primarily a low-level browser agent. We intend to add markdown documentation for the library, and would appreciate any help! However, we do not intend to make SecretAgent a product unto itself. Docs will go under the /docs folder.
