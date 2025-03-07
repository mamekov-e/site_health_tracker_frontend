FROM nginx:1.13.12

RUN ln -snf /usr/share/zoneinfo/Asia/Almaty /etc/localtime && echo Asia/Almaty > /etc/timezone

WORKDIR /app
COPY old_dist.tar.gz ./
RUN tar -xvzf old_dist.tar.gz && mv dist/enlink/* /usr/share/nginx/html/
# COPY old_dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

RUN chown -R nginx:nginx /usr/share/nginx/html/

EXPOSE 80

USER nginx

CMD ["nginx", "-g", "daemon off;"]
