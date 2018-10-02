# How to contribute

## General Rules and Agreements

### Refactor and improve code as you work

It is okay to include small unrelated changes in your branch that improve code quality. We allow this to avoid creating issues/tasks that would take longer to describe than to fix.

Examples of changes that fit this rule:

- Improving a non-descriptive variable's name
- Moving hardcoded values into constants
- General reorganization of code
- Adding comments to describe a piece of code that is hard to understand
- Adding missing typing
- Adding a missing test that involves code that you are touching

### Document your public functions

Use [JSDoc](http://usejsdoc.org/) comments for public methods. _(Note: Since we use a type-system defining paremeter types is redundant, so avoid doing that)_

### Writing good comments

In general, make sure to add information where **the code itself is not enough.**

Some guidelines:

- If you cannot simplify a piece of code and it is too hard to understand, add comments.
- Make sure not to add redundant comments explaining something that is self-evident
- Write comments to help other developers avoid common pitfalls
- If you know of an issue that exists regarding a piece of code you are commenting, add the link to give context
- Write comments to explain why something uncommon/unexpected is necessary
- If a piece of code needs to be fixed, comment it with `FIXME @YourGitUsername: what has to be fixed`
- If something needs to be done in the code: `TODO @YourGitUsername: What has to be done`

Examples of a bad, unnecessary comments:

```js
// Sum a and b
c = a + b;

// Start transaction
dispatch(startTransaction());

// Fix this! It doesn't work
foo(bar());
```

Good comments:

Comment that explains an unexpected thing that we are having to do:

```js
// (Short text that describes this whole chunk of code)
// Mutates the matrix by removing all invalid entries from it
for (let x = 0; x < bar.length; x++) {
  for (let y = 0; y < bar.length; y++) {
    ... block of code that requires reader to run it in their head
  }
}

// (Comment that explains an unexpected thing that we are having to do)
// We need to do this for IE7 since it doesn't support FOO
if (browser === 'ie7') {
  doWeirdHackyFix();
}
```

## Commits

We enforce the use of [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) as our committing convention.

**Commit structure:**

```
<type>(<scope>): <subject>
// blank line
<body> // optional
// blank line
<footer> // optional
```

**Rules:**

- Commit often, try to keep commits meaningful (or squash before submitting a PR)
- Avoid committing with `commit -m`, this encourages quick, non-descriptive commit messages and is incompatible with _Conventional Commits_ if your commit requires a `body`
- Add a `body` to the commit **if the commit's subject is not descriptive enough**
- Add a `BREAKING CHANGE: <what's the change>` in the footer of a commit that makes
  a breaking change of the API of a package
- Add a `CLOSES: #<number>` in the footer of a commit to close an issue
  this commit solves.
- Commit messages must be written in imperative tense
- The `scope` defines what package is affected by a commit (enforced by [config-lerna-scopes](https://www.npmjs.com/package/@commitlint/config-lerna-scopes))
- For changes not associated to a package, scope can be omitted

Relevant types that define changes in [semver](https://semver.org/) versioning are:

- `fix`: Bumps patch version. Use when the commit represents a bugfix
- `feat`: Bumps minor version. Use when the commit adds a new feature

Other types which do not affect versioning are:

- `build`: Affects the build system or external dependencies.
- `chore`: Other changes that don't modify src or test files
- `ci`: Changes CI configuration files and scripts.
- `docs`: Adds or alters documentation.
- `perf`: Improves performance.
- `refactor`: Rewrites code without feature, performance or bug changes.
- `revert`: Reverts a previous commit.
- `style`: Improves formatting, white-space.
- `test`: Adds or modifies tests.

**Tools:**

- If you don't want to worry about formatting, you can run `yarn commit` to
  run a cli tool that will guide you through the committing process.

** Commit examples: **

Feature commit:

```
feature(issuer): show modal after transaction finishes

Dispatches an action that opens the modal when transactions finish

CLOSES: #123
```

Breaking change (bumps MAJOR version):

```
feat(offchain): migrate to proper rest endpoints

BREAKING CHANGE: Changes all endpoints to return HTTP status codes instead of
strings inside an object

CLOSES: #123, #456
```

Commit that doesn't need description, affects multiple packages

```
style: give a name to all default exported anonymous functions
```

Some refactor commit:

```
refactor(ui): cleanup actions in modal
```

## Branches and Pull Requests

All your contributed code must live in a separate branch before getting merged to the main `develop` branch.

Steps:

- In most cases, you will checkout from `develop` and create a branch
- Once you're happy with your code, submit a pull request from your branch
  to `develop`
- If your PR is out of date, rebase it and update your branch

Rules:

- Rewriting history and therefore force-pushing is **only allowed in personal branches**.
- No commit reaches `develop` if it hasn't been reviewed by at least `1` other
  developer.
- No commit reaches `master` except through a PR from `develop` to `master`. _(Note: We might want to ask for more than one approval for this PR since they deploy to production)_
- You can only branch out from `develop` or an epic branch (e.g: `migration-to-2.0`)
- PRs that break unit tests will be rejected

Good practices:

- Describe your PRs with what they do, this helps reviewers know what to focus
  on when looking at your code
- Squashing your branch's history into meaninful commits is highly appreciated
- If your PR involves other issues / discussions link the in the description (unless they are already linked in a commit's footer)

## Reviewing Pull Requests

Developers in the team should develop a habit of reviewing PRs, this helps
being informed about other areas of the repository and allows your teammates
to steadily merge their branches.

Be sure to read the PRs description, ask for more information if you need it

**Reasons to reject a Pull Request:**

- Bad code style: Code doesn't match our agreed coding style _(NOTE: this should rarely happen since our code-formatter and linter will catch most of these)_
- Testing: Code that doesn't follow [our testing rules](# Testing)

## Testing

Given our current plans to migrate different parts of the code, we cannot afford
testing code that is likely to change.

Our main rule is: If you introduce **new code that is not going to change in the short/medium term**, test it. This will ensure that we stay sustainable as we build our apps and packages.

The long term goal is to reach a high level of code coverage to which we can
commit, we'll get there soon.
