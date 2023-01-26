<?php
require __DIR__.'/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Dtk\Webchat\Lib\Chat;

$port = 8888;
$websocket = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ), $port
);

echo "Websocket start \n- listening on: http://localhost:$port\n";
$websocket->run();
