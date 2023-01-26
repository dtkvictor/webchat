<?php

namespace Dtk\Webchat\Validation;

class MessageValidation
{
    private string $feedback;
    private array $payload;        
    
    private array $payloadStructure = [
        'type', 'data'
    ];
    
    private array $supportedType = [                                                                
        'message' => ['id', 'from', 'to', 'format', 'value', 'hour'],         
        'edit' => ['id', 'from', 'to', 'value'],         
        'delete' => ['id', 'from', 'to'],         
        'update' => ['from', 'field', 'value'],
        'connection' => ['name']        
    ];                       



    private array $supportedDataType = [        
        'connection' => ['string', 'null'],    
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
            $this->feedback = 'The structure does not match';       
                             
        } else if (!$this->isValidMessageType()) {
            $this->feedback = 'Undefined or invalid type';
            
        } else if (!$this->isValidMessageData()) {
            $this->feedback = 'Undefined or invalid data';

        } else if (!$this->isValidTypeData()) {
            $this->feedback = 'The given data type is not supported';
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
    public function feedback():string
    {
        $error = $this->feedback;
        $this->feedback = "";
        return $error;
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
            if(!isset($data[$key])) {
                return false;
            }
        }
                
        return true;
    }

    private function isValidTypeData():bool
    {
        $type = $this->payload['type'];                                
        $data = $this->payload['data'];                          

        if(isset($this->supportedDataType[$type])) {
            $supportedDataType = $this->supportedDataType[$type];            
            foreach($data as $value) {                  
                $fieldDataType = strtolower(gettype($value));                
                if(!in_array($fieldDataType, $supportedDataType)) {
                    return false;
                }                
            }

        }                    
        return true; 
    }
}