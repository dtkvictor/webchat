export default {

    defaultPayload: (state) => ({      
        type: 'message',
        data: {
            id: state.users[state.currentChat.id].messages.length + 1000,
            from: state.id,
            to: state.currentChat.id,          
            hour: state.moment().format('HH:mm'),
            format: 'text',
        }      
    }),            
    
    connection(state) {
        return state.socket.readState
    }
    
}