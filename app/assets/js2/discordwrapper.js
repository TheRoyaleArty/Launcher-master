// Work in progress



const logger = require('./loggerutil')('%c[DiscordWrapper]', 'color: #7289da; font-weight: bold')

const {Client} = require('discord-rpc')

let client
let activity


exports.initRPC = function(genSettings, servSettings, initialDetails = 'Dans le launcher'){
    client = new Client({ transport: 'ipc' })

    activity = {
        details: initialDetails,
        state: 'Server: ' + servSettings.shortId,
        largeImageKey: servSettings.largeImageKey, 
        largeImageText: servSettings.largeImageText,
        smallImageKey: genSettings.smallImageKey,
        smallImageText: genSettings.smallImageText,
        startTimestamp: new Date().getTime(),
        instance: true,
        buttons: [{label : "Button1" , url : "Link1"},{label : "Button2",url : "Link2"}],
       // client.login({ clientId : "825389450934222898" }).catch(console.error),
        
    }

   /* activity = {
        details: "Your Text Here",
        assets: {
        large_image: "Image",
        large_text: "Your Status" // THIS WILL SHOW AS "Playing <Status>" from the outisde
        },
        buttons : [{label : "Button1" , url : "Link1"},{label : "Button2",url : "Link2"}]
        }
        client.login({ clientId : "825389450934222898" }).catch(console.error);

    }*/

    client.on('ready', () => {
        logger.log('Discord RPC Connected')
        client.setActivity(activity)
    })
    
    client.login({clientId: genSettings.clientId}).catch(error => {
        if(error.message.includes('ENOENT')) {
            logger.log('Unable to initialize Discord Rich Presence, no client detected.')
        } else {
            logger.log('Unable to initialize Discord Rich Presence: ' + error.message, error)
        }
    })
}

exports.updateDetails = function(details){
    activity.details = details
    client.setActivity(activity)
}

exports.shutdownRPC = function(){
    if(!client) return
    client.clearActivity()
    client.destroy()
    client = false
    activity = false
}