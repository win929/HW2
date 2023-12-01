<?php
    header("Content-Type: text/html; charset=UTF-8");

    // POST로 받은 데이터
    $id = $_POST['id'];
    $prevDate;
    $prevOrder;
    $newDate = $_POST['newDate'];
    $newOrder = 1;
    $dropArea = $_POST['dropArea'];
    $targetId = $_POST['targetId'];
    $targetOrder;

    // JSON 파일 읽기
    $jsonString = file_get_contents('data/mylists.json');
    $data = json_decode($jsonString, true);

    // 변경할 데이터의 이전 값 저장
    foreach ($data as $key => $entry) {
        if ($entry['id'] == $id) {
            // 변경할 데이터의 이전 값 저장
            $prevDate = $data[$key]['date'];
            $prevOrder = $data[$key]['order'];
        } else if ($entry['id'] == $targetId) {
            $targetOrder = $data[$key]['order'];
        }
    }

    // 데이터 수정
    foreach ($data as $key => $entry) {
        if ($prevDate != $newDate) { // 다른 날로 변경할 때
            // 이전 날짜 데이터의 order 수정
            if ($entry['date'] == $prevDate && $entry['order'] > $prevOrder) {
                $data[$key]['order'] -= 1;
            }

            // 변경할 날짜 데이터의 order 수정
            if ($entry['date'] == $newDate) {
                if ($dropArea == "blnk") { // blnk에 drop (마지막에 drop)
                    // newOrder 초기화
                    $newOrder = $newOrder <= $entry['order'] ? $entry['order'] + 1 : $newOrder;
                } else { // writed에 drop (target 다음에 drop)
                    // newOrder 초기화
                    $newOrder = $targetOrder + 1;

                    // targetOrder보다 큰 order를 가진 데이터의 order 수정
                    $data[$key]['order'] = $entry['order'] > $targetOrder ? $entry['order'] + 1 : $entry['order'];
                }
            }
        } else { // 같은 날로 변경할 때
            if ($dropArea == "blnk") { // blnk에 drop (마지막에 drop)
                if ($entry['date'] == $newDate && $entry['order'] > $prevOrder) {
                    // 변경할 데이터의 order보다 큰 order를 가진 데이터의 order 수정
                    $data[$key]['order'] -= 1;

                    // newOrder 초기화
                    $newOrder = $entry['order'] > $newOrder ? $entry['order'] : $newOrder;
                }
            } else { // writed에 drop
                if ($entry['date'] == $newDate && $targetOrder == 1) { // order가 1인 writed에 drop (제일 위에 drop)
                    // newOrder 초기화
                    $newOrder = 1;

                    // 변경할 데이터의 order보다 작은 order를 가진 데이터의 order 수정
                    $data[$key]['order'] = $entry['order'] < $prevOrder ? $entry['order'] + 1 : $entry['order'];
                } else if ($entry['date'] == $newDate && $targetOrder != 1) { // order가 1이 아닌 writed에 drop (target 다음에 drop)
                    if ($targetOrder < $prevOrder) { // 아래에서 위로
                        // newOrder 초기화
                        $newOrder = $targetOrder + 1;

                        // targetOrder보다 큰 order를 가진 데이터의 order 수정
                        $data[$key]['order'] = $entry['order'] > $targetOrder ? $entry['order'] + 1 : $entry['order'];
                    } else { // 위에서 아래로
                        // newOrder 초기화
                        $newOrder = $targetOrder;

                        // prevOrder보다 크고 targetOrder보다 작거나 같은 order를 가진 데이터의 order 수정
                        $data[$key]['order'] = $entry['order'] > $prevOrder && $entry['order'] <= $targetOrder ? $entry['order'] - 1 : $entry['order'];
                    }
                    
                }
            }
            
            // order가 1인 writed에 drop
            // order가 1이 아닌 writed에 drop
        }
    }

    // 변경할 데이터의 변경 값 저장
    foreach ($data as $key => $entry) {
        if ($entry['id'] == $id) {
            $data[$key]['date'] = $newDate;
            $data[$key]['order'] = $newOrder;

            break;
        }
    }

    // 수정된 데이터를 다시 JSON 파일에 저장
    $newJsonString = json_encode($data, JSON_UNESCAPED_UNICODE);

    // 정규 표현식을 이용하여 }, { 사이에 줄바꿈 문자 추가
    $newJsonString = preg_replace("/},\s*{/", "},\n{", $newJsonString);

    file_put_contents('data/mylists.json', $newJsonString);

    echo "success";
?>
