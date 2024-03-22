value=$(<../cookie.txt)

curl -v GET \
    -b "$value"\
    'http://localhost:3000/api/words' \
    -H 'Content-Type: application/json' \ | jq
