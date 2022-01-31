FROM node:14.16.0 AS client-build
WORKDIR /usr/src/app
COPY client/ ./client/
ENV VUE_APP_BACKEND_URL=""
RUN cd client && npm install && npm run build

FROM node:14.16.0 AS server-build
ENV NODE_ENV='production'
ENV MONGO_DB_URI="mongodb+srv://batteryassembly:jYzrBpC26emVYaa6@batteryassembly.vcqm1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
ENV JWT_KEY="4dS8Jv5SvCWdKN8vLBSg8VfhhRK8EHeS"
ENV JWT_EXPIRES_IN='2d'
ENV LEGACY_API=''
ENV PORT='443'
WORKDIR /root/
COPY --from=client-build /usr/src/app/client/dist ./client/dist
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/

EXPOSE 443

CMD ["node", "./server/server.js"]