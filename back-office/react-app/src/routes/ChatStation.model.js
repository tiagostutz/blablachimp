import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import topics from '../topics'
import chatServices from '../services/chatServices'
import attendantTypes from '../attendant-types'

import debugLib from 'debug'
const debug = debugLib('debug-model-chatStation')

export default class ChatStationModel extends RhelenaPresentationModel {
    constructor() {
        super();

        globalState.loggedUser = {
            id: "10",
            email: "john@smiht.com",
            name: "John Smith",
            avatarURL: "https://st2.depositphotos.com/3369547/11899/v/950/depositphotos_118998210-stock-illustration-woman-glasses-female-avatar-person.jpg",
            type: attendantTypes.support.firstLevel
        }

        globalState.sessions = [] //initialize variable

        chatServices.startService(globalState.loggedUser, async () => {
            debug("Chat Service started from ChatStationModel")

            //initialize sessions
            globalState.sessions = await chatServices.getAttendantSessions(globalState.loggedUser.id)
            if (globalState.sessions.length > 0) {
                manuh.publish(topics.sessions.updates, globalState.sessions[0])
            }

            // update globalState customer list
            manuh.unsubscribe(topics.sessions.updates, "ChatStation")
            manuh.subscribe(topics.sessions.updates, "ChatStation", session => {            
                let currentSessionsArr = globalState.sessions.filter(s => s.sessionTopic === session.sessionTopic)
                if (currentSessionsArr.length === 0) { //new user
                    globalState.sessions.push(session)
                }else{
                    // replace the customer in the global list with the received one
                    globalState.sessions = globalState.sessions.map(s => s.sessionTopic === session.sessionTopic ? session : s)
                }
            })
            // -- end of customers setup
            
        })
    
    }   
}