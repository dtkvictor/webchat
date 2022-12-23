<?php

namespace Dtk\Webchat\Controller;

use Dtk\Webchat\Model\Users;
use Dtk\Webchat\Validation\MessageValidation;
use Exception;

/**
* Controla o fluxo das mensagens 
*/

class MessageController {

    private MessageValidation $messageValidation;
    private Users $users;        

    private object $from;
    private array $message = [];                

    public function __construct()
    {
        $this->messageValidation = new MessageValidation();    
        $this->users = new Users();        
    }            
    
    public function from(object $user):void
    {
        $this->from = $user;
    }

    public function defaultPayload(string $type, $data):string
    {
        return json_encode([            
            'type' => $type,
            'data' => $data,
        ]);
    }

    public function set($message):void
    {
        $message = json_decode($message, true);
        if(!empty($message)){            
            $this->message = $message;
        }                                                        
    }            

    public function removeUser($userId):void
    {
        $this->users->remove($userId);

        foreach($this->users->get() as $user) {
            $user->conn->send(
                $this->defaultPayload('unconnected', $userId)
            );            
        }
    }

    public function run():void
    {
        $this->messageValidation->set($this->message);        
        $this->messageValidation->run();
        
        if(!$this->messageValidation->isValid()){            
            $this->from->send($this->defaultPayload('error',[
                'status' => 1007,
                'error' => $this->messageValidation->feedback()
            ]));
            return;
        }            
                
        switch($this->message['type']) {
            case 'connection':
                $this->connection();
                break;
            case 'disconnect':
                $this->unconnected($this->from->resourceId);
                break;
            default:
                $this->message();
                break;
        }          
    }
    
    private function message():void
    {
        $user = $this->users->find($this->message['data']['to']);
        $this->message['data']['value'] = 
            filter_var($this->message['data']['value'], FILTER_SANITIZE_SPECIAL_CHARS);            
        if(isset($user->conn)) {            
            $user->conn->send(json_encode($this->message));
        }        
    }

    private function connection():void
    {
        if($this->users->exists($this->from->resourceId)) return;

        $newUser = [            
            'id' => $this->from->resourceId,
            'name' => $this->message['data']['name'],
            'image' => $this->message['data']['image'] ? $this->message['data']['image'] : ""
        ];        
        
        $users = [];                
        
        foreach($this->users->get() as $user) {              
            $users[] = $user->data;
            $user->conn->send($this->defaultPayload('connected', $newUser));            
        }

        $this->from->send($this->defaultPayload('success', [
            'id' => $this->from->resourceId,
            'users' => $users            
        ]));        

        $this->users->add($this->from, $newUser['id'], $newUser['name'], $newUser['image']);        
    }

    /**
     * Notifies a disconnection
     * server message
     */

    public function unconnected(int $userId):void
    {
        $this->users->remove($userId);
        foreach($this->users->get() as $user) {
            $user->conn->send($this->defaultPayload('unconnected', ['id'=>$userId]));            
        }
    }

    public function internalError(string $message):void
    {
        foreach($this->users->get() as $user) {
            $user->conn->send($this->defaultPayload('error', [
                'status' => 1011,
                'errors' => $message
            ]));            
        }
    }


}