# Thunder Admin Theme

Administration theme for the Thunder Distribution that extends and modifies 
Sevens styles for authoring UX and an integrated look and feel of the 
contributed modules used in the distribution.

## Development work in progress
This theme started as an admin theme shipped with the first RCs of the thunder
distribution and was based on Seven as a base theme merely containing fixes 
and improvements of the visual presentation regarding the modules in the
distribution.

End of 2016 the Thunder core team started a sub project regarding research and
a concept for improving the authoring UX and a 
[roadmap](https://www.drupal.org/node/2828095) was created that did naturally 
emcompass a lot of theming modifications that go far beyond mere "tweaks" of
Seven. As of now   Thunder Admin is based upon Classy as a base theme and a
fair amount of CSS and theme hooks are copied over from Seven to reduce the
number of overrides in the theme inheritance.

Currently the above history leads to the fact that there are a lot of assets
that will/might need refactoring in future development.

### Things that need refactoring:
* Asset folder structure needs to be improved to follow a clear concept
* image and icon assets need to be consolidated and reworked according to a 
  unified visual language and color scheme
* CSS that was initially only copied into SCSS needs refactoring for clarity
  and consistent use of variables
* Visual styles copied over from Seven need to be refactored to be aligned with
  Thunder Admin's design in more areas than the current focus which is content
  authoring

### Initializing Git Large File Storage (LFS)
Git LFS is used for storing of images for regression testing. In order to provide new images in a pull request, LFS has
to be installed on the system and initialized.

Installation instructions for Git LFS are provided at [git-lfs.github.com](https://git-lfs.github.com/).
After that initialization of LFS has to be done once: ``git lfs install``

## Development workflow

run ``yarn install`` or ``npm install`` if you do not have yarn installed, but
it's highly recommended so check it out:
[yarn documentation](https://yarnpkg.com/)

build scripts and watch scripts are run with npm, for development run 
``npm run dev``

#### The build tasks that will be executed are:
* live-reloading dev server with browser-sync 
  ([link_css](http://drupal.org/project/link_css) Drupal module required)
* SCSS processing and autoprefixing (folder: sass to css)
* image minification (folder: images-originals to images)
* svg sprite creation (folder: images/icons to images/icon-sprite.svg)
* JS linting (folder: js)

#### Visual Regression Tests
Travis will check the theme for changes with a visual regression test.  
If you changed some styling, please provide new reference images.

For creating screenshots you should install [GraphicsMagick](http://www.graphicsmagick.org/INSTALL-unix.html) 
(on mac simply use `brew install graphicsmagick`) otherwise travis tests may fail.

Install a fresh thunder:

- `composer create-project burdamagazinorg/thunder-project:2.x ../fresh-thunder --stability dev --no-interaction --no-install`
- `cd ../fresh-thunder && composer install`
- replace installed thunder_admin theme with the one including your changes by copying or making a symbolic link 
- configure database settings
- `drush si thunder --account-pass=admin install_configure_form.enable_update_status_module=NULL -y`
- if no images are visible: `drush cr -l <yourdomain:port>`

Then you can run selenium in docker:

- if on mac, you need to alias localhost: `sudo ifconfig lo0 alias 172.16.123.1`
- for Chrome testing start `docker run -d -P -p 4444:4444 --shm-size 256m --add-host="fresh-thunder.dd:172.16.123.1" selenium/standalone-chrome:3.4.0-einsteinium`
- for Firefox testing start `docker run -d -P -p 4444:4444 --shm-size 256m --add-host="fresh-thunder.dd:172.16.123.1" selenium/standalone-firefox:3.4.0-einsteinium`

To debug a browser you can use following commands:

- for Chrome testing start `docker run -d -P -p 5900:5900 -p 4444:4444 --shm-size 256m --add-host="fresh-thunder.dd:172.16.123.1" selenium/standalone-chrome-debug:3.4.0-einsteinium`
- for Firefox testing start `docker run -d -P -p 5900:5900 -p 4444:4444 --shm-size 256m --add-host="fresh-thunder.dd:172.16.123.1" selenium/standalone-firefox-debug:3.4.0-einsteinium`

and connect with you vnc client (on mac you can use finder: go to -> connect to server [⌘K]). The password is: `secret`

Before starting, set the correct URL in `sharpeye.conf.js`.  
To start the process, enter following command from within the theme directory:
`/node_modules/.bin/sharpeye --single-browser chrome` for Chrome testing or `/node_modules/.bin/sharpeye --single-browser firefox` for Firefox.

It will make screenshots of the pages, described in `sharpeye.tasks.js` and compare them to the reference images. 
If it detects a change, it will output a diff screenshot in `screenshots/diff`.
If you accept this change, move the corresponsing screenshot out of `screenshots/screen` into `screenshots/reference`.

Now commit the new reference image. If you make a pull request on GitHub, you can upload the diff pictures there.
