#!/bin/sh

# Replace placeholders with Render environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  REACT_APP_API_URL: "${REACT_APP_API_URL}",
  REACT_APP_Website_Title: "${REACT_APP_Website_Title}"
};
EOF

# Start Nginx
nginx -g 'daemon off;'
