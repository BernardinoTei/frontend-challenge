#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  UI Bug Fix Test Suite Runner         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo ""
fi

# Display menu
echo -e "${GREEN}Select test mode:${NC}"
echo "  1) Run all tests once"
echo "  2) Run tests in watch mode"
echo "  3) Run tests with UI"
echo "  4) Run tests with coverage"
echo "  5) Run specific bug category"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo -e "${BLUE}🧪 Running all tests...${NC}"
        npm run test:run
        ;;
    2)
        echo -e "${BLUE}👀 Running tests in watch mode...${NC}"
        npm run test:watch
        ;;
    3)
        echo -e "${BLUE}🎨 Opening test UI...${NC}"
        npm run test:ui
        ;;
    4)
        echo -e "${BLUE}📊 Running tests with coverage...${NC}"
        npm run test:coverage
        echo ""
        echo -e "${GREEN}✨ Coverage report generated!${NC}"
        echo -e "Open ${YELLOW}coverage/index.html${NC} in your browser to view the report."
        ;;
    5)
        echo ""
        echo -e "${GREEN}Select bug category:${NC}"
        echo "  1) Basic UI bugs (BUG-001 to BUG-016)"
        echo "  2) Accessibility bugs (BUG-017 to BUG-033)"
        echo "  3) Responsive layout bugs (BUG-034 to BUG-046)"
        echo "  4) State & event bugs (BUG-047 to BUG-063)"
        echo "  5) Real bug examples (BUG-064 to BUG-069)"
        echo ""
        read -p "Enter choice [1-5]: " category
        
        case $category in
            1)
                npx vitest run src/tests/ui-bug-fixes.test.jsx
                ;;
            2)
                npx vitest run src/tests/accessibility-bugs.test.jsx
                ;;
            3)
                npx vitest run src/tests/responsive-layout-bugs.test.jsx
                ;;
            4)
                npx vitest run src/tests/state-event-bugs.test.jsx
                ;;
            5)
                npx vitest run src/tests/real-bug-examples.test.jsx
                ;;
            *)
                echo -e "${RED}Invalid choice${NC}"
                exit 1
                ;;
        esac
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Test execution complete!${NC}"
