export function removeHtmlTags(str) 
{        
    if(!str) return false;
    return str.replace(/(<([^>]+)>)/ig, '')
}

export function renderByFormat(format, value) 
{   
    switch(format) {
        case 'image':     
            return `<img src=${value}>`                        
        case 'video':
            return `<video controls src=${value}></video>`                    
        case 'audio':
            return `<audio controls src=${value}></audio`                        
        default:
            return removeHtmlTags(value)
    }
}

export function binaryToUrlBase64(binary) 
{
    const fileReader = new FileReader()                    
    return new Promise(resolve => {        
        fileReader.onload = (data) => resolve(data.target.result)                                                                     
        fileReader.readAsDataURL(binary)        
    })
}