<?php
$servidor = "127.0.0.1";
$usuario = "root";
$clave = "";
$base_datos = "sistema_login";
$puerto = 3307;

$conn = new mysqli($servidor, $usuario, $clave, $base_datos, $puerto);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>