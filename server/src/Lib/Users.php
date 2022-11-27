<?php
namespace Dtk\Webchat\Lib;

class Users 
{
    protected $users;

    public function __construct()
    {
        $this->users = new \SplObjectStorage;
    }

    
}