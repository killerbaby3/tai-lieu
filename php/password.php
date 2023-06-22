<?php
function isPasswordValid($password, $recentPasswords = []) {
    // Kiểm tra độ dài
    if (strlen($password) < 12) {
        return false;
    }
    
    // Kiểm tra số lượng nhóm ký tự
    $groupCount = 0;
    
    // Kiểm tra ký tự tiếng Anh viết hoa (nhóm a)
    if (preg_match('/[A-Z]/', $password)) {
        $groupCount++;
    }
    
    // Kiểm tra ký tự tiếng Anh viết thường (nhóm b)
    if (preg_match('/[a-z]/', $password)) {
        $groupCount++;
    }
    
    // Kiểm tra ký tự số (nhóm c)
    if (preg_match('/[0-9]/', $password)) {
        $groupCount++;
    }
    
    // Kiểm tra ký tự khác (nhóm d)
    if (preg_match('/[`~!@#\$%\^&\*\(\)_\+\-=\{\}\|\\\";\':<>\?,\.\/]/', $password)) {
        $groupCount++;
    }
    
    // Kiểm tra số lượng nhóm ký tự
    if ($groupCount < 3) {
        return false;
    }
    
    // Kiểm tra trùng với 5 mật khẩu gần nhất
    foreach ($recentPasswords as $recentPassword) {
        if ($password === $recentPassword) {
            return false;
        }
    }
    
    return true;
}

function generatePassword($recentPasswords = []) {
    $password = '';

    // Tạo một mảng chứa các nhóm ký tự
    $groups = [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'abcdefghijklmnopqrstuvwxyz',
        '0123456789',
        '`~!@#$%^&*()_+-={}|\\:;"\'<>?,./'
    ];

    // Chọn ít nhất một ký tự từ mỗi nhóm
    foreach ($groups as $group) {
        $password .= $group[rand(0, strlen($group) - 1)];
    }

    // Chọn ngẫu nhiên các ký tự còn lại
    $remainingLength = 12 - count($groups);
    for ($i = 0; $i < $remainingLength; $i++) {
        $randomGroupIndex = rand(0, count($groups) - 1);
        $group = $groups[$randomGroupIndex];
        $password .= $group[rand(0, strlen($group) - 1)];
    }

    // Kiểm tra trùng với 5 mật khẩu gần nhất
    while (in_array($password, $recentPasswords)) {
        $password = generatePassword($recentPasswords);
    }

    return $password;
}

$recentPasswords = ["Password1", "Welcome123", "SecretPassword", "1234567890", "Abcdefg123"]; // Mật khẩu gần nhất

var_dump(isPasswordValid('123456'));
var_dump(isPasswordValid('If1!u%OD@<oL'));
$newPassword = generatePassword($recentPasswords);
echo "Mật khẩu mới: " . $newPassword;
