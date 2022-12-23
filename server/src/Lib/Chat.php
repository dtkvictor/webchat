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

    public function onOpen(ConnectionInterface $conn) {}   

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
        $this->message->internalError($e->getMessage());
        echo $e->getMessage();
        $conn->close();
    }

}