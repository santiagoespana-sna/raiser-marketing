<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nombre = $_POST["nombre"];
    $correo = $_POST["correo"];
    $password = $_POST["password"];

    $sql = "INSERT INTO usuarios (nombre, correo, password)
            VALUES ('$nombre', '$correo', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "Usuario registrado correctamente";
    } else {
        echo "Error: " . $conn->error;
    }

    $conn->close();
}
?>