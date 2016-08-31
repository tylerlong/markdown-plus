from fabric.api import local


def css():
    local('cp -r node_modules/markdown-core/dist/*.css dist/')
    local('cp -r node_modules/markdown-core/dist/fonts dist/')
    local('curl https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.0/jquery-ui.min.css > dist/markdown-plus.css')
    local('curl https://cdn.jsdelivr.net/jquery.layout/1.4.3/layout-default.css >> dist/markdown-plus.css')
    local('curl https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.0/remodal.min.css >> dist/markdown-plus.css')
    local('curl https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.0/remodal-default-theme.min.css >> dist/markdown-plus.css')
    local('cat dist/markdown-core.min.css >> dist/markdown-plus.css')
    local('rm dist/markdown-core.min.css')
    local('cat markdown-plus.css >> dist/markdown-plus.css')
    local('cleancss -o dist/markdown-plus.min.css dist/markdown-plus.css')
    local('rm dist/markdown-plus.css')


def js():
    local('curl https://cdn.jsdelivr.net/underscorejs/1.8.3/underscore-min.js > dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('cat node_modules/markdown-core/dist/markdown-core.min.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.0/jquery-ui.min.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdn.jsdelivr.net/jquery.layout/1.4.3/jquery.layout.min.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdnjs.cloudflare.com/ajax/libs/remodal/1.1.0/remodal.min.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/keybinding-vim.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/keybinding-emacs.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/mode-markdown.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('curl https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ext-searchbox.js >> dist/markdown-plus.js')
    for theme in ['tomorrow_night_eighties', 'tomorrow_night_blue', 'tomorrow', 'kuroir']:
        local('echo "\n" >> dist/markdown-plus.js')
        local('curl https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/theme-{0}.js >> dist/markdown-plus.js'.format(theme))
    local('echo "\n" >> dist/markdown-plus.js')
    local('cat sync_scroll.js >> dist/markdown-plus.js')
    local('echo "\n" >> dist/markdown-plus.js')
    local('cat markdown-plus.js >> dist/markdown-plus.js')
    local('uglifyjs dist/markdown-plus.js -cmo dist/markdown-plus.min.js')
    local('rm dist/markdown-plus.js')


def dist():
    local('rm -rf node_modules')
    local('npm install')
    css()
    js()


def mdp():
    local('cp -rf dist ~/src/swift/markdown-plus/Markdown\ Plus/markdown-plus/')
    local('cp -f index.html ~/src/swift/markdown-plus/Markdown\ Plus/markdown-plus/')
    local('cp -f icon.png ~/src/swift/markdown-plus/Markdown\ Plus/markdown-plus/')
