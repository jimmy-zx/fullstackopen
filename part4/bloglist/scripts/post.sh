#!/bin/bash

TARGET=http://127.0.0.1:3003

HEADERS=(-H Content-Type:Application/JSON)


TOKEN=$(curl "${HEADERS[@]}" $TARGET/api/login --data '{"username": "root", "password": "sekret"}' | jq -r '.token')

HEADERS+=(-H "Authorization:Bearer $TOKEN")

POSTID=$(curl "${HEADERS[@]}" $TARGET/api/blogs --data '{"title": "Title", "url": "example.com"}' | jq -r '.id')

echo "$POSTID"

curl "${HEADERS[@]}" "$TARGET/api/blogs/$POSTID" -X DELETE
