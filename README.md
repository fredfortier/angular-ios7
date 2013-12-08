angular-ios7
============

Lightweight Angular module that replicates key design elements of iOS7

Currently under development. It works at a basic level but a lot of things may change.

Try it here: http://angular-ios7.herokuapp.com

<h2>Why?</h2>
To add a native feel to HTML5 apps. So far, my quest for the perfect HTML5 mobile toolkit has been unsuccessful. I use responsive front-end frameworks (like Bootstrap) but they are not designed to achieve that "native feel". Conversely, most mobile specific toolkits give me more than I require -- including overlapping scripts, additional dependencies and conflicting opinions. I do not want any feature that overlaps with Angular (or a responsive framework) unless it provide clear benefits. So I decided to write my own *lightweight* Angular module.

For something more all encompassing, I recommend considering this project: https://github.com/angular-widgets/angular-jqm.

<h2>Goals</h2>
This is a clone of iOS7, not a custom design. To add other platforms or custom look, one could modify only the iOS7 elements in the CSS (without touching JS).

This project does *not* try to be a complete mobile toolkit. It just clones iOS7 elements key to a native feel. It can be used with a responsive front-end framework without unnecessary overlap and without inherently depending on it. It should remain lightweight and focus only on those key elements. It should not introduce dependencies outside of the Angular ecosystem.

<h2>Features</h2>
Limited to:
- Page
- Fixed heading
- Page transitions
- List
- List filter
- Route provider

This project is largely based on: http://c2prods.com/web/2013/cloning-the-ui-of-ios-7-with-html-css-and-javascript/

<h2>Getting Started</h2>
Clone the project and install dependencies:
```shell
git clone https://github.com/fredfortier/angular-ios7
cd angular-ios7
npm install
```

Build:
```shell
npm install -g grunt-cli
grunt
```

Run the demo:
```shell
node server.js
```
Open the specified URL in your web browser.

It is also possible to run the demo in Cordova.
```shell
npm install -g cordova
cd cordova
cordova prepare ios
cordova emulate ios
```
Follow the Cordova documentation for more details.

<h2>Usage Example</h2>
Make sure that your app includes the "mobileClone" dependency:
```js
angular.module('mobileCloneDemo', ['mobileClone'])
```

The prefix for all directives is "mc" (as in Mobile Clone). Use the mcView directive as you would ngView.
```html
<mc-view></mc-view>
```

Each page should correspond to a an Angular template. There are various methods for declaring templates. Here is how to do it with a script tag. The demo app shows a different method.
```html
<script type="text/ng-template" id="demo/partials/view-home.html">
    <mc-page id="view-home" title="Test Page">
        <header>
            <mc-nav position="left" back="true">Menu</mc-nav>
            <mc-nav position="right" change-to="view-done" action="true">Info</mc-nav>
        </header>
        <mc-content>
            <mc-list items="items" change-to="view-details" param="id"></mc-list>
        </mc-content>
    </mc-page>
</script>
```
Here is how the is works:
- mc-page: Declares a page. Always give it an id and a title. The title will show in the center of the header.
- header: Declares the header
- mc-nav: Declares a header button.
  - position: Determine the position of the button (left or right).
  - back: Indicates a back button. Back buttons show a special icon. If no other action is specified, tapping it will issue a window.history.back().
  - change-to: Changes the page to the specified page id. It just updates the $location.path with to target the page. It takes priority over other actions. It is optional and can be replaced by ng-click for more granular control on the behavior.
  - action: Indicate an "action button", it just emphasizes the button label.
- mc-list: Declares a scrollable list
  - items: Expects an array of objects (collection) with the list values. Include at least these attributes in each object: id, title, desc.
  - change-to: Changes to the specified page id when tapping an item in the list.
  - param: Add the value of the specified parameter to the URL when changing the page (must correspond to a key present in each object of the collection)

As indicated above, page transitions simply update $location.path. Consequently, the Angular ngRoute module works out of the box without any special consideration. For example,
```js
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when("/view-home", {
                templateUrl: "demo/partials/view-home.html"
            })
            .when("/view-done", {
                templateUrl: "demo/partials/view-done.html"
            })
            .when("/view-details/:itemId", {
                templateUrl: "demo/partials/view-details.html"
            })
            .otherwise({
                redirectTo: "/view-home"
            });
    })
```
