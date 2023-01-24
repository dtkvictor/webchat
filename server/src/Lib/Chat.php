<?php

namespace Dtk\Webchat\Lib;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Dtk\Webchat\Controller\MessageController;

class Chat implements MessageComponentInterface 
{                
    private MessageController $message;

    public function __construct()
    {
        $this->message = new MessageController();     
    }

    public function onOpen(ConnectionInterface $conn) {
        $conn->send($this->message->defaultPayload('success', [
            'type' => 'success',
            'message' => 'successful connection'
        ]));
    }   

    public function onMessage(ConnectionInterface $conn, $msg) 
    {
        $this->message->set($msg);
        $this->message->from($conn);            
        $this->message->run();        
    }

    public function onClose(ConnectionInterface $conn) 
    {
        $this->message->unconnected($conn->resourceId);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) 
    {
        $conn->send($this->message->defaultPayload('error', [
            'code' => $e->getCode(),
            'message' => $e->getMessage()
        ]));                    
        $conn->close();
        echo $e->getMessage().'\n';
    }

}