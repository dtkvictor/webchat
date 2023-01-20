import Helpers from '@/support/helpers'
import moment from 'moment'
import iziToast from 'izitoast'
moment.locale('pt-br')

export default {
    
    socket: new WebSocket('ws://localhost:8888'),
    
    id: null,
    name: null,
    image: null,
  
    currentChat: null,                    
    users: new Object(),          
    
    sendByEnter: false,    
    showNotification: true,

    helpers: new Helpers(), 
    moment: moment,
    iziToast: iziToast   
    
}