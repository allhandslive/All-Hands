#!/bin/bash

SCRIPT=`pwd`/$0
PATHNAME=`dirname $SCRIPT`

cd $PATHNAME
node server.js &