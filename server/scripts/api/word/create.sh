value=$(<../cookie.txt)

curl -s -b $value \
    'http://localhost:3000/api/words' \
    -d '{"content":"asd","language":"English","tagIds":[],"linkIds":[],"definitions":[],"examples":[],"sourceId":null}' \
    -H 'Content-Type: application/json' \ 
