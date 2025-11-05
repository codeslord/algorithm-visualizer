#!/bin/bash

# Setup script for Algorithm Visualizer
# This script clones the algorithms repository if it doesn't exist

ALGORITHMS_DIR="algorithms"
ALGORITHMS_REPO="https://github.com/algorithm-visualizer/algorithms.git"

echo "Algorithm Visualizer - Setup Script"
echo "===================================="
echo ""

if [ -d "$ALGORITHMS_DIR" ]; then
    echo "✓ Algorithms directory already exists"
    echo "  Location: ./$ALGORITHMS_DIR"

    # Check if it's a git repository
    if [ -d "$ALGORITHMS_DIR/.git" ]; then
        echo ""
        echo "Updating algorithms repository..."
        cd "$ALGORITHMS_DIR"
        git pull origin master
        cd ..
        echo "✓ Algorithms repository updated"
    fi
else
    echo "Cloning algorithms repository..."
    echo "  From: $ALGORITHMS_REPO"
    echo ""

    git clone "$ALGORITHMS_REPO" "$ALGORITHMS_DIR"

    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ Successfully cloned algorithms repository"
        echo "  Location: ./$ALGORITHMS_DIR"
    else
        echo ""
        echo "✗ Failed to clone algorithms repository"
        echo "  Please clone manually:"
        echo "  git clone $ALGORITHMS_REPO"
        exit 1
    fi
fi

echo ""
echo "===================================="
echo "Setup complete! You can now run:"
echo "  npm run dev"
echo "===================================="
