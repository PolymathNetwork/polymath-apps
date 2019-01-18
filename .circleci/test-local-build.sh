#!/usr/bin/env bash
curl --user ${CIRCLE_TOKEN}: \
    --request POST \
    --form revision=0389c468c896d9de34fad8989dea63ab8b66591a\
    --form config=@config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/PolymathNetwork/polymath-apps/tree/develop


