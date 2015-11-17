from fabric.api import local


def dist():
    local('uglifyjs markdown-plus.js -cmo dist/markdown-plus.min.js')
