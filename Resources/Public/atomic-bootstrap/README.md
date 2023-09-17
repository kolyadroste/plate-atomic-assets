# Atomic Bootstrap

Provides a build process that splits Boostrap into atomic css components. Dynamic loading of these components can lead to a drastic acceleration of the online project

## Why

Bootstrap is an exceptional framework that offers a wide range of functionalities. However, in certain scenarios, it may be inefficient to load the entirety of the framework for every view within an application. This is particularly relevant for content management system (CMS) projects with a large number of pages and views. To address this challenge, our solution enables the selective loading of only the components required for a specific view. While this approach may result in additional HTTP requests, the advent of HTTP/2 mitigates any potential performance concerns. Furthermore, once the initial view is loaded, the browser caches the CSS files, thereby accelerating the loading of subsequent views and dynamically adding any additional components as needed. This streamlined approach enhances the overall user experience and optimizes resource utilization.

## Bootstrap Modifications

- provide a base.css with critical css
- generate all bs componets in single css files
- Separating Utilities into atomic components, cause of its size
- 

## Installation

```bash
yarm install | npm install
```

