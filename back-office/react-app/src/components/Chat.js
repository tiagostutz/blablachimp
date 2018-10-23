import React, { Component } from 'react'
import { attachModelToView } from 'rhelena'
import moment from 'moment'
import ChatModel from './Chat.model'
import CustomerDetails from './CustomerDetails'
import { 
    Avatar,
    Row,
    TextComposer,
    SendButton,
    TextInput,
    MessageList,
    Message,
    MessageGroup,
    MessageText
  } from '@livechat/ui-kit'
  
import { withI18n } from "react-i18next";
  
import '../i18n.js'
import './Chat.css'

class Chat extends Component {

    componentWillMount() {
        attachModelToView(new ChatModel(), this)
    }

    render() {
        
        if (!this.state.customer) {
            return <div className="chatView"></div>
        }    

        const { t } = this.props
        let messages = []
        let groupMessage = null
        this.state.customer.lastMessages.forEach(m => {
            if (!groupMessage || groupMessage.userId !== m.from.id) {
                groupMessage = {
                    userId: m.from.id,
                    avatarURL: m.from.avatarURL,
                    messages: []
                }
                messages.push(groupMessage)
            }
            if (m.dateTime)
            groupMessage.messages.push(m)
        })

        const lastSeenAtMoment = moment(this.state.customer.lastSeenAt)

        return (                        
            <div className="chatView">
                <header className="chatHeader">
                    <div className="headerLeft">
                        <div>
                            <Avatar letter={this.state.customer.avatarURL ? null : this.state.customer.name.substring(0,1)} imgUrl={this.state.customer.avatarURL ? this.state.customer.avatarURL : null} />
                        </div>
                        <div className={"headerTitle " + (this.state.customer.isOnline ? "customerOnline" : "customerOffline")}>
                            <h1>{this.state.customer.name}</h1>
                            <span>{ lastSeenAtMoment.calendar() }</span>
                        </div>
                    </div>
                    <div>
                        <div className="moreInfo" onClick={() => this.viewModel.toggleCustomerDetails()}>
                            <img src="/images/show-more.png" className={this.state.showCustomerDetails ? "active" : ""} alt="Info" />
                        </div>
                    </div>
                </header>
                <div className="chatBody">  
                    <div className="messageArea">
                        <MessageList  active containScrollInSubtree>

                            { 
                                messages.map((g,idx) => {
                                    return (
                                        <MessageGroup key={idx} onlyFirstWithMeta>
                                        {
                                            g.messages.map((m, ix) => {
                                                return (
                                                    <Message key={"gr_" + ix} date={moment(new Date(m.dateTime)).fromNow()} isOwn={m.from.id === this.state.loggedUser.id} authorName={m.from.name}>
                                                        <MessageText>
                                                            {m.content}
                                                        </MessageText>
                                                    </Message>
                                                )
                                            })
                                        }
                                        </MessageGroup>
                                        )
                                    })
                            }

                        </MessageList>
                        
                        <TextComposer onSend={(data) => this.viewModel.sendMessage(data)}>
                            <Row align="center">
                                <TextInput placeholder="Digite sua mensagem..." />
                                <SendButton fit />
                            </Row>
                        </TextComposer>
                    </div>              
                    <div className={`customerDetails ${this.state.showCustomerDetails ? "showCustomerDetails" : ""}`}>
                        <header>
                            <h1>{ t("About") }</h1>
                        </header>
                        <div className="body">
                            <CustomerDetails details={this.state.customer.details} />
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default withI18n()(Chat)