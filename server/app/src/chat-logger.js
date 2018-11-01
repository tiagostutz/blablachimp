const logger = require('console-server')
const topics = require('./lib/topics')
const MongoClient = require('mongodb').MongoClient;

let bufferedMessage = []

const url = 'mongodb://root:n4oehf4c1l!@localhost:27017/?authMechanism=SCRAM-SHA-1';
const dbName = 'myproject';
const client = new MongoClient(url);

module.exports = {

    start: (mqttClient, ready) => {
        logger.info("Starting session chat logger...")

        client.connect((err) => {

            if (err) {
                throw err
            }
            
            console.log("chat-logger connected successfully to MongoDB");
            const db = client.db(dbName);
            const collection = db.collection('chat-messages')
            
            mqttClient.subscribe(`${topics.server.sessions._path}/#`, msg => {
        
                if (msg.message) {
                    
                    // buffered insert to avoid duplicates
                    const key = "message.timestamp" + msg.message.timestamp + "message.from.id" + msg.message.from.id
                    if (bufferedMessage.length === 0 || bufferedMessage[0] !== key) {
                        
                        collection.insertOne(msg)                        
                        if (bufferedMessage[0] !== key) {                            
                            bufferedMessage = []
                            bufferedMessage.push(key)
                        }
                        
                    }
                }
                
            }, "chatLogger")

            logger.debug("Chat logger succesfully initialized.")
            return ready()

            // client.close();
        });

    },

    getMessages: (sessionId, limit, receive) => {
        client.connect((err) => {

            if (err) {
                throw err
            }

            const db = client.db(dbName);
            const collection = db.collection('chat-messages')

            collection.find({"sessionInfo.sessionId": sessionId}).limit(limit).toArray((err, docs) => {
                if (err) {
                    return receive()
                }
                receive(docs)
                client.close();
            });
        })
    }
}