# CSRF Examples

Example Cross Site Request Forgery (CSRF) vulnerabilities in action.


## Requirements

* [git](https://git-scm.com/downloads)
* [NodeJS](https://nodejs.org/en/)


## Get the Code

Download the code for this project by using git clone:
```bash
git clone https://github.com/Learn-by-doing/csrf-examples.git
```


## Install Node Modules

Like any node project, you will need to download and install the required node modules for the project to run. Change into the "csrf-examples" directory:
```bash
cd csrf-examples
```

And then:
```bash
npm install
```
This command installs the node modules needed to run the project in a new directory named `node_modules`.

Once the modules have finished installing, you can run the project like this:
```bash
npm start
```

You should see the following if everything is OK:
```
Server started and listening at localhost:3000
```


## Try the demo

Open your browser to and navigate to [localhost:3000](http://localhost:3000).

Login using the test account:
* Username: `bob`
* Password: `test`

In a new tab, navigate to [localhost:3001](http://localhost:3001) to view some examples of CSRF exploits. You will notice that the balance goes down everytime you load that page. This is because the page is successfully exploiting a CSRF vulnerability.


## Checkout the "fixed" branch

To see the fixed version of this demo, switch to the "fixed" branch:
```bash
git checkout fixed
```

There are new dependencies, so you will have to re-run `npm install` to download them.

Now you can restart the server by pressing __CTRL + C__ to kill the server process and then run `npm start` to start it up again.

Navigate again to [localhost:3000](http://localhost:3000) and login to the test account.

And once more try the page with the CSRF exploits: [localhost:3001](http://localhost:3001).

You will notice now that the account balance is unchanged.


## Going further

Here are some useful links where you can learn more about this topic:
* https://en.wikipedia.org/wiki/Cross-site_request_forgery
* https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)
