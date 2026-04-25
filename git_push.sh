#!/bin/bash
cd /Users/ningqing/Documents/tavern_helper_template/世界书
git add .
git commit -m "chore: standardize character and story formats to char:xxx and story:xxx, and convert to plain text to save tokens"
git pull --rebase https://github.com/fancynoob21/zzz.git main
git push https://github.com/fancynoob21/zzz.git HEAD:main
