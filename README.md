# Micro.blog Publish for Obsidian

[Micro.blog](https://micro.blog/) Publish for [Obsidian](https://obsidian.md/) is a community maintained plugin to publish notes to a Micro.blog blog.

## Installing

This plugin will be available via *Community Plugins* soon.

## Screenshots

### Preferences

In preferences it's possible to set the application token, required to post on Micro.blog, default tags, and default post visibility.

![](images/preferences.png)

### Command

Publishing can be triggered using Obsidian's command palette.

![](images/command.png)

### Publish

Before publishing, it's possible to add a title to the post and override the post visiblity.

![](images/publish.png)

## Building from source

Clone this repository inside the Obsidian Vault:

```
$ cd .obsidian/plugins/
$ git clone https://github.com/otaviocc/obsidian-microblog
```

Resolve the plugin dependencies and build it:

```
$ cd obsidian-microblog
$ npm i
$ npm run build
```

Restart Obsidian and enable the plugin from *Community Plugins* in Preferences.

## Contributing

1. Fork this repository and follow the steps from the previous section using the forked repository instead
2. Create a feature branch for the changes
3. Commit the changes and push them to the forked repository 
4. Submit a pull request

## Disclaimer

This project neither affiliated with Micro.blog nor Obsidian. This is a community maintained plugin.