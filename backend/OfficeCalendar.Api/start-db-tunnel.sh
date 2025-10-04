#!/bin/bash
echo "🔌 Starting MySQL tunnel to server..."
ssh -N -L 3306:localhost:3306 ubuntu-1065913@145.24.237.220