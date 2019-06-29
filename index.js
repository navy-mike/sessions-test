const path = require('path');
const http = require('http');
const express = require('express');
const hbs = require('hbs');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const crypto = require('crypto');
const os = require('os');

const viewsPath = __dirname;
const publicPath = __dirname;


//app specific
global.gs_sessionsecret = 'jellox';

//user specific
global.gs_isauth = 0;


const app = express();
const httpServer = http.createServer(app);

function initialize() {
  try {
    return new Promise((resolve, reject) => {

      console.log('initilization....');
      console.log("Platform: " + os.platform());
      console.log("Architecture: " + os.arch());

      hbs.registerHelper('copyrightYear', function () {
        let year = new Date().getFullYear();
        return new hbs.SafeString(year);
      });

      //setup static director to server
      app.use(express.static(publicPath)); //Sets the server to serve up any filename.html thats within the public folder.
      //app.use(express.urlencoded());
      app.use(cookieparser());
      //setup handlebars engine and views locations
      app.set('view engine', 'hbs'); //get handlebars setup to use in app
      app.set('views', viewsPath); //<=point to views path
      app.use(bodyparser.json()); // for parsing application/json
      app.use(bodyparser.urlencoded({ extended: true }));

      console.log('views path=' + viewsPath);

      //======= BEGIN ROUTES =======
      app.get('/', async (req, res) => {
        let sessionid = crypto.randomBytes(16).toString("hex");
        console.log(sessionid); // => f9b327e70bbcf42494ccb28b2d98e00e

        let ipaddress = getCallerIP(req);
        console.log('ip=' + ipaddress);

        res.end();
      });//END app.get('/',

      app.get('/cookiesnotice', async (req, res) => {
        // gs_pagefrom = 'HOME PAGE';
        // gs_errormsg = 'You must have cookies enabled for the Utah County Item ' + gs_crlf + 'Registration system to work. ';
        // gs_errormsg += 'If you need help allowing ' + gs_crlf + 'your browser to enable cookies, you can call our system ' + gs_crlf;
        // gs_errormsg += 'administrator at 801-851-4008. Thank you.';
        // res.render('pageerror', {
        //   title: 'COOKIES ARE NOT ENABLED',
        //   name: 'Application Error',
        //   errorMessage: ''
        // })
        res.end();
      });
      //======= END OF ROUTES =======


      app.listen(3000, () => {
        console.log('server is up on port 3000.')
      })

    }); //end promise
  }
  catch (err) {
    console.log('index.js initialize error. err=' + err);
  }
}//end initilize
module.exports.initialize = initialize;


function getCallerIP(request) {
  var ip = request.headers['x-forwarded-for'] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress;
  ip = ip.split(',')[0];
  ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
  return ip;
}
module.exports.getCallerIP = getCallerIP;


let sessinfo = {
  ID: "",
  IP: "",
  UID: ""
};
module.exports.sessinfo = sessinfo;

let mysessions;
module.exports.mysessions = mysessions;

function testsession() {
  //map methods
  // get()
  // set()
  // has()
  // delete()
  let mymap = new Map();
  let sessionID = "abcd";
  let ipuid = "1.1.1.1|0";
  mymap.set(sessionID, ipuid);
  sessionID = "efgh";
  ipuid = "2.2.2.2|9";
  mymap.set(sessionID, ipuid);
  sessionID = "lmno";
  ipuid = "10.100.1.48|1";
  mymap.set(sessionID, ipuid);
  if (mymap) {
    let mapsize = mymap.size;
    console.log('mapsize=' + mapsize);
    let mapdata = mymap.get("lmno");
    console.log("lmno data=" + mapdata);
    mymap.delete("efgh");
    mapdata = mymap.get("efgh");
    console.log("efgh key=" + mapdata);
    mapdata = mymap.has("lmno");
    console.log("lmno exists=" + mapdata);
    mapdata = mymap.has("efgh");
    console.log("efgh exists=" + mapdata);
    console.log("--keys--");
    let mapkey = null;
    for (mapkey of mymap.keys()) {
      console.log(mapkey);
    }
    console.log("--values--");
    let mapvalue = null;
    for (mapvalue of mymap.values()) {
      console.log(mapvalue);
    }
    mapkey = null;
    mapvalue = null;
    for ([mapkey, mapvalue] of mymap.entries()) {
      console.log(mapkey, mapvalue);
    }

    //mymap.clear(); //removes all items from the map
  }

};


initialize();
testsession();