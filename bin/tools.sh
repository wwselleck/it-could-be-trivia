NODE_MODULES_BIN="./node_modules/.bin"

DB_CONTAINER_NAME="icbtrivia-db"

set -x
clean() {
    rm -rf dist
}

build() {
    clean
    "${NODE_MODULES_BIN}/tsc"
}

lint() {
    prettier "src/**/*"
}

start() {
    build
    cd dist && "node" "index.js"
}

start_db() {
    sudo docker run -p 27017:27017 --name ${DB_CONTAINER_NAME} -d mongo || sudo docker restart ${DB_CONTAINER_NAME}
}

stop_db() {
    sudo docker stop ${DB_CONTAINER_NAME}

}

watch_source() {
    tsc -w
}

watch_server() {
    "nodemon" "dist/index.js"
}

watch() {
    "${NODE_MODULES_BIN}/concurrently" -k -p "[{name}]" -n "TypeScript,Node" -c "cyan.bold,green.bold" "npm:watch:source" "npm:watch:server | pino-pretty -c -t"
}

case $1 in
    build) build
           ;;
    clean) clean
           ;;
    start) start
           ;;
    start-db) start_db
           ;;
    stop-db) stop_db
           ;;
    watch) watch
           ;;
    watch-source) watch_source
           ;;
    watch-server) watch_server
           ;;

esac
