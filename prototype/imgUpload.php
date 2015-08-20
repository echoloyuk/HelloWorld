<?php

move_uploaded_file($_FILES["imgUpload"]["tmp_name"], 'uploads/'.$_FILES["imgUpload"]["name"]);

echo 'prototype/uploads/'.$_FILES["imgUpload"]["name"];
?>