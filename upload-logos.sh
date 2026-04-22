#!/bin/bash
# 使用 imgbb API 上传图片
OPENAI_URL=$(curl -s -X POST "https://api.imgbb.com/1/upload?key=5d554c1e8b5c5d8c5c5d8c5c5d8c5c5d" -F "image=@/Users/user1/Library/CloudStorage/SynologyDrive-honstin/Downloads/openai-logo.png" | grep -o '"url":"[^"]*' | cut -d'"' -f4)
echo "OpenAI: $OPENAI_URL"
