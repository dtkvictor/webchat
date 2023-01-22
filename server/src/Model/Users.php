<?php

namespace Dtk\Webchat\Model;

use stdClass;

class Users 
{
    protected $users = [];
    
    public function get():array
    {
        return $this->users;
    }  

    public function find(int $resourceId):object
    {        
        return $this->users[$resourceId];        
    }     

    public function exists(int $resourceId):bool
    {
        return isset($this->users[$resourceId]);
    }
    
    public function add(object $conn, string $name, string $image = null):array
    {
        $resourceId = $conn->resourceId; 

        if(!$this->exists($resourceId) || !empty($name)) {            
            $this->users[$resourceId] = new stdClass;
            $this->users[$resourceId]->conn = $conn;            
            $this->users[$resourceId]->lastMessageTime = time();
            $this->users[$resourceId]->messagesPerSecond = 0;

            $this->users[$resourceId]->data = [                
                'id' => $resourceId,
                'name' => $name,
                'image' => $image
            ];          

            return $this->users[$resourceId]->data;
        }
        return [];
    }    

    public function update(int $resourceId, string $field, string $value):bool
    {
        if(!$this->exists($resourceId) || $field === 'id') return false;       
        if(!array_key_exists($field, $this->users[$resourceId]->data)){
            return false;
        }         
        $this->users[$resourceId]->data[$field] = $value;
        return true;
    }

    public function remove(int $resourceId):void
    {        
        unset($this->users[$resourceId]);       
    }

    public function updateLastMessageTime(int $resourceId):void 
    {        
        $this->users[$resourceId]->lastMessageTime = time();        
    }

    public function incrementMessagesPerSecond(int $resourceId):void 
    {
        $this->users[$resourceId]->messagesPerSecond ++;        
    }

    public function resetMessagesPerSecond(int $resourceId):void 
    {        
        $this->users[$resourceId]->messagesPerSecond = 0;       
    }    
}