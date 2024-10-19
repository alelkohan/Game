<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $score = intval($_POST["score"]);

    // Simpan skor ke file (misalnya skor.txt)
    $file = 'score.txt';
    file_put_contents($file, "Skor terakhir: $score\n", FILE_APPEND);

    echo "Skor disimpan!";
}
