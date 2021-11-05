// DIC: Dictionary object
// -----------------------------------------------
// Version 2
//
// Requires; none

function DIC_Dict()
{
    this.values = [];
    this.keys = [];
    this.currentIndex = 0;
    this.length = 0;
    
    this.get = function(key)
    {
        for (var i = 0; i < this.length; i++) {
            if (this.keys[i] == key) {
                return this.values[i];
            }
        }
        throw new this.keyDoesNotExistException(key);
    }
    
    this.set = function(key, value)
    {
        for (var i = 0; i < this.length; i++) {
            if (this.keys[i] == key) {
                this.values[i] = value;
                return;
            }
        }
        this.keys.push(key);
        this.values.push(value);
        this.length++;
    }
    
    this.unset = function(key)
    {
        for (var i = 0; i < this.length; i++) {
            if (this.keys[i] == key) {
                this.keys.splice(i, 1);
                this.values.splice(i, 1);
                this.length--;
                return;
            }
        }
        throw new this.keyDoesNotExistException(key);
    }
    
    this.has = function(key)
    {
        for (var i = 0; i < this.length; i++) {
            if (this.keys[i] == key) {
                return true;
            }
        }
        return false;
    }
    
    this.current = function()
    {
        if (this.currentIndex < this.length) {
            return [this.keys[this.currentIndex], this.values[this.currentIndex]];
        } else {
            return false;
        }
    }
    
    this.next = function()
    {
        var current = this.current();
        if (current !== false) {
            this.currentIndex++;
        }
        return current;
    }
    
    this.reset = function()
    {
        this.currentIndex = 0;
    }
    
    this.keyDoesNotExistException = function(key)
    {
        this.type = 'key_does_not_exist';
        this.toString = function()
        {
            return "Key '" + key + "' is not present in the dictionary";
        }
    }
}