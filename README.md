# Colosseum-Chart

Created by Pranav Goswami (B20CS016) & Deep Patel (B20CS087)

Deployed webpage: [Colosseum-Chart](https://pranavchiku.github.io/Colosseum-Chart/)

Observable notebook: [Colosseum-Chart](https://observablehq.com/d/c444d749d561a0c3@874)

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
npx http-server
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@5
npm install https://api.observablehq.com/d/c444d749d561a0c3@874.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "c444d749d561a0c3";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~
