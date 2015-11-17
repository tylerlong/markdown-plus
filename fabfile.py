from fabric.api import local


def dist():
    local('cp markdown-plus.css dist/markdown-plus.css')

    local('curl https://cdn.jsdelivr.net/underscorejs/1.8.3/underscore-min.js > dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('cat vendor/markdown-core/dist/markdown-core.min.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/jquery.ui/1.11.4/jquery-ui.min.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/jquery.layout/1.4.3/jquery.layout.min.js >> dist/markdown-plus.js')

    local('echo "\n" >> dist/markdown-plus.js')
    local('cat markdown-plus.js >> dist/markdown-plus.js')
    local('uglifyjs dist/markdown-plus.js -cmo dist/markdown-plus.min.js')
    local('rm dist/markdown-plus.js')
