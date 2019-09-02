# vs-codeowners

> A [VSCode](https://code.visualstudio.com/) [extension](https://marketplace.visualstudio.com/items?itemName=dtangren.vs-codeowners) for making use of [GitHub CODEOWNERS](https://help.github.com/en/articles/about-code-owners) in your editor

## Features

* Syntax highlighting for `CODEOWNERS` files

![syntax highlighting](syntax.png)

* See the `CODEOWNER` of current file in status bar

![status bar](statusbar.png)

* Jump to `CODEOWNERS` file

You can click the status bar item to jump right into the `CODEOWNERS` file


## Requirements

1) Install [`git-codeowners`](https://github.com/softprops/git-codeowners) first

Git Codeowners is a command line tool for interactive with GitHub `CODEOWNERS` files.
It can easily be installed using homebrew.

```sh
$ brew tap softprops/tools
$ brew install git-codeowners
```

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

### 0.0.1

Initial MVP release