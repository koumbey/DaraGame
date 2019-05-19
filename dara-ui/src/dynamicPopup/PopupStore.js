
export default (function() {
    var store = null;
    function Store() {
        Object.defineProperty(this, "store", {writable:false, value:{}});
        Object.defineProperty(this, "registrations", {writable:false, value:{}});

        this.register = function (name, component, title, params) {
            if (name && component) {
                let popupTitle = title?title:name;
                let popupParam =  params?params:{}
                this.registrations[name] = {
                    component: component,
                    title: popupTitle,
                    params: popupParam
                }
            }else{
                throw new Error("A name and a valid React component class is required")
            }
        };

        this.getRegistration = function(name){
           return this.registrations[name]
        };
        
        this.show = function (name) {
            if (name in this.registrations && this.showCallback){
                this.showCallback(this.getRegistration(name))
            }
        };

        this.close = function (name) {
            if (name in this.registrations && this.showCallback){
                this.closeCallback(this.getRegistration(name))
            }
        };

        this.setShowCallback = function(callback){
            if (!Object.hasOwnProperty("showCallback") && typeof callback === "function"){
                Object.defineProperty(this, "showCallback", {writable:false, value: callback})
            }
        } ;

        this.setCloseCallback = function(callback){
            if (!Object.hasOwnProperty("closeCallback") && typeof callback === "function"){
                Object.defineProperty(this, "closeCallback", {writable:false, value: callback})
            }
        };

        this.isRegistered  =  function (name) {
            return this.registrations.hasOwnProperty(name)
        };

        return this;
    }

    function getStore(){
        if (store === null){
            store = new Store()
        }
        return store
    }
    return getStore
})()