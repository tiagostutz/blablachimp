import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import moment from 'moment'

import topics from '../topics'

export default class ChatStationModel extends RhelenaPresentationModel {
    constructor() {
        super();

        globalState.loggedUser = {
            id: "10",
            name: "John Smith",
            avatarURL: "https://st2.depositphotos.com/3369547/11899/v/950/depositphotos_118998210-stock-illustration-woman-glasses-female-avatar-person.jpg"
        }

        //initialize customers
        globalState.customers = [{
            id: "1",
            name: "Leonard",
            avatarURL: "https://pickaface.net/gallery/avatar/20130919_112248_1385_mock.png",
            lastSeenAt: moment(new Date()).add(-3, 'minutes'),
            lastMessages: [],
            isOnline: true,
        },
        {
            id: "2",
            name: "Mary",
            avatarURL: "data:image/jpeg;base64,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",
            lastSeenAt: moment(new Date()).add(-3, 'days'),
            lastMessages: [],
            isOnline: false,
        }]
        
        manuh.subscribe(topics.costumerRadar.status.online, "ChatStation", msg => {
            let onlineCostumerArr = globalState.customers.filter(c => c.id === msg.costumer.id)
            if (onlineCostumerArr.length === 0) { //new user
                globalState.customers.push(msg.costumer)
            }else{
                onlineCostumerArr[0].sessionTopic = msg.costumer.sessionTopic //update the MQTT sessionTopic
                onlineCostumerArr[0].isOnline = true
            }
            manuh.publish(topics.costumerRadar.updates.global, msg.costumer)
        })

        manuh.subscribe(topics.costumerRadar.status.offline, "ChatStation", msg => {
            let onlineCostumerArr = globalState.customers.filter(c => c.id === msg.costumer.id)
            if (onlineCostumerArr.length === 0) { //new user
                globalState.customers.push(msg.costumer)
            }else{
                onlineCostumerArr[0].isOnline = false
            }
            manuh.publish(topics.costumerRadar.updates.global, msg.costumer)
        })
        // -- end of customers setup
    
    }   
}