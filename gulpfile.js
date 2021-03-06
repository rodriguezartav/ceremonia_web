/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.

  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/

var requireDir = require('require-dir');

var minimist = require("minimist");
var args = minimist(process.argv);
var fs = require('fs');

var env = "";
if( args.env ) env = "-" + args.env

try{

  if(fs.existsSync( './.env' + env )) {
    require('dotenv').config({path: './.env' + env});
  }

}catch(e){ console.warning('Could not load .env file - vars should be loaded externally') }


// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });
