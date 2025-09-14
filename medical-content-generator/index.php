<?php
if ($_POST['topic']) {
    $topic = $_POST['topic'];
    
    // Hugging Face API call
    $api_url = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';
    $api_key = 'YOUR_HUGGING_FACE_API_KEY'; // Replace with actual API key
    
    $data = [
        'inputs' => "Write a comprehensive, halal-compliant medical article about: " . $topic . ". Include evidence-based information, safety considerations, and practical advice. Keep it professional and accurate.",
        'parameters' => [
            'max_length' => 500,
            'temperature' => 0.7
        ]
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $api_key,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $result = json_decode($response, true);
    $generated_content = $result[0]['generated_text'] ?? 'Error generating content';
    
    // Create 50-word summary
    $summary = substr($generated_content, 0, 300) . '...';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medical Content Generator - VitaPulse</title>
    <link rel="stylesheet" href="/assets/css/vitapulse-clinical.css">
</head>
<body>
    <div class="container">
        <h1>AI Medical Content Generator</h1>
        <div class="card">
            <form method="POST">
                <label for="topic">Medical Topic:</label>
                <input type="text" id="topic" name="topic" placeholder="e.g., Diabetes management, Heart health, Nutrition" required>
                <button type="submit">Generate Content</button>
            </form>
        </div>
        
        <?php if (isset($generated_content)): ?>
        <div class="card">
            <h2>Generated Article</h2>
            <p><?php echo htmlspecialchars($generated_content); ?></p>
        </div>
        
        <div class="card">
            <h2>Smart Summary (50 words)</h2>
            <p><?php echo htmlspecialchars($summary); ?></p>
        </div>
        <?php endif; ?>
    </div>
</body>
</html>
