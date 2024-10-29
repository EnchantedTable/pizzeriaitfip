<?php
// Configuración de conexión a la base de datos
$servername = "localhost";
$username = "root"; // Usuario por defecto de MySQL
$password = ""; // Sin contraseña
$dbname = "pizzeria"; // Cambia esto por tu nombre de base de datos

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificación de conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener datos del formulario
$mesa = $_POST['mesa'];
$pizza = $_POST['pizza'];
$cantidad = $_POST['cantidad'];
$metodo_pago = $_POST['metodo_pago'];

// Aquí puedes calcular el precio según el tipo de pizza y cantidad
$precioPorPizza = 10; // Precio por pizza (ajusta según tus necesidades)
$total = $precioPorPizza * $cantidad;

// Guardar el pedido en la base de datos
$sql = "INSERT INTO pedidos (mesa, pizza, cantidad, metodo_pago, total) VALUES ('$mesa', '$pizza', '$cantidad', '$metodo_pago', '$total')";
if ($conn->query($sql) === TRUE) {
    $pedidoGuardado = true; // Se ha guardado el pedido
} else {
    $pedidoGuardado = false; // No se ha guardado el pedido
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido Realizado</title>
    <link rel="stylesheet" href="styles.css"> <!-- Enlace al CSS -->
</head>
<body>
    <div class="form-container">
        <h2>Estado del Pedido</h2>
        <div class="success-message">
            <?php if (isset($pedidoGuardado) && $pedidoGuardado): ?>
                <img src="exito.png" alt="Éxito" class="check-icon">
                <p>Tu pedido ha sido realizado exitosamente.</p>
                <a href="index.html" class="button">Volver al inicio</a>
            <?php else: ?>
                <p>Hubo un error al realizar tu pedido. Por favor, intenta nuevamente.</p>
                <a href="index.html" class="button">Volver al inicio</a>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
