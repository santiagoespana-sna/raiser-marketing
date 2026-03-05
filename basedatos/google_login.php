<?php
require 'vendor/autoload.php';
require("conexion.php");

session_start();

$client = new Google_Client();
$client->setClientId('TU_CLIENT_ID');
$client->setClientSecret('TU_CLIENT_SECRET');
$client->setRedirectUri('http://localhost/base_de_datos/google_login.php');
$client->addScope("email");
$client->addScope("profile");

if (!isset($_GET['code'])) {

    $auth_url = $client->createAuthUrl();
    header('Location: ' . $auth_url);
    exit();

} else {

    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($token);

    $oauth = new Google_Service_Oauth2($client);
    $userInfo = $oauth->userinfo->get();

    $nombre = $userInfo->name;
    $correo = $userInfo->email;

    $sql = "SELECT * FROM usuarios WHERE correo='$correo'";
    $resultado = $conn->query($sql);

    if ($resultado->num_rows == 0) {
        $sql = "INSERT INTO usuarios (nombre, correo)
                VALUES ('$nombre', '$correo')";
        $conn->query($sql);
    }

    $_SESSION['usuario'] = $nombre;

    header("Location: index.php");
}
?>