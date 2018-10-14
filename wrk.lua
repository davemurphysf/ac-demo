json = require "json"

-- Initialize the pseudo random number generator
-- Resource: http://lua-users.org/wiki/MathLibraryTutorial
math.randomseed(os.time())
math.random(); math.random(); math.random()

function getAlphaChar()
    selection = math.random(1, 3)
    if selection == 1 then return string.char(math.random(65, 90)) end
    if selection == 2 then return string.char(math.random(97, 122)) end
    return string.char(math.random(48, 57))
end

function getRandomString(length)
    length = length or 1
    if length < 1 then return nil end
    local array = {}
    for i = 1, length do
        array[i] = getAlphaChar()
    end
    return table.concat(array)
end

request = function()
    wrk.headers["Connection"] = "Keep-Alive"
    wrk.headers["Content-Type"] = "application/json; charset=utf-8"

    local method = "POST"
    local path = "/autosuggest/_search"
    local stlength = math.random(1,10)
    local search = getRandomString(stlength)
    local body = '{ "suggest": { "productSuggest": { "completion": { "field": "productSuggest" }, "prefix": "' .. search .. '" } } }'
    
    return wrk.format(method, path, wrk.headers, body)
end