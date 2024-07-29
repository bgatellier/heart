#!/bin/bash

# add updated jsr metadata to the previous commit generated by the "changeset version" CLI.
if [ -e ./need-jsr-updated.tmp ]; then
    rm ./need-jsr-updated.tmp
    ./devops/scripts/update-jsr.sh
    git add packages/**/jsr.jsonc
    git commit --amend -C HEAD --no-verify
fi
