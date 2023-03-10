export default class {
    
    removeHtmlTags(str) 
    {        
        if(!str) return false;
        return str.replace(/(<([^>]+)>)/ig, '').trim()
    }

    renderByFormat(format, value) 
    {           
        switch(format) {
            case 'image':     
                return `<img src=${value}>`                        
            case 'video':
                return `<video controls src=${value}></video>`                    
            case 'audio':
                return `<audio controls src=${value}></audio`                        
            default:
                return this.removeHtmlTags(value)
        }
    }

    notificationByFormat(format, value) 
    {
        if (format !== "text") {
            return `<span class="material-icons">file_open</span> ${format}`;
        }
        return this.removeHtmlTags(value);
    }

    binaryToUrlBase64(binary) 
    {
        const fileReader = new FileReader()                    
        return new Promise(resolve => {        
            fileReader.onload = (data) => resolve(data.target.result)                                                                     
            fileReader.readAsDataURL(binary)        
        })
    }

    defaultDataNotificationToats() 
    {
        return {
            image: null,
            title: null,                     
            message: null,          
            imageWidth: 100,
            titleLineHeight: '25',                 
            messageLineHeight: '25',                                                   
            position: 'topCenter',  
            timeout: 5000,        
        }        
    }
        
}