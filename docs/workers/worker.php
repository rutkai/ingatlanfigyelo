<?php

$TOKEN = 'REDACTED';

$requestBody = file_get_contents('php://input');

if (!$requestBody) {
    http_response_code(400);
    echo "No payload!";
    exit;
}

$data = json_decode($requestBody, true);

if (!$data) {
    http_response_code(400);
    echo "Invalid payload!";
    exit;
}

if (empty($data['token']) || $data['token'] !== $TOKEN) {
    http_response_code(403);
    echo "Unauthorized!";
    exit;
}

if (empty($data['url'])) {
    http_response_code(400);
    echo "Missing URL!";
    exit;
}

$opts = [
        'http'=> [
        'method' => "GET",
        'header' => "Accept-language: en\r\n" .
                    "Cache-Control: max-age=0" .
                    "User-Agent: Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3250.0 Iron Safari/537.36"
    ]
];

$context = stream_context_create($opts);

// Open the file using the HTTP headers set above
$response = file_get_contents($data['url'], false, $context);
if ($response) {
    $responseBody = [
        "data" => $response,
    ];
} else {
    http_response_code(400);
    $responseBody = [
        "error" => "Unable to perform request!",
    ];
}

echo json_encode($responseBody);
exit;
