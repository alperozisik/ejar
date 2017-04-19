const extend = require("js-base/core/extend");
const Router = require("nf-core/ui/router");
const nw = require("nw-smf");
nw.registerService(require("../definitions/sample"));
nw.baseURL = "https://jslibs.azurewebsites.net/examples/nw/";
nw.commonHeaders["Accept"] = nw.commonHeaders["Content-Type"] = "application/json";
nw.onActivityStart = function() {
    console.log("starting activity");
};
nw.onActivityEnd = function() {
    console.log("activity ends");
};

// Get generetad UI code
var Page1Design = require("../ui/ui_page1");

const Page1 = extend(Page1Design)(
    function(_super) {
        var self = this;
        _super(self);

        this.mapChildren(function(component, componentName) {
            self[componentName] = component;
        });

        this.flexlayout.mapChildren(function(component, componentName) {
            self.flexlayout[componentName] = component;
        });

        this.headerBar.leftItemEnabled = false;
        this.flexlayout.btn.onPress = btn_onPress.bind(this);
        this.flexlayout.btnNext.onPress = btnNext_onPress.bind(this);
    });

function btnNext_onPress() {
    Router.go("page2", {
        message: "Hello World!"
    });
}

var btnClickCount = 0;

// Gets/sets press event callback for btn
function btn_onPress() {
    var Redux = require("redux/dist/redux.min");

    function counter(state = 0, action) {
        switch (action.type) {
            case 'INCREMENT':
                return state + 1;
            case 'DECREMENT':
                return state - 1;
            default:
                return state;
        }
    }

    // Create a Redux store holding the state of your app.
    // Its API is { subscribe, dispatch, getState }.
    let store = Redux.createStore(counter);

    // You can use subscribe() to update the UI in response to state changes.
    // Normally you'd use a view binding library (e.g. React Redux) rather than subscribe() directly.
    // However it can also be handy to persist the current state in the localStorage.

    store.subscribe(function() {
        console.log(store.getState());
    });

    // The only way to mutate the internal state is to dispatch an action.
    // The actions can be serialized, logged or stored and later replayed.
    store.dispatch({
        type: 'INCREMENT'
    });
    // 1
    store.dispatch({
        type: 'INCREMENT'
    });
    // 2
    store.dispatch({
        type: 'DECREMENT'
    });
    // 1

    var loginInfo = {
        user: "smartface",
        password: "Cloud1Code"
    };
    nw.factory("login").body(loginInfo).result(function(err, data) {
        if (err) {
            console.log("error");
            if (typeof err === "object")
                err = JSON.stringify(err, null, "\t");
            console.log(err);
        }
        else {
            console.log("success");
            if (typeof data === "object")
                data = JSON.stringify(data, null, "\t");
            console.log(data);
        }
    }).run();

    var myLabelText = "";
    var myButtonText = "";

    btnClickCount += 1;

    switch (true) {
        case btnClickCount == 1:
            myLabelText = "Well Done! \nYou've clicked the button!";
            myButtonText = "Click me again!";
            break;
        case btnClickCount < 10:
            myLabelText = "Whoa!\nThat click was " + numberSuffix(btnClickCount) + " time!";
            myButtonText = "Click again?";
            break;
        case btnClickCount < 15:
            myLabelText = "Feel tired?\nYou can rest your finger now :)";
            myButtonText = "I'm not tired!";
            break;
        default:
            myLabelText = "Isn't it good?\nEvery clicks count, you've clicked " + numberSuffix(btnClickCount) + " time!";
            myButtonText = "Click again?";
            break;
    }

    // Access lbl & btnNext of page1
    this.lbl.text = myLabelText;
    this.flexlayout.btn.text = myButtonText;
}

// Adds appropriate suffix to given number
function numberSuffix(number) {
    var suffix = "th";

    //Lets deal with small numbers
    var smallNumber = number % 100;

    if (smallNumber < 11 || smallNumber > 13) {
        switch (smallNumber % 10) {
            case 1:
                suffix = 'st';
                break;
            case 2:
                suffix = 'nd';
                break;
            case 3:
                suffix = 'rd';
                break;
        }
    }
    return number + suffix;
}

module && (module.exports = Page1);
