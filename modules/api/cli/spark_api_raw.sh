#!/usr/bin/env bash

if [ "${1}" == "" ] && [ "${2}" == "" ]; then
    echo "spark_api_raw.sh <path> <data>"
else
    if which jq > /dev/null; then
        curl -s -H "Content-Type: application/json" -X POST -d "${2}" "${SPARK_API_BASE_URL:-http://localhost:3000/api}${1}" | jq
    else
        echo >&2
        echo "Highly recommended to install jq - for pretty json output: 'sudo apt-get install jq'" >&2
        echo >&2
        curl -s -H "Content-Type: application/json" -X POST -d "${2}" "${SPARK_API_BASE_URL:-http://localhost:3000/api}${1}"
    fi
fi

echo
