# GRADUATION_PROJECT

STUDENT EDUCATION SUPPORT SYSTEM

## Installation for client

1. Requirements:
    - Node.js 16.x or above
    - Yarn 1.22.x or above

### Building client assets
1. Install node_modules
    ```bash
    yarn 
    ```

2. Generate client assets (Single Page Application)

    This use the source code in directory `client_admin` to generate the static pages for client (frontend).  
    
    ```bash
    yarn generate
    ```

    NOTE:
    1. Everytime the source code of client or file `.env` changed, please re-run above command to re-generate the static pages
