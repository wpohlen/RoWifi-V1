var cfenv = require("cfenv");

// load local VCAP configuration  and service credentials
var vcapLocal, cloudant, users, guilds;

try {
    vcapLocal = require('./../vcap-local.json');
    console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');
if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/cloudant/)) {

// Initialize database with credentials
if (appEnv.services['cloudantNoSQLDB']) {
    // CF service named 'cloudantNoSQLDB'
    cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
} else {
    // user-provided service with 'cloudant' in its name
    cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
}
} else if (process.env.CLOUDANT_URL){
cloudant = Cloudant(process.env.CLOUDANT_URL);
}
if(cloudant) {
    // Specify the database we are going to use (mydb)...
    users = cloudant.db.use('users');
    guilds = cloudant.db.use('guilds');
}


function GetUser(DiscordId) {
    return new Promise(function(resolve, reject) {
        users.get(DiscordId, function(err, body) {
            if (err) {
                //console.log(err);
                resolve(false);
            }
            resolve(body);
        }); 
    })
}

async function GetGroup(GuildId) {
    return new Promise(function(resolve, reject) {
        guilds.get(GuildId, function(err, body) {
            if(err) {
                console.log(err);
                resolve(false);
            }
            resolve(body);
        })
    })
}

async function AddUser(DiscordId, RobloxId) {
    let user = {"_id": DiscordId, "RobloxId": RobloxId}
    return new Promise(function(resolve, reject) {
        users.insert(user, function(err, result) {
            if (err) {
                console.log(err);
                resolve(false);
            }
            resolve(true);
        })
    })
}

async function AddUsers(Ids) {
    return new Promise(function(resolve, reject) {
        users.bulk({docs:Ids}, function(err, result) {
            if (err) {
                console.log(err);
                resolve(false);
            }
            resolve(true);
        })
    })
}

module.exports = {GetUser, GetGroup, AddUser, AddUsers}