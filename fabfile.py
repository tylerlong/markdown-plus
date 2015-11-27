from fabric.api import local


def css():
    local('cp -r vendor/markdown-core/dist/css dist/')
    local('cp -r vendor/markdown-core/dist/fonts dist/')
    local('curl https://cdn.jsdelivr.net/jquery.ui/1.11.4/jquery-ui.min.css > dist/css/markdown-plus.css')
    local('curl https://cdn.jsdelivr.net/jquery.layout/1.4.3/layout-default.css >> dist/css/markdown-plus.css')
    local('curl https://cdn.jsdelivr.net/remodal/1.0.5/remodal.css >> dist/css/markdown-plus.css')
    local('curl https://cdn.jsdelivr.net/remodal/1.0.5/remodal-default-theme.css >> dist/css/markdown-plus.css')
    local('cat dist/css/markdown-core.css >> dist/css/markdown-plus.css')
    local('rm dist/css/markdown-core.css')
    local('cat markdown-plus.css >> dist/css/markdown-plus.css')


def js():
    local('curl https://cdn.jsdelivr.net/underscorejs/1.8.3/underscore-min.js > dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('cat vendor/markdown-core/dist/markdown-core.min.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/jquery.ui/1.11.4/jquery-ui.min.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/jquery.layout/1.4.3/jquery.layout.min.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/js-cookie/2.0.4/js.cookie.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/remodal/1.0.5/remodal.min.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/ace/1.2.2/noconflict/ace.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/ace/1.2.2/noconflict/keybinding-vim.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/ace/1.2.2/noconflict/keybinding-emacs.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/ace/1.2.2/noconflict/mode-markdown.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/ace/1.2.2/noconflict/ext-searchbox.js >> dist/markdown-plus.js')
    for theme in ['tomorrow_night_eighties', 'tomorrow_night_blue', 'tomorrow', 'kuroir']:
        local('echo "\n" >> dist/markdown-plus.js')
        local('curl https://cdn.jsdelivr.net/ace/1.2.2/noconflict/theme-{0}.js >> dist/markdown-plus.js'.format(theme))
    local('echo "\n" >> dist/markdown-plus.js')
    local('cat markdown-plus.js >> dist/markdown-plus.js')
    local('uglifyjs dist/markdown-plus.js -cmo dist/markdown-plus.min.js')
    local('rm dist/markdown-plus.js')


def dist():
    local('bower install markdown-core')
    css()
    js()
    local('rm -rf vendor')


def mdp():
    local('cp -rf dist ~/src/swift/markdown-plus/Markdown\ Plus/markdown-plus/dist')
    local('cp -f index.html ~/src/swift/markdown-plus/Markdown\ Plus/markdown-plus/index.html')
    local('cp -f icon.png ~/src/swift/markdown-plus/Markdown\ Plus/markdown-plus/icon.png')
