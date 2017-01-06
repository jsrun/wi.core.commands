/**
 * Core Commands
 * @author André Ferreira <andrehrf@gmail.com>
 */

let SystemException = require("../core.plugins.exception.js");

module.exports = {
    /**
     * List of commands
     */
    commands: {},
    
    /**
     * List module assets
     * @type object
     */
    assets: {
        js: [__dirname + "/mousetrap.min.js", __dirname + "/mousetrap-global-bind.min.js"]
    },
    
    /**
     * Function to add command
     * 
     * @params object item
     * @return this
     */ 
    addCommand: function(item){
        if(typeof item == "object"){
            if(typeof item.name == "string")
                this.commands[item.name] = item;
            else
                throw new SystemException("Could not register command due to missing valid name.");
        }
        else{
            throw new SystemException("The default value for command items is 'object'.");
        }
        
        return this;
    },
    
    /**
     * Function to return all commands
     * 
     * @return object
     */
    getAll: function(){
        return this.commands;
    },
    
    /**
     * Function to return command by name
     * 
     * @param string name
     * @return mixed
     */
    get: function(name){
        if(this.commands[name])
            return this.commands[name];
        else
            return null;
    },
    
    /**
     * Module startup function
     * 
     * @param object app
     * @return this
     */
    bootstrap: function(app){
        let commandList = this.getAll();
        for(let commandName in commandList){
            if(typeof commandList[commandName].route == "object" && typeof commandList[commandName].exec == "function"){
                if(typeof commandList[commandName].middleware == "object"){
                    for(let middlewareKey in commandList[commandName].middleware)
                        if(typeof commandList[commandName].middleware[middlewareKey] == "function")
                            app.use(commandList[commandName].middleware[middlewareKey]);
                }
               
                switch(commandList[commandName].route.method){
                    case "GET": app.get(commandList[commandName].route.pattern, commandList[commandName].exec); break;
                    case "POST": app.post(commandList[commandName].route.pattern, commandList[commandName].exec); break;
                    case "PUT": app.put(commandList[commandName].route.pattern, commandList[commandName].exec); break;
                    case "DELETE": app.delete(commandList[commandName].route.pattern, commandList[commandName].exec); break;
                }
            }
        }
        
        return this;
    },
    
    /**
     * Function to execute command
     * 
     * @param string name
     * @return this
     */
    exec: function(name, params){
        if(typeof name == "string"){
            if(this.commands[name]){
                if(typeof this.commands[name].exec == "function")
                    this.commands[name].exec.apply(this, params);
                else
                    throw new SystemException(`The '${name}' command has no callback function`);
            }
            else{
                throw new SystemException(`The command '${name}' was not found`);
            }
        }
        else{
            throw new SystemException("The default value for command name is 'string'.");
        }
        
        return this;
    }
}