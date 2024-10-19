let score = 0;
let totalScore = 0; // Tambahkan ini untuk menyimpan skor total
let level = 1;
let wrongAnswerCount = 0; // Tambahkan ini untuk menghitung jumlah jawaban salah
let num1 = 0;
let num2 = 0;
let num3 = 0;  // Deklarasi num3 secara global
let num4 = 0;  // Deklarasi num4 secara global
let operation = '';
let maxLevel = 10;
let gameFinished = false;
let timer; // Variabel untuk timer
let timeLeft = 30; // Waktu untuk setiap pertanyaan dalam detik

// Ambil mode dari URL
function getModeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mode');
}

function showAnswer() {
    let correctAnswer;

    switch (operation) {
        case 'penjumlahan':
            correctAnswer = num1 + num2 + (num3 || 0) + (num4 || 0);
            break;
        case 'pengurangan':
            correctAnswer = num1 - num2 - (num3 || 0) - (num4 || 0);
            break;
        case 'perkalian':
            correctAnswer = num1 * num2 * (num3 || 1) * (num4 || 1);
            break;
        case 'pembagian':
            if (num2 !== 0) {
                correctAnswer = num1 / num2;
                if (num3 !== 0) {
                    correctAnswer /= num3;
                    if (num4 !== 0) {
                        correctAnswer /= num4;
                    }
                }
            } else {
                correctAnswer = NaN; // Atau bisa menggunakan nilai lain yang menandakan kesalahan
            }
            break;
    }

    // Tampilkan jawaban yang benar di area feedback
    document.getElementById("feedback").textContent = `Jawaban benar: ${correctAnswer}`;
}

function startGame() {
    operation = getModeFromUrl();
    document.getElementById("mode-title").textContent = `Mode: ${capitalizeFirstLetter(operation)}`;

    console.log(operation);
    // Cek apakah ada data level yang tersimpan
    const savedData = JSON.parse(localStorage.getItem("savedGameData")) || {};
    if (savedData[operation]) {
        level = savedData[operation].level;
        score = savedData[operation].score;
    }

    document.getElementById("level").textContent = `Level: ${level}`;
    document.getElementById("score").textContent = score;
    
    const savedTime = localStorage.getItem(`${operation}-timeLeft`);
    if (savedTime) {
        timeLeft = parseInt(savedTime); // Gunakan waktu tersimpan
    } else {
        // Tetapkan waktu awal berdasarkan mode permainan
        switch (operation) {
            case 'penjumlahan':
                timeLeft = 120; // 2 menit
                break;
            case 'pengurangan':
                timeLeft = 180; // 3 menit
                break;
            case 'perkalian':
                timeLeft = 240; // 4 menit
                break;
            case 'pembagian':
                timeLeft = 300; // 5 menit
                break;
            default:
                timeLeft = 60; // Default 1 menit jika mode tidak dikenal
        }
    }
    
    startTimer(); // Mulai timer saat permainan dimulai
    generateQuestion();
}

function startTimer() {
    updateTimerDisplay(); // Tampilkan waktu awal

    timer = setInterval(() => {
        timeLeft--;
        localStorage.setItem(`${operation}-timeLeft`, timeLeft); // Simpan waktu yang tersisa ke localStorage
        updateTimerDisplay(); // Perbarui tampilan waktu setiap detik

        if (timeLeft <= 0) {
            clearInterval(timer); // Hentikan timer
            localStorage.removeItem(`${operation}-timeLeft`); // Hapus waktu tersimpan ketika waktu habis
            finishGame();
        }
    }, 1000); // Timer berkurang setiap detik
}

// Fungsi untuk memperbarui tampilan waktu dengan format 00:00 (menit:detik)
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60); // Hitung menit
    const seconds = timeLeft % 60; // Hitung detik

    // Format dengan menambahkan 0 di depan jika hanya 1 digit
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    document.getElementById("timer").textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function generateQuestion() {
    if (gameFinished) return; // Jika game sudah selesai, hentikan generate question
    
    let maxNumber = level * 10;

    // let numbers = [];
    // let num1, num2, num3, num4;

    // Jumlah angka bertambah sesuai level
    if (level <= 4) {
        // Soal menggunakan 2 angka
        num1 = Math.floor(Math.random() * maxNumber);
        num2 = Math.floor(Math.random() * maxNumber);
    } else if (level <= 9) {
        // Soal menggunakan 3 angka
        num1 = Math.floor(Math.random() * maxNumber);
        num2 = Math.floor(Math.random() * maxNumber);
        num3 = Math.floor(Math.random() * maxNumber);
    } else {
        // Level 10 ke atas menggunakan 4 angka
        num1 = Math.floor(Math.random() * maxNumber);
        num2 = Math.floor(Math.random() * maxNumber);
        num3 = Math.floor(Math.random() * maxNumber);
        num4 = Math.floor(Math.random() * maxNumber);
    }

    switch (operation) {
        case 'penjumlahan':
            if (level <= 4) {
                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} + ${num2}?`;
            } else if (level <= 9) {
                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} + ${num2} + ${num3}?`;
            } else {
                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} + ${num2} + ${num3} + ${num4}?`;
            }
            break;
        case 'pengurangan':
            if (level <= 4) {
                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} - ${num2}?`;
            } else if (level <= 9) {
                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} - ${num2} - ${num3}?`;
            } else {
                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} - ${num2} - ${num3} - ${num4}?`;
            }
            break;
        case 'perkalian':
            if (level <= 4) {
                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} x ${num2}?`;
            } else if (level <= 9) {
                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} x ${num2} x ${num3}?`;
            } else {
                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} x ${num2} x ${num3} x ${num4}?`;
            }
            break;
        case 'pembagian':
            // Level 1-4: Pembagian dua angka
            if (level <= 4) {
                // Pastikan num1 lebih besar dan bisa dibagi dengan num2 tanpa desimal
                num1 = Math.floor(Math.random() * maxNumber) + 1; // Hindari angka 0
                num2 = Math.floor(Math.random() * num1) + 1; // num2 selalu lebih kecil atau sama dengan num1
                num1 = num1 * num2; // Biar num1 pasti bisa dibagi oleh num2
            
                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} ÷ ${num2}?`;
            }
            // Level 5-9: Pembagian tiga angka
            else if (level <= 9) {
                num3 = Math.floor(Math.random() * num2) + 1;
                num1 = Math.floor(Math.random() * maxNumber) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                num1 = num1 * num2 * num3; 

                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} ÷ ${num2} ÷ ${num3}?`;
            }
            // Level 10 ke atas: Pembagian empat angka
            else {
                num3 = Math.floor(Math.random() * num2) + 1;
                num4 = Math.floor(Math.random() * num3) + 1; 
                num1 = Math.floor(Math.random() * maxNumber) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                num1 = num1 * num2 * num3 * num4; 

                document.getElementById("question").textContent = `Berapa hasil dari: ${num1} ÷ ${num2} ÷ ${num3} ÷ ${num4}?`;
            }
            break;
        }

    document.getElementById("answer").value = "";
    document.getElementById("feedback").textContent = "";
}

function checkAnswer() {
    if (gameFinished) return; // Jika game sudah selesai, hentikan pemeriksaan jawaban

    const userAnswer = parseFloat(document.getElementById("answer").value);
    let correctAnswer;

    switch (operation) {
        case 'penjumlahan':
            correctAnswer = num1 + num2 + (num3 || 0) + (num4 || 0);
            break;
        case 'pengurangan':
            correctAnswer = num1 - num2 - (num3 || 0) - (num4 || 0);
            break;
        case 'perkalian':
            correctAnswer = num1 * num2 * (num3 || 1) * (num4 || 1);
            break;
        case 'pembagian':
            if (num2 !== 0) {
                correctAnswer = num1 / num2;
                if (num3 !== 0) {
                    correctAnswer /= num3;
                    if (num4 !== 0) {
                        correctAnswer /= num4;
                    }
                }
            } else {
                correctAnswer = NaN; // Atau bisa menggunakan nilai lain yang menandakan kesalahan
            }
            break;
    }

    if (userAnswer === correctAnswer) {
        score += 1; // Tambahkan 10 poin untuk jawaban benar
        document.getElementById("feedback").textContent = "Jawaban Anda benar!";
        document.getElementById("score").textContent = score; // Tampilkan skor saat ini
        level++; // Naikkan level setelah jawaban benar
        
        // Simpan data game di localStorage
        let savedData = JSON.parse(localStorage.getItem("savedGameData")) || {};
        savedData[operation] = { level: level, score: score };
        localStorage.setItem("savedGameData", JSON.stringify(savedData));

        if (level > maxLevel) {
            finishGame();
        } else {
            document.getElementById("level").textContent = `Level: ${level}`; // Tampilkan level terbaru
            wrongAnswerCount = 0; // Reset jumlah jawaban salah
            generateQuestion(); // Generate pertanyaan baru
        }
    } else {
        wrongAnswerCount++; // Tambah jumlah jawaban salah

        if (wrongAnswerCount >= 3) {
            // Jika sudah salah 3 kali, tampilkan pesan
            document.getElementById("feedback").textContent = "Anda sudah salah 3 kali. Pertanyaan dilewatkan!";
            
            // Gunakan setTimeout untuk menunda peralihan level
            setTimeout(() => {
                level++; // Naikkan level
                wrongAnswerCount = 0; // Reset jumlah jawaban salah
                
                // Simpan data game di localStorage tanpa menambah skor
                let savedData = JSON.parse(localStorage.getItem("savedGameData")) || {};
                savedData[operation] = { level: level, score: score };
                localStorage.setItem("savedGameData", JSON.stringify(savedData));
                
                if (level > maxLevel) {
                    finishGame();
                } else {
                    document.getElementById("level").textContent = `Level: ${level}`; // Tampilkan level terbaru
                    generateQuestion(); // Generate pertanyaan baru
                }
            }, 2000); // Delay 2 detik (2000 milidetik)
        } else {
            document.getElementById("feedback").textContent = "Jawaban Anda salah. Silakan coba lagi!";
        }
    }
}

function nextLevel() {
    clearInterval(timer); // Hentikan timer sebelum ke level berikutnya

    if (level < maxLevel) {
        level++;
        document.getElementById("level").textContent = `Level: ${level}`;
        saveGameData();  // Simpan data setiap kali naik level
        generateQuestion();
    } else {
        finishGame();
    }
}

function finishGame() {
    gameFinished = true;
    document.getElementById("feedback").textContent = "Selamat, Anda telah menyelesaikan mode ini!";
    
    // Simpan skor terakhir di localStorage
    localStorage.setItem("lastScore", score);
    
    // Simpan bahwa mode ini sudah selesai di localStorage
    let completedModes = JSON.parse(localStorage.getItem("completedModes")) || {};
    completedModes[operation] = true;
    localStorage.setItem("completedModes", JSON.stringify(completedModes));

    // Simpan skor ke total skor
    saveScore(operation, score); // Panggil fungsi saveScore untuk menambahkan skor ke total
    
    // Tampilkan total skor setelah game selesai
    const totalScore = parseInt(localStorage.getItem("totalScore")) || 0;
    document.getElementById("total-score").textContent = `Total Skor: ${totalScore}`;
    
    // Tampilkan tombol untuk kembali ke halaman utama
    document.getElementById("question").textContent = "";
    document.getElementById("answer").style.display = "none";

    // Reset game data untuk mode yang sudah selesai
    let savedData = JSON.parse(localStorage.getItem("savedGameData")) || {};
    delete savedData[operation];  // Hapus data game untuk mode yang sudah selesai
    localStorage.setItem("savedGameData", JSON.stringify(savedData));
}

function saveScore(mode, score) {
    // Ambil total skor dari localStorage, atau set ke 0 jika belum ada
    let totalScore = parseInt(localStorage.getItem("totalScore")) || 0;

    // Tambahkan skor baru ke total skor
    totalScore += score;

    // Simpan total skor kembali ke localStorage
    localStorage.setItem("totalScore", totalScore);
}

// Fungsi untuk menyimpan level dan skor saat ini
function saveGameData() {
    let savedData = JSON.parse(localStorage.getItem("savedGameData")) || {};
    savedData[operation] = { level: level, score: score };
    localStorage.setItem("savedGameData", JSON.stringify(savedData));
}

// Event listener untuk menyimpan data sebelum pengguna meninggalkan halaman
window.addEventListener("beforeunload", function(event) {
    console.log("Halaman ditutup, menyimpan data...");
    saveGameData(); // Panggil fungsi untuk menyimpan data level dan skor
});

// Membantu untuk mengubah huruf pertama menjadi kapital
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Memulai game saat halaman dimuat
startGame();
