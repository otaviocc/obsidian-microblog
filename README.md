# Micro.publish

Micro.publish is a community-maintained plugin for [Obsidian](https://obsidian.md/) that allows you to publish notes to a [Micro.blog](https://micro.blog/) blog.

Does this plugin improve your workflow? If so, you can show your appreciation by buying me a coffee.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Z8Z0C9KPT)

This community-maintained plugin is not affiliated with Micro.blog or Obsidian.

## Installation

To install this plugin, open Obsidian and go to `Settings > Community Plugins > Browse`. Search for `Micro.publish` and click Install. Alternately, it can be installed [directly from Obsidian's website](https://obsidian.md/plugins?search=micro.publish).

![Screenshot 2023-08-31 at 06 28 51](https://github.com/otaviocc/obsidian-microblog/assets/139272/fa18e221-a8bc-42e3-99e7-56e9c370a4ac)

## Login

After installation, you need to log in to a Micro.blog account with an App Token. You can create an App Token on the [Micro.blog Account Page](https://micro.blog/account/apps).

![Screenshot 2023-08-31 at 06 28 29](https://github.com/otaviocc/obsidian-microblog/assets/139272/1d98c0ec-041f-43da-8c1d-fe38839adc26)

## Settings

Users with multiple blogs can set a default blog, default categories, and default post visibility (draft or public). These settings can be overridden before publishing a note to Micro.blog.

![Screenshot 2023-08-31 at 06 28 20](https://github.com/otaviocc/obsidian-microblog/assets/139272/3a6db0ae-bdb8-453f-91e6-a9333bdaa96f)

## Publishing

The plugin has two commands that can be accessed through the Command Palette:

- **Post to Micro.blog** - This command publishes the selected note to Micro.blog.
- **Synchronize Categories** - This command fetches all the categories used in your blog from Micro.blog.

![Screenshot 2023-08-31 at 06 33 49](https://github.com/otaviocc/obsidian-microblog/assets/139272/f22aaf35-cd4c-4213-9feb-805dac539a34)

**Tip:** Micro.publish automatically fetches categories from Micro.blog whenever Obsidian is launched.

Before publishing a note to Micro.blog, Micro.publish opens a window that allows you to change the post title, tags, visibility, and data (for scheduling a post for a future date).

![Screenshot 2023-08-31 at 06 28 08](https://github.com/otaviocc/obsidian-microblog/assets/139272/b8fe7e3d-f20c-448e-9bf2-67027da4e833)

## Properties

Micro.publish supports YAML frontmatter. It also works with the new [Properties](https://obsidian.md/changelog/2023-07-26-desktop-v1.4.0/) feature introduced in Obsidian 1.4, which is essentially a user-friendly interface for the less aesthetically pleasing YAML syntax.

* Micro.publish will use the `title` property in the frontmatter or Properties, if it exists. Otherwise, it will fall back to the filename.
* Micro.publish will use the `tags` property in the frontmatter or Properties, if it exists. Otherwise, it will use the default categories configured in Micro.publish's preferences.

![Screenshot 2023-08-31 at 06 27 13](https://github.com/otaviocc/obsidian-microblog/assets/139272/f6875982-959c-4c0f-a158-66df6917dde3)

![Screenshot 2023-08-31 at 06 27 36](https://github.com/otaviocc/obsidian-microblog/assets/139272/3c3e12c1-2aee-437c-b7ad-102b13fbe00a)

## Editing

For posts **published with version 2.0.0 or newer**, the post's `URL` will be added to the Markdown file in the YAML frontmatter/Property.

For those in _Edit mode_, it appears as a Property as shown below:

![68747470733a2f2f6f746176696f2e63632f75706c6f6164732f323032332f70726f706572746965732e706e67-1](https://github.com/otaviocc/obsidian-microblog/assets/139272/6488a0e8-e188-44c6-a8b9-040d85d88b84)

And for those utilizing the _Source mode_, as YAML:

![68747470733a2f2f6f746176696f2e63632f75706c6f6164732f323032332f66726f6e746d61747465722e706e67](https://github.com/otaviocc/obsidian-microblog/assets/139272/d17c9a63-4e98-4880-aa48-5901ba1265d3)

Once the note or title has been edited (either through the filename or [YAML/Property](https://otavio.cc/micropublish/#properties)), updating is as simple as using the [*Post to Micro.blog* command from the Command Palette](https://otavio.cc/micropublish/#publishing). A simplified version of the Review view will appear, displaying the post's title. For users with multiple blogs, it will prompt them to confirm which blog the post belongs to.

![68747470733a2f2f6f746176696f2e63632f75706c6f6164732f323032332f726576696577656469742e706e67](https://github.com/otaviocc/obsidian-microblog/assets/139272/cc8452c3-690d-4914-97e6-b04ed76b1e26)

It is also possible to update posts that were published using Micro.publish **versions prior to 2.0.0**. To do so, you must include a Property (or field in the YAML frontmatter) named `url` containing the URL of the published post, as illustrated below.

To include a new Property, simply follow these steps in the Command Palette:

![68747470733a2f2f6f746176696f2e63632f75706c6f6164732f323032332f6164642d70726f70657274792e706e67](https://github.com/otaviocc/obsidian-microblog/assets/139272/e6fa328d-9c78-4ed8-9872-5a1840ab702c)

And add the `url` with the published post URL:

![68747470733a2f2f6f746176696f2e63632f75706c6f6164732f323032332f70726f706572746965732e706e67-1](https://github.com/otaviocc/obsidian-microblog/assets/139272/6488a0e8-e188-44c6-a8b9-040d85d88b84)

Those who prefer the YAML file can add the the `url` using the format:

```yaml
---
url: https://example.com/path/to/post.html
---
```

After editing the note or title (either through the filename or YAML/Property), updating is as straightforward as utilizing the *Post to Micro.blog* command from the Command Palette. Similar to the process for version 2.0.0, a simplified version of the Review view will be presented, featuring the post's title. For users with multiple blogs, it will inquire about the blog to which the post should be associated.

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
