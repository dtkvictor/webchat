<?php

namespace Dtk\Webchat\Validation;

class MessageValidation
{
    private array $feedback;
    private array $payload;        
    
    private array $payloadStructure = [
        'type', 'data'
    ];
    
    private array $supportedType = [        
        'text' => ['from', 'to', 'value'],
        'file' => ['from', 'to', 'type', 'value'],                                                
        'multipart' => ['from', 'to', 'type', 'amount','current','value'],                                                
        'newConnection' => ['name', 'image'],
    ];               

    public function set(array $payload):void
    {                    
        $this->payload = $payload;
    }    

    /**
     * Execute validation methods
    */
    public function run():void
    {
        /**
         * Must follow this order
        */        
        if (!$this->isValidPayload()) {
            $this->feedback['payload'] = 'The structure does not match';       
                             
        } else if (!$this->isValidMessageType()) {
            $this->feedback['payload'] = 'Undefined or invalid type';
            
        } else if (!$this->isValidMessageData()) {
            $this->feedback['payload'] = 'Undefined or invalid data';
        }                       
    }

    /**
     * Check if there was any validation
     * Obs: Execute after method "run"
    */
    public function isValid():bool
    {
        if(empty($this->feedback)) {
            return true;
        }
        return false;
    }

    /** 
     * Return the feedback list
    */
    public function feedback():array
    {
        return $this->feedback;
    }

    private function isValidPayload():bool
    {              
        foreach($this->payloadStructure as $key) {                        
            if(!isset($this->payload[$key])) {
                return false;
            }
        }
        return true;
    }

    private function isValidMessageType():bool
    {        
        $type = $this->payload['type'];                
        print_r($type);                
        if(empty($type) || !isset($this->supportedType[$type])) {
            return false;
        }
        return true;
    }

    private function isValidMessageData():bool
    {
        $type = $this->payload['type'];                                
        $data = $this->payload['data'];                                
        foreach($this->supportedType[$type] as $key) {
            if(!isset($data[$key]) || empty($data[$key])) {
                return false;
            }
        }        
        return true;
    }

}