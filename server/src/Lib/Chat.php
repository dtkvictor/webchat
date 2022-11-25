<?php
namespace Dtk\Webchat\Lib;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface 
{
    protected $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) 
    {
        $this->clients->attach($conn);
        print_r($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg) 
    {
        //debug
        foreach ($this->clients as $client) {
            if ($from !== $client) {            
                $client->send($msg);
            }
        }
    }

    public function onClose(ConnectionInterface $conn) 
    {
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) 
    {
        echo $e->getMessage();
        $conn->close();
    }

}