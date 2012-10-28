# Portfolio
Portfolio page of xinteractionx

# Dependencies
[1140 CSS Grid](http://cssgrid.net/)
[jQuery](http://jquery.com)
[Responsive Measure](http://jbrewer.github.com/Responsive-Measure/)
[galleria.io](http://galleria.io/)
[tinycarousel](http://baijs.nl/tinycarousel/)
[backbone.js](http://backbonejs.org)
[underscorejs](http://underscorejs.org)

# Behance Application
Fetch and render projects from [Behance](http://www.behance.net/).
KIM: if you want to add functionality to the app, you might want have a look
at the [Backbone extension from Behance](https://github.com/behance/network_api_backbone).
We decided against using it since we need to cache the json for projects anyway 
(limited number of calls allowed by Behance) and load them from file. It is 
therefore sufficient to use Backbone.

## Update script
PHP script that fetches all projects on behance and writes them to a file
called _projects.json_.

### During development
You want to call this script everytime the projects change on Behance.

If you serve the page through a web server (e.g. Apache), you can just point
your browser to behanceUpdateScript.php.

Otherwise, type on a shell (terminal on Mac) the command `php /path/to/behanceUpdateScript.php`.
e.g. if your project is located in your home in a folder named _Portfolio_, you'd
type `php ~/Portfolio/behanceUpdateScript.php

### On live server
Let a cronjob call this script on a regular basis. On Hostpoint, you'd install
it as follows:
1. upload your whole project (including behanceUpdateScript.php) to the server
2. Log into the control panel
3. Go to "Admin" > "Cronjobs Manager" and click on "Cronjob erstellen"
4. To run it every 15 minutes, enter "*/15" for _m_ (minutes) and "*" for all 
other time related fields; enter "php /pathToScript" for command, 
e.g. "php ~/public_html/behanceUpdateScript.php" if the project is located directly in public_html
5. Click "Erstellen"
If everything works, the script will create and fill _projects.json_ when
it is run the next time (which in above sample will be the next quarter of an hour).
If anything goes wrong, the script will output an error message which will be 
emailed to you.

# TODOs

## Behance Application
The styling done so far is very limited to nonexistant.

### Navigation
* works for 1140px or wider, but needs adaption for smaller screens. See the 
 	media query at the end of behance.css for a styling sample to make the 
 	navigation half the size.
* make sure previous/next buttons stay next to viewport and don't flow above/below
* make sure pager is displayed centered

### Stage
Main issue here will be styling of the Galleria. I've added a theme to 
js/galleria/themes/portfolio where I added some basic styling. Note that the
controls have a red background so you can properly see them. 
* handle configuration of gallery in js/galleria/themes/portfolio/galleria.portfolio.js
* handle styling of gallery in js/galleria/themes/portfolio/galleria.portfolio.css
* note that you can use js/galleria/themes/portfolio/portfolio-demo.html while styling
* to replace the control icons, either change portfolio-map.png (looks like a 
sprite, keep controls in their respective place) or change using css 


## Add Parallax effect
* [jparallax](http://stephband.info/jparallax/)
* [curtain](http://editsquarterly.com/)
* [stellar.js](http://markdalgleish.com/projects/stellar.js/)
  * [Tutorial](http://webdesign.tutsplus.com/tutorials/complete-websites/create-a-parallax-scrolling-website-using-stellar-js) looks pretty similar to what we want
  * could interfere with css3-mediaqueries.js (did when I tried to adapt the sample to 1140)
  * [One Page Websites tagged with: Parallax Scrolling](http://onepagelove.com/tag/parallax-scrolling)
  * Found only one example that is responsive as well: http://www.duluthtrading.com/site/components/last-pants-standing -> consider disabling effect with media queries

### Showcases
[Martin Oberhäuser](http://www.oberhaeuser.info)

## Wordpress
* 1140 used in other templates as well, e.g. [1140 Fluid Starkers WordPress Theme](http://www.thedotmack.com/2011/07/19/1140-fluid-starkers-wordpress-theme)
* decide whether to work with pages or posts (from what makes sense in regard to information structure)
  * assume pages:
	- make onepager: probably just adapt template to render all pages on one (see http://stackoverflow.com/questions/7023310/wordpress-display-all-pages-on-one-page)
	- adapt template to only render what we need
  		- disable side-bar and comment box in page.php
	- put fixedwrapper in header.php

  * assume posts: make categories for home/work/who

# Other
[Markdown CheatSheet](http://warpedvisions.org/projects/markdown-cheat-sheet/)  
[Markdown CheatSheet](https://en.wikipedia.org/wiki/Markdown)
