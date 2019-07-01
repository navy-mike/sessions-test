const path = require('path');
const http = require('http');
const express = require('express');
const hbs = require('hbs');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const crypto = require('crypto');
const os = require('os');

const appname = 'sessions_test';

//app specific
global.gs_sessionsecret = 'jellox';

//user specific
global.msessionvars = {
  IPADD: "",    //IPADDRESS OF USER
  BTYPE: "",    //BROWSER
  UID: "",      //USERID
  BID: "",      //BIKEID
  ACTYPE: "",   //ACCESS TYPE
  UEMAIL: "",   //USER EMAIL
  UAUTH: "",    //USER AUTHORIZED Y/N
  SPARE: ""       //SPARE
};

global.mblanksessionvars = {
  IPADD: null,    //IPADDRESS OF USER
  BTYPE: null,    //BROWSER
  UID: null,      //USERID
  BID: null,      //BIKEID
  ACTYPE: null,   //ACCESS TYPE
  UEMAIL: null,   //USER EMAIL
  UAUTH: null,    //USER AUTHORIZED Y/N
  SPARE: null     //SPARE VARIABLE
};

global.msIPADD = new Map();  //HOLDS SESSION IP ADDRESS ie: 10.100.1.48
global.msBTYPE = new Map();  //HOLDS SESSION BROWSER TYPE ie: IE, CHROME, ETC
global.msUID = new Map();    //HOLDS SESSION USER ID  ie: 1,22,etc
global.msBID = new Map();    //HOLDS SESSION BIKE ID  ie: 23,99,etc
global.msACTYPE = new Map(); //HOLDS SESSION ACCESS TYPE: PERSON, SKI, SNOWBOARD
global.msUEMAIL = new Map(); //HOLDS SESSION USERS EMAIL ADDRESS
global.msUAUTH = new Map();  //HOLDS SESSION USER IS AUTHENTICATED ie: 1=yes 0=no
global.msSPARE = new Map();  //HOLDS SESSION SPARE VARIABLE
global.msTTL = new Map();    //HOLDS THE DATETIME in ms the the session ID was added the first time. KEY=sessionid VALUE=MILLISECONDS




console.log('__dirname=' + __dirname);

const app = express();
const httpServer = http.createServer(app);

function initialize() {
  try {
    return new Promise((resolve, reject) => {

      const publicDirectoryPath = path.join(__dirname, appname, '../public');       //c:\nodejs_stuff\uciregadm\public
      const viewsPath = path.join(__dirname, appname, '../templates/views');        //c:\nodejs_stuff\uciregadm\templates\views
      const partialsPath = path.join(__dirname, appname, '../templates/partials');  //c:\nodejs_stuff\uciregadm\templates\partials


      console.log('initilization....');
      console.log("Platform: " + os.platform());
      console.log("Architecture: " + os.arch());
      console.log("publicDirectoryPath=" + publicDirectoryPath); //C:\nodejs_stuff\uciregadm\public
      console.log("viewsPath=" + viewsPath);                //C:\nodejs_stuff\uciregadm\templates\views
      console.log("partialsPath=" + partialsPath);               //C:\nodejs_stuff\uciregadm\templates\partials

      hbs.registerHelper('copyrightYear', function () {
        let year = new Date().getFullYear();
        return new hbs.SafeString(year);
      });

      //setup static director to server
      app.use(express.static(publicDirectoryPath)); //Sets the server to serve up any filename.html thats within the public folder.
      //app.use(express.urlencoded());
      app.use(cookieparser());
      //setup handlebars engine and views locations
      app.set('view engine', 'hbs'); //get handlebars setup to use in app
      app.set('views', viewsPath); //<=point to views path
      hbs.registerPartials(partialsPath); //<=point to templates partials path
      app.use(bodyparser.json()); // for parsing application/json
      app.use(bodyparser.urlencoded({ extended: true }));
      //======= BEGIN ROUTES =======
      app.get('/', async (req, res) => {
        let sessionid = crypto.randomBytes(16).toString("hex");
        console.log(sessionid); // => f9b327e70bbcf42494ccb28b2d98e00e

        let ipaddress = getCallerIP(req);
        console.log('ip=' + ipaddress);

        res.render('logon', {
          title: 'System Logon',
          name: 'test',
          sessionid: sessionid,
          ipaddress: ipaddress
        });
      });//END app.get('/',

      app.post('/loginsubmit', async (req, res) => {

        var emailaddress = req.body.loginemail;
        console.log('emailaddress=' + emailaddress);
        res.render('notifyuser', {
          title: 'successful logon',
          name: 'valid email address',
          error: '',
          usermessage: emailaddress
        })
      });

      app.post('/close', async (req, res) => {
        res.render('close', {
          title: 'successful logout'
        })
      });

      app.get('*', async (req, res) => {
        res.send("no get route found!");
      });

      app.post('*', async (req, res) => {
        res.send("no post route found!");
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
};//end initilize
module.exports.initialize = initialize;


function getCallerIP(request) {
  var ip = request.headers['x-forwarded-for'] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress;
  ip = ip.split(',')[0];
  ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
  let host = request.host;
  return ip;
};
module.exports.getCallerIP = getCallerIP;

function getMillisecs() {
  let currdt = new Date();
  let msecs = currdt.getTime();
  return msecs; //msecs since 01/01/1970
};

function getDTfromMS(milliseconds) {
  let fromDate = null;
  if (milliseconds != undefined) {
    let dtmsecs = 0;
    if (typeof (milliseconds) === 'string') {
      dtmsecs = parseInt(milliseconds, 10);
    }
    else {
      dtmsecs = milliseconds;
    }
    let msdate = new Date(dtmsecs);
    fromDate = msdate.toString('MM/dd/yyyy HH:mm:ss');
  }
  return fromDate;
};

function sessAdd(sessionid, ipadd, browsertype) {

};

function testsession() {
  let msecs = getMillisecs();
  let dtstring = '';
  if (msecs > 0) {
    dtstring = getDTfromMS(msecs)

  }
  //map methods
  // get()
  // set()
  // has()
  // delete()
  let mymap = new Map();
  let sessionID = "abcd";
  let ipuid = "1.1.1.1|0";
  mymap.set(sessionID, msessionvars);
  sessionID = "efgh";
  ipuid = "2.2.2.2|9";
  mymap.set(sessionID, ipuid);
  sessionID = "lmno";
  ipuid = "10.100.1.48|1";
  mymap.set(sessionID, ipuid);
  if (mymap) {
    let mapsize = mymap.size;
    console.log('mapsize=' + mapsize);
    console.log('---------------------------');
    let newsessioninfo = new Array();
    newsessioninfo = mymap.get("abcd");
    console.log("abcd data=" + newsessioninfo.ID + ' ' + newsessioninfo.IP + ' ' + newsessioninfo.UID);
    let mapdata = mymap.get("lmno");
    console.log("lmno data=" + mapdata);
    console.log('---------------------------');
    mymap.delete("efgh");
    mapdata = mymap.get("efgh");
    console.log("deleted efgh key=" + mapdata);
    console.log('---------------------------');
    mapdata = mymap.has("lmno");
    console.log("lmno exists=" + mapdata);
    mapdata = mymap.has("efgh");
    console.log("efgh exists=" + mapdata);
    console.log('---------------------------');
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
    console.log('---------------------------');
    //map.entries not compatable with IE!
    // mapkey = null;
    // mapvalue = null;
    // console.log("mapkey/mapvalue");
    // for ([mapkey, mapvalue] of mymap.entries()) {
    //   console.log(mapkey, mapvalue);
    // }

    //mymap.clear(); //removes all items from the map
  }

};


initialize();
testsession();