<?php
header("Content-Type: text/html; charset=UTF-8");

// POST 데이터 받기
$id = $_POST['id'];
$date = $_POST['date'];

// mylists.json 파일 읽기
$lines = explode("
", file_get_contents('data/mylists.json'));
$maxOrder = 0;

foreach ($lines as $line) {
  // 빈 줄이 아니면 JSON 데이터를 배열로 변환
  if ($line !== "") {
    $obj = json_decode($line, true);

    // 같은 날짜의 데이터 중 가장 큰 order 값 찾기
    if ($obj['date'] === $date) {
      $maxOrder = max($maxOrder, $obj['order']);
    }
  }
}

$order = $maxOrder + 1;

$title = $_POST['title'];
$description = $_POST['description'];
$category = $_POST['category'];

// 파일 업로드 처리
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

// 파일이 이미지인지 확인
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

// 파일 업로드 에러 처리
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

// 받은 데이터를 배열로 만들기
$data = array(
    "id" => $id,
    "date" => $date,
    "order" => $order,
    "title" => $title,
    "description" => $description,
    "category" => $category,
    "file_name" => $file_name
);

// JSON 데이터에 새 데이터 추가
$json_string = json_encode($data, JSON_UNESCAPED_UNICODE);

// JSON 파일에 새 데이터 쓰기
file_put_contents('data/mylists.json', $json_string . "
", FILE_APPEND);

echo "success";
?>
