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
    private array $message;                

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
        
        if(!$this->messageValidation->isValid()) {          
            throw new Exception($this->messageValidation->feedback(), 1007);                                    
        }                       
        
        if($this->users->exists($this->from->resourceId)) {
            $this->checkMessageOrigin();
            $this->checkSpam();
        }
        
        $runTheMethodByType = $this->message['type'];        

        if(method_exists($this, $runTheMethodByType)){
            $this->$runTheMethodByType();             
        }else {
            $this->message();
        }        
        
        $this->message = [];
    }    
    
    private function message():void
    {            
        $user = $this->users->find($this->message['data']['to']);
        if(isset($this->message['data']['value'])) {
            $this->message['data']['value'] = strip_tags($this->message['data']['value']);             
        }        
        if(isset($user->conn)) {            
            $user->conn->send(json_encode($this->message));
        }        
    }

    private function update():void 
    {        
        $this->message['data']['value'] = strip_tags($this->message['data']['value']);    

        if( $this->users->update (
            $this->from->resourceId, 
            $this->message['data']['field'], 
            $this->message['data']['value'] )
        ) {        
            foreach($this->users->get() as $user) {                
                if($user->data['id'] !== $this->from->resourceId) {
                    $user->conn->send(json_encode($this->message));
                }                
            }
        }


    }

    private function connection():void
    {   
        $listUsers = array();

        $newUser = $this->users->add(
            $this->from,            
            $this->message['data']['name'],
            $this->message['data']['image']
        );           

        if(empty($newUser)) throw new Exception('Failed to register user', 1007);                                                            

        foreach($this->users->get() as $user) {                    
            if($user->data['id'] !== $newUser['id']) {
                $listUsers[] = $user->data;
                $user->conn->send($this->defaultPayload('connected', $newUser));            
            }               
        }

        $this->from->send($this->defaultPayload('registered', [
            'id' => $this->from->resourceId,
            'users' => $listUsers            
        ]));                       
    }

    /**
     * Notifies a disconnection
     * server message
     */

    public function unconnected(int $userId):void
    {
        if($this->users->exists($userId)) {
            $this->users->remove($userId);
            foreach($this->users->get() as $user) {
                $user->conn->send($this->defaultPayload('unconnected', ['id'=>$userId]));            
            }
        }        
    }    

    private function checkMessageOrigin():void
    {        
        if (
            (!$this->users->exists($this->from->resourceId)) ||
            ($this->from->resourceId !== $this->message['data']['from'])
        ) {            
            throw new Exception('User integrity violation', 0000);                        
        }                 
    }

    private function checkSpam():void
    {                
        $user = $this->users->find($this->from->resourceId);
        $maxMessagePerSecond = 10;
        $messageInterval = $user->lastMessageTime + 60;
        $currentTime = time();

        if($messageInterval <= $currentTime && $user->messagesPerSecond >= $maxMessagePerSecond) {                
            throw new Exception('Many messages in a short period of time', 1013);    

        }else if($messageInterval >= $currentTime) {
            $this->users->updateLastMessageTime($user->data['id']);    
            $this->users->resetMessagesPerSecond($user->data['id']);

        }else{
            $this->users->incrementMessagesPerSecond($user->data['id']);
        }            
    }
    
}