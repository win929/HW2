<?php
    header("Content-Type: text/html; charset=UTF-8");

    // POST로 받은 데이터
    $id = $_POST['id'];
    $newTitle = $_POST['title'];
    $newDescription = $_POST['description'];
    $newCategory = $_POST['category'];

    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["editFileToUpload"]["name"]);

    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    if(isset($_POST["submit"])) {
        $check = getimagesize($_FILES["editFileToUpload"]["tmp_name"]);
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
        if (move_uploaded_file($_FILES["editFileToUpload"]["tmp_name"], $target_file)) {
            echo "The file ". basename($_FILES["editFileToUpload"]["name"]). " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }

    $file_name = basename($_FILES["editFileToUpload"]["name"]);

    // JSON 파일 읽기
    $jsonString = file_get_contents('data/mylists.json');
    $data = json_decode($jsonString, true);

    // id가 일치하는 데이터 찾기
    foreach ($data as $key => $entry) {
        if ($entry['id'] == $id) {
            // 데이터 수정
            $data[$key]['title'] = $newTitle;
            $data[$key]['description'] = $newDescription;
            $data[$key]['category'] = $newCategory;
            $data[$key]['file_name'] = $file_name;
        }
    }

    // 수정된 데이터를 다시 JSON 파일에 저장
    $newJsonString = json_encode($data, JSON_UNESCAPED_UNICODE);

    // 정규 표현식을 이용하여 }, { 사이에 줄바꿈 문자 추가
    $newJsonString = preg_replace("/},\s*{/", "},\n{", $newJsonString);

    file_put_contents('data/mylists.json', $newJsonString);
?>
