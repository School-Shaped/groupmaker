var repl = require("repl").start({}),
    promisify = require("repl-promised").promisify,    
    db = require('../models')

repl.context.db = db;
promisify(repl);