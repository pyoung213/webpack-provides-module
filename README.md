Webpack Provides Module
==========

Webpack plugin that allows you to not use static paths so you can move components around freely in your folder structure.

Install
----
    npm install --save-dev webpack-provides-module

Usage
----
### Webpack

#### In your webpack config
```JavaScript
const providesModuleHelper = require("webpack-provides-module");

resolve: {
    providesModuleHelper.discover({
        roots: [
            root("src")
        ]
    })
}
```

### Inside your project
At the top of any file that is in your discovered path (example "src") and is not blacklisted add:

<b>Top of file</b>
```JavaScript
// @providesModule NAMESPACE-ComponentName
```
<b>Importing in another file</b>
```JavaScript
import NAMESPACE-ComponentName from "NAMESPACE-ComponentName";
```

I like to namespace the beginning with the product name for searching, linting and collisions.  Example if your product was called "Awesome Product" I would start all of them with AP-{ComponentName}.

### Linter
If you namespaced all of your files with the product name it makes linting a lot easier for unresolved imports.

```JavaScript
//inside your .eslintrc
{
    "rules": {
        "import/no-unresolved": [2, { ignore: ['^AP-', '^ANOTHER_PRODUCT-',] }]
    }
}
```
