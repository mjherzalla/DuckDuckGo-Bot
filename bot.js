// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
 
const { ActivityHandler, ActionTypes, ActivityTypes, CardFactory, MessageFactory } = require('botbuilder');

const fetch = require('node-fetch');
 

class MyBot extends ActivityHandler {
    constructor() {
        super();
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {

     
                    const reply = MessageFactory.text('Welcome to Duckduckgo Bot. ' +
                        'Tell me what you are searching for?');
                    reply.attachments = [ {
                        name: 'duckduckgo.png',
                        contentType: 'image/png',
                        contentUrl: 'https://icons-for-free.com/iconfiles/png/512/duckduckgo+engine+internet+optimization+search+web+icon-1320192725018157061.png'
                       
                    }];
                    await context.sendActivity(reply);
                     
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {
            const reply = { type: ActivityTypes.Message };

            await fetch('https://api.duckduckgo.com/?q='+context.activity.text +'&format=json&pretty=1')
             .then(res => res.json())
             .then(json =>{

            const buttons = [];
           
            json.RelatedTopics.forEach(element => {
                const title=element.Text;
                const url =element.FirstURL  ;

                if( title!="" && url!=null ){
                      buttons.push(  
                    {  items : [

                        {
                          type: "Image",
                          url: "https://picsum.photos/100/100?image=123",
                          isVisible: false,
                          id: "imageToToggle2",
                          size: "medium"}]

                          ,type: ActionTypes.OpenUrl, title: title, value: url })
                
                }
              
            });
            let toSay="";
            if(buttons.length==0){
               toSay="Nothing found :("
            }else{
               toSay=buttons.length+" Found"
            }
            const card = CardFactory.heroCard('', undefined,
                buttons,
              { text: toSay});

            reply.attachments = [card];
             });
           await context.sendActivity(reply);
           await context.sendActivity({ text: 'Any other Search ?' });

            // By calling next() you ensure that the next BotHandler is run.
            await next();

          
        });


    }

    
}

module.exports.MyBot = MyBot;
