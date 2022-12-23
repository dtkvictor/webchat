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

    public function add(object $conn, int $resourceId, string $name, string $image):void
    {
        if(!isset($this->users[$resourceId])){            
            $this->users[$resourceId] = new stdClass;
            $this->users[$resourceId]->conn = $conn;
            $this->users[$resourceId]->data = [                
                'id' => $resourceId,
                'name' => $name,
                'image' => $image
            ];             
        }
    }    

    public function remove(int $resourceId):void
    {
        if(isset($this->users[$resourceId])) {
            unset($this->users[$resourceId]);
        }        
    }

}