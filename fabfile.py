from fabric.api import local

def update():
    local('rm -rf vendor')
    local('bower cache clean')
    local('bower update')
