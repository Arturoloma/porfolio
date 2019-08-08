server {

        root /var/www/arturoloma.com/html;
        index index.html index.htm;

        server_name arturoloma.com www.arturoloma.com;

        location / {
            try_files $uri $uri/ $uri/index.html $uri.html =404;

            if ($request_uri ~* ".(ico|css|js|gif|jpe?g|png)$") {
                expires 30d;
                access_log off;
                add_header Pragma public;
                add_header Cache-Control "public";
                break;
            }
        }

        location ^~ /node/ {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/arturoloma.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/arturoloma.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
server {
    if ($host = www.arturoloma.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = arturoloma.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name arturoloma.com www.arturoloma.com;
    return 404; # managed by Certbot




}
