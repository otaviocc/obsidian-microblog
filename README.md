# Micro.publish

Micro.publish is a community-maintained plugin for [Obsidian](https://obsidian.md/) that allows you to publish notes to a [Micro.blog](https://micro.blog/) blog.

Does this plugin improve your workflow? If so, you can show your appreciation by buying me a coffee.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Z8Z0C9KPT)

This community-maintained plugin is not affiliated with Micro.blog or Obsidian.

## Installation

To install this plugin, open Obsidian and go to `Settings > Community Plugins > Browse`. Search for `Micro.publish` and click Install. Alternately, it can be installed [directly from Obsidian's website](https://obsidian.md/plugins?search=micro.publish).

<video controls="controls" src="https://otavio.cc/uploads/2023/1.install.mp4" width="600" height="400" poster="https://otavio.cc/uploads/2023/8058b9ae66.png"></video>

## Login

After installation, you need to log in to a Micro.blog account with an App Token. You can create an App Token on the [Micro.blog Account Page](https://micro.blog/account/apps).

<video controls="controls" src="https://otavio.cc/uploads/2023/2.login.mp4" width="600" height="400" poster="https://otavio.cc/uploads/2023/74c9f9592d.png"></video>

## Settings

Users with multiple blogs can set a default blog, default categories, and default post visibility (draft or public). These settings can be overridden before publishing a note to Micro.blog.

<video controls="controls" src="https://otavio.cc/uploads/2023/3.settings.mp4" width="600" height="400" poster="https://otavio.cc/uploads/2023/65bb41d998.png"></video>

## Publishing

The plugin has two commands that can be accessed through the Command Palette:

- **Post to Micro.blog** - This command publishes the selected note to Micro.blog.
- **Synchronize Categories** - This command fetches all the categories used in your blog from Micro.blog.

**Tip:** Micro.publish automatically fetches categories from Micro.blog whenever Obsidian is launched.

Before publishing a note to Micro.blog, Micro.publish opens a window that allows you to change the post title, tags, visibility, and data (for scheduling a post for a future date).

<video controls="controls" src="https://otavio.cc/uploads/2023/4.publishing.mp4" width="600" height="400" poster="https://otavio.cc/uploads/2023/1c8a6d16ef.png"></video>

## Properties

Micro.publish supports YAML frontmatter. It also works with the new [Properties](https://obsidian.md/changelog/2023-07-26-desktop-v1.4.0/) feature introduced in Obsidian 1.4, which is essentially a user-friendly interface for the less aesthetically pleasing YAML syntax.

* Micro.publish will use the `title` property in the frontmatter or Properties, if it exists. Otherwise, it will fall back to the filename.
* Micro.publish will use the `tags` property in the frontmatter or Properties, if it exists. Otherwise, it will use the default categories configured in Micro.publish's preferences.

<video controls="controls" src="https://otavio.cc/uploads/2023/5.properties.mp4" width="600" height="400" poster="https://otavio.cc/uploads/2023/e485d5aacc.png"></video>

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

Restart Obsidian and enable the plugin from *Community Plugins* in Settings.

## Contributing

1. Fork this repository and follow the steps from the previous section using the forked repository instead
2. Create a feature branch for the changes
3. Commit the changes and push them to the forked repository
4. Submit a pull request
