# Micro.publish

![GitHub Release (Latest)](https://img.shields.io/github/manifest-json/v/otaviocc/obsidian-microblog?color=573E7A&logo=github&style=for-the-badge)
![GitHub Releases Downloads](https://img.shields.io/github/downloads/otaviocc/obsidian-microblog/total?color=573E7A&logo=github&style=for-the-badge)

Micro.publish is a community-maintained plugin for [Obsidian](https://obsidian.md/) that lets you publish notes to your [Micro.blog](https://micro.blog/) blog — including posts, pages, and quick microposts — right from your vault.

This community-maintained plugin is not affiliated with Micro.blog or Obsidian.

## Features

- Publish to Micro.blog
  - **Posts**: publish with title, tags, visibility (Draft/Public), and optional scheduled date.
  - **Pages**: publish pages and optionally include them in your blog’s navigation.
  - **Microposts** (desktop): compose and publish short posts up to 300 characters (plain text).
- Image handling
  - Automatically finds local images in your note (standard Markdown and Obsidian wiki-style image links), uploads them to Micro.blog, and replaces references with hosted URLs.
  - Caches uploaded image mappings in note properties for fast re-publish.
- Categories and tags
  - Synchronize categories from Micro.blog for better tag suggestions.
  - Default tags and visibility for new posts.
- Multi-blog support
  - Choose a default blog and switch per publish.
- Obsidian Properties (YAML frontmatter) support
  - Uses `title`, `tags` when present; falls back to filename and defaults otherwise.
  - Saves `url` after successful publishing for easy updates.

## Installation

- In Obsidian, go to `Settings > Community Plugins > Browse`, search for `Micro.publish`, then install and enable.
- Or install from the plugin directory: [Obsidian’s website](https://obsidian.md/plugins?search=micro.publish).

## Login

Generate an App Token on the [Micro.blog Account page](https://micro.blog/account/apps) and paste it in `Settings > Micro.publish`.

## Quick start

1. Create or open a Markdown note.
2. Optionally add Properties (or YAML) for:
   - `title`: overrides filename as the post title.
   - `tags`: comma-separated list (e.g., `writing, book-notes`).
3. Use the Command Palette and run:
   - `Publish Post to Micro.blog` for posts, or
   - `Publish Page to Micro.blog` for pages.
4. Review and adjust fields (title, tags, visibility, blog, and date for posts; navigation for pages).
5. Confirm to publish. The note’s Properties will be updated with the post/page `url`.

Tip: On desktop, use `Compose Micropost` (also available via a ribbon icon).

## Commands

- `Publish Post to Micro.blog`: publish or update the current note as a post.
- `Publish Page to Micro.blog`: publish or update the current note as a page.
- `Synchronize Categories`: fetch categories from Micro.blog for suggestions.
- `Compose Micropost` (desktop only): open a quick composer for short posts (up to 300 characters in plain text).

## Settings

- Blog
  - **Blog**: default blog for new posts and pages (with a refresh button).
- Posts
  - **Categories**: default tags for new posts (comma-separated).
  - **Visibility**: `Draft` or `Public` default for posts.
- Pages
  - **Navigation**: include new pages in blog navigation by default.
- Misc.
  - **Categories synchronization**: auto-sync categories when Obsidian starts.
- Account
  - **App Token**: log in / log out of Micro.blog.

## Properties (YAML frontmatter)

- **title**: used as the post/page title. Falls back to filename if missing.
- **tags**: comma-separated tags for posts. Falls back to defaults if missing.
- **url**: added by Micro.publish after a successful publish; used to update existing posts/pages.

Example:

```yaml
---
title: My New Post
tags: writing, book-notes
url: https://example.micro.blog/2024/09/10/my-new-post.html
---
```

## Editing and updating

- After publishing with Micro.publish, the note’s `url` is saved in Properties.
- To update a post/page, edit the note (or title/tags) and run the same command:
  - `Publish Post to Micro.blog` or `Publish Page to Micro.blog`.
- Updating older notes (published before v2.0.0): add a `url` Property manually, then run the command.

## Images

- Supported image syntaxes:
  - Standard Markdown: `![alt](path/to/image.png)`
  - Obsidian wiki-style: `![[path/to/image.png]]`
- Local images are read from your vault, uploaded to Micro.blog, and references are replaced with hosted URLs.
- Relative paths are resolved against the note’s folder. Remote image URLs are left unchanged.
- If you need to force reprocessing, remove the `image_urls` Property and re-publish.

## Scheduling posts

- In the post review dialog, set an optional scheduled date/time. The date must be parseable by your system (e.g., `2025-09-12 14:00`). Leave blank to publish immediately.

## Desktop-only extras

- `Compose Micropost` command and ribbon icon are available on desktop to quickly publish short updates (limit: 300 plain-text characters).

## Building from source

Clone into your vault’s plugins folder:

```bash
cd .obsidian/plugins/
git clone https://github.com/otaviocc/obsidian-microblog
```

Install and build:

```bash
cd obsidian-microblog
npm i
npm run build
```

Restart Obsidian and enable the plugin under Community Plugins.

## Contributing

1. Fork this repository and follow the build steps above using your fork.
2. Create a feature branch.
3. Commit and push your changes.
4. Open a pull request.

## License

MIT
