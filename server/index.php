<?php
require __DIR__.'/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Dtk\Webchat\Lib\Chat;

$websocket = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),8888
);

echo "Websocket start running at http://localhost:8888\n";
$websocket->run();
