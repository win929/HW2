<?php
    // 수정 필요
    
    header("Content-Type: text/html; charset=UTF-8");

    $id = $_POST['id'];
    $date = $_POST['date'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $category = $_POST['category'];

    $lines = file_get_contents('data/mylists.json');
    $lines = json_decode($lines, true);
    $maxOrder = 0;

    foreach ($lines as $line) {
    if ($line['date'] === $date) {
        $maxOrder = max($maxOrder, $line['order']);
    }
    }

    $order = $maxOrder + 1;

    $target_dir = "uploads/";

    // 디렉토리가 없으면 생성
    if (!is_dir($target_dir)) {
        if (!mkdir($target_dir, 0777, true)) {
            die('Failed to create directory...');
        }
    }

    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    if(isset($_POST["submit"])) {
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if($check !== false) {
            echo "File is an image - " . $check["mime"] . ".";
            $uploadOk = 1;
        } else {
            echo "File is not an image.";
            $uploadOk = 0;
        }
    }

    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    } else {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            echo "The file ". basename($_FILES["fileToUpload"]["name"]). " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }

    $file_name = basename($_FILES["fileToUpload"]["name"]);

    $data = array(
        "id" => $id,
        "date" => $date,
        "order" => $order,
        "title" => $title,
        "description" => $description,
        "category" => $category,
        "file_name" => $file_name
    );

    $lines[] = $data;

    $json_string = json_encode($lines, JSON_UNESCAPED_UNICODE);

    // 정규 표현식을 이용하여 }, { 사이에 줄바꿈 문자 추가
    $json_string = preg_replace("/},\s*{/", "},\n{", $json_string);

    file_put_contents('data/mylists.json', $json_string);

    echo "success";
?>
