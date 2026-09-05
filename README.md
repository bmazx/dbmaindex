# dbmaindex

My personal website to host my stuff.

This website does not require any external dependencies to run.

It is recommended to view this website through a server rather than locally on your filesystem due to resolving root directory paths.

If you have python installed, simply run this in the project root dir:
```py
python -m http.server
```
and view locally at `http://localhost:8000/index.html`.

## node
node and npm are only used for backend dev tools, notably to create blog posts from a html template. npm is not required to run this website.

install npm dependencies:
```
npm install
```

build blog post html:
```
npm run build
```
