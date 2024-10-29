<?php


// Obtener datos del formulario
$mesa = $_POST['mesa'];
$pizza = $_POST['pizza'];
$cantidad = $_POST['cantidad'];

// Definir precios de las pizzas
$precios = [
    "Margarita" => 8.00,
    "Pepperoni" => 10.00,
    "Cuatro Quesos" => 12.00
];

// Calcular el total
$total = $precios[$pizza] * $cantidad;

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmar Pedido</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="form-container">
        <h2>Confirmar Pedido</h2>
        <p>Número de Mesa: <?php echo $mesa; ?></p>
        <p>Tipo de Pizza: <?php echo $pizza; ?></p>
        <p>Cantidad: <?php echo $cantidad; ?></p>
        <p>Total: $<?php echo number_format($total, 2); ?></p>

        <form action="guardar_pedido.php" method="POST">
            <input type="hidden" name="mesa" value="<?php echo $mesa; ?>">
            <input type="hidden" name="pizza" value="<?php echo $pizza; ?>">
            <input type="hidden" name="cantidad" value="<?php echo $cantidad; ?>">
            <input type="hidden" name="total" value="<?php echo $total; ?>">

            <label for="metodo_pago">Método de Pago:</label>
            <select id="metodo_pago" name="metodo_pago" required>
                <option value="">Seleccione un método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
            </select>

            <button type="submit">Confirmar y Guardar Pedido</button>
        </form>
    </div>
</body>
</html>
