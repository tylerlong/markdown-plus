from fabric.api import local


def update():
    local('rm -rf bower_components')
    # local('bower cache clean')
    local('bower update')
