NODE_MODULES_BIN="./node_modules/.bin"
set -x
clean() {
    rm -rf dist
}

build() {
    tsc
}

lint() {
    prettier "src/**/*"
}

watch_source() {
    tsc -w
}

watch_server() {
    "${NODE_MODULES_BIN}/nodemon" "dist/index.js"
}

watch() {
    "${NODE_MODULES_BIN}/concurrently" -k -p "[{name}]" -n "TypeScript,Node" -c "cyan.bold,green.bold" "npm:watch:source" "npm:watch:server | pino-pretty -c -t"
}

case $1 in
    build) build
           ;;
    clean) clean
           ;;
    watch) watch
           ;;
    watch-source) watch_source
           ;;
    watch-server) watch_server
           ;;

esac
