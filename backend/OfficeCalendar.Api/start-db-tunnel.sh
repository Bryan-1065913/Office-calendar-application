#!/bin/bash
echo "🔌 Starting MySQL tunnel to server..."
ssh -N -L 5432:localhost:5432 ubuntu-1065913@145.24.237.220