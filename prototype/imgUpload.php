<?php
$ext = pathinfo($_FILES["imgUpload"]["name"], PATHINFO_EXTENSION);
$name = time();
move_uploaded_file($_FILES["imgUpload"]["tmp_name"], 'uploads/'.$name.'.'.$ext);

echo 'prototype/uploads/'.$name.'.'.$ext;
?>