import Helpers from '@/support/helpers'
import moment from 'moment'
import iziToast from 'izitoast'
moment.locale('pt-br')

export default {
    websocketUrl: 'ws://localhost:8888',
    socket: null,
    onmessage: null,
    onerror: null,
    connectionState: null,    
    
    id: null,
    name: null,
    image: null,
  
    currentChat: null,                    
    users: new Object(), 
    amountUsers: 0,         
    
    sendByEnter: false,    
    showNotification: true,

    helpers: new Helpers(), 
    moment: moment,
    iziToast: iziToast   
    
}