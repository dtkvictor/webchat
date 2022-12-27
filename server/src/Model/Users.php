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
        if(isset($this->users[$resourceId])){
            return $this->users[$resourceId];
        }        
        return new stdClass;
    }     

    public function exists(int $resourceId):bool
    {
        return isset($this->users[$resourceId]);
    }

    public function add(object $conn, int $resourceId, string $name, string $image = null):void
    {
        if(!isset($this->users[$resourceId])){            
            
            $this->users[$resourceId] = new stdClass;
            $this->users[$resourceId]->send = $conn->send;            
            $this->users[$resourceId]->lastMessageTime = time();
            $this->users[$resourceId]->messagesPerSecond = 0;

            $this->users[$resourceId]->data = [                
                'id' => $resourceId,
                'name' => $name,
                'image' => $image
            ];             
        }
    }    

    public function updateLastMessageTime(int $resourceId):void 
    {
        if($this->exists($resourceId)) {
            $this->users[$resourceId]->lastMessageTime = time();
        }
    }

    public function resetMessagesPerSecond(int $resourceId):void 
    {
        if($this->exists($resourceId)) {
            $this->users[$resourceId]->messagesPerSecond = 0;
        }
    }

    public function remove(int $resourceId):void
    {
        if($this->exists($resourceId)) {
            unset($this->users[$resourceId]);
        }        
    }

}