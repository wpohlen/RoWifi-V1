var express = require("express");
var app = express();
var bodyParser = require('body-parser')
var Database = require('./Utilities/Database.js');
var Commando = require('discord.js-commando');
var { prefix, token } = require('./config.json');
var path = require('path');
var Logger = require('./Modules/LogService');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

var port = process.env.PORT || 3333
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

//Starting discord bot
const client = new Commando.Client({
    owner: '311395138133950465',
    commandPrefix: prefix,
    unknownCommandResponse: false,
    invite: 'https://discord.gg/RApdmuj'
});

let AuditLogs = require('./Services/AAWatcher')
let AutoDetection = require('./Services/AutoDetection')
client.once('ready', async function () {
    console.log('Ready');
    let guilds = client.guilds;
    //guilds.find(g => g.id == "116394307014885379").leave().catch(err => console.log(err));
    for (let guild of guilds) {
        console.log(guild[0])
        let Group = await Database.GetGroup(guild[1].id);
        if (!Group) {
            continue;
        }
        //AuditLogs.WatchAA(guild[1]);
        // setInterval(async function () {
             await AutoDetection.execute(guild[1]);
        // }, 30*60*1000)
    }
});

client.on('error', console.error);

client.on('message', async function (msg) {
    if (msg.channel.id == "499293823151767552") {
        let embed = message.embeds[0].fields
        console.log(embed)
    }
})

client.on('guildCreate', async function(guild) {
    await Database.AddGuild(guild.id);
    await Logger.Log("Bot added to " + guild.name);
})

client.registry
    .registerGroups([
        ['roblox', 'Roblox-Related Functions'],
        ['group', 'Group Administration Functions'],
        ['math', 'Math Functions']
        ['moderation', 'Moderation Commands'],
        ['owner', 'Owner-Only or Alpha Modules']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(token);