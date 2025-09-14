<?php
session_start();

// Simple authentication check
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    if ($_POST['password'] === 'vitapulse2024') {
        $_SESSION['authenticated'] = true;
    } else {
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pro Calculators Access - VitaPulse</title>
            <link rel="stylesheet" href="/assets/css/vitapulse-clinical.css">
        </head>
        <body>
            <div class="container">
                <h1>Professional Calculators Access</h1>
                <div class="card">
                    <form method="POST">
                        <label for="password">Enter Access Code:</label>
                        <input type="password" id="password" name="password" required>
                        <button type="submit">Access Pro Calculators</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
        <?php
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Calculators - VitaPulse</title>
    <link rel="stylesheet" href="/assets/css/vitapulse-clinical.css">
</head>
<body>
    <div class="container">
        <h1>Professional Medical Calculators</h1>
        <div class="card">
            <h2>Available Calculators:</h2>
            <ul>
                <li><a href="gfr.html">GFR Calculator</a></li>
                <li><a href="cha2ds2-vasc.html">CHA2DS2-VASc Score</a></li>
                <li><a href="apache-ii.html">APACHE II Score</a></li>
                <li><a href="anion-gap.html">Anion Gap Calculator</a></li>
                <li><a href="qtc.html">QTc Calculator</a></li>
                <li><a href="meld.html">MELD Score</a></li>
                <li><a href="bsa.html">Body Surface Area (BSA)</a></li>
                <li><a href="framingham.html">Framingham Risk Score</a></li>
                <li><a href="abg.html">ABG Analyzer</a></li>
                <li><a href="drug-dosage.html">Drug Dosage Calculator</a></li>
            </ul>
        </div>
    </div>
</body>
</html>
