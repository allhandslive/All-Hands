#!/bin/bash

SCRIPT=`pwd`/$0
PATHNAME=`dirname $SCRIPT`
CURRENT_DIR=`pwd`

cd $PATHNAME

npm install --loglevel error express

cd $CURRENT_DIR
