/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/packs/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***************************************************************************************!*\
  !*** ./node_modules/@stimulus/mutation-observers/dist/module/src/element_observer.js ***!
  \***************************************************************************************/
/*! exports provided: ElementObserver */
/*! exports used: ElementObserver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ElementObserver; });
var ElementObserver = /** @class */ (function () {
    function ElementObserver(element, delegate) {
        var _this = this;
        this.element = element;
        this.started = false;
        this.delegate = delegate;
        this.elements = new Set;
        this.mutationObserver = new MutationObserver(function (mutations) { return _this.processMutations(mutations); });
    }
    ElementObserver.prototype.start = function () {
        if (!this.started) {
            this.mutationObserver.observe(this.element, { attributes: true, childList: true, subtree: true });
            this.started = true;
            this.refresh();
        }
    };
    ElementObserver.prototype.stop = function () {
        if (this.started) {
            this.mutationObserver.takeRecords();
            this.mutationObserver.disconnect();
            this.started = false;
        }
    };
    ElementObserver.prototype.refresh = function () {
        if (this.started) {
            var matches = new Set(this.matchElementsInTree());
            for (var _i = 0, _a = Array.from(this.elements); _i < _a.length; _i++) {
                var element = _a[_i];
                if (!matches.has(element)) {
                    this.removeElement(element);
                }
            }
            for (var _b = 0, _c = Array.from(matches); _b < _c.length; _b++) {
                var element = _c[_b];
                this.addElement(element);
            }
        }
    };
    // Mutation record processing
    ElementObserver.prototype.processMutations = function (mutations) {
        for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
            var mutation = mutations_1[_i];
            this.processMutation(mutation);
        }
    };
    ElementObserver.prototype.processMutation = function (mutation) {
        if (mutation.type == "attributes") {
            this.processAttributeChange(mutation.target, mutation.attributeName);
        }
        else if (mutation.type == "childList") {
            this.processRemovedNodes(mutation.removedNodes);
            this.processAddedNodes(mutation.addedNodes);
        }
    };
    ElementObserver.prototype.processAttributeChange = function (node, attributeName) {
        var element = node;
        if (this.elements.has(element)) {
            if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
                this.delegate.elementAttributeChanged(element, attributeName);
            }
            else {
                this.removeElement(element);
            }
        }
        else if (this.matchElement(element)) {
            this.addElement(element);
        }
    };
    ElementObserver.prototype.processRemovedNodes = function (nodes) {
        for (var _i = 0, _a = Array.from(nodes); _i < _a.length; _i++) {
            var node = _a[_i];
            this.processNode(node, this.removeElement);
        }
    };
    ElementObserver.prototype.processAddedNodes = function (nodes) {
        for (var _i = 0, _a = Array.from(nodes); _i < _a.length; _i++) {
            var node = _a[_i];
            this.processNode(node, this.addElement);
        }
    };
    // Element matching
    ElementObserver.prototype.matchElement = function (element) {
        return this.delegate.matchElement(element);
    };
    ElementObserver.prototype.matchElementsInTree = function (tree) {
        if (tree === void 0) { tree = this.element; }
        return this.delegate.matchElementsInTree(tree);
    };
    ElementObserver.prototype.processNode = function (node, processor) {
        var tree = this.elementFromNode(node);
        if (tree) {
            for (var _i = 0, _a = this.matchElementsInTree(tree); _i < _a.length; _i++) {
                var element = _a[_i];
                processor.call(this, element);
            }
        }
    };
    ElementObserver.prototype.elementFromNode = function (node) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            return node;
        }
    };
    // Element tracking
    ElementObserver.prototype.addElement = function (element) {
        if (!this.elements.has(element)) {
            this.elements.add(element);
            if (this.delegate.elementMatched) {
                this.delegate.elementMatched(element);
            }
        }
    };
    ElementObserver.prototype.removeElement = function (element) {
        if (this.elements.has(element)) {
            this.elements.delete(element);
            if (this.delegate.elementUnmatched) {
                this.delegate.elementUnmatched(element);
            }
        }
    };
    return ElementObserver;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9vYnNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzdGltdWx1cy9tdXRhdGlvbi1vYnNlcnZlcnMvc3JjL2VsZW1lbnRfb2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0E7SUFRRSx5QkFBWSxPQUFPLEVBQUUsUUFBUTtRQUE3QixpQkFPQztRQU5DLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBRXhCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUE7UUFDdkIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLENBQUMsVUFBQyxTQUFTLElBQUssT0FBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQTtJQUMvRixDQUFDO0lBRUQsK0JBQUssR0FBTDtRQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBQ2pHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO1lBQ25CLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUNoQixDQUFDO0lBQ0gsQ0FBQztJQUVELDhCQUFJLEdBQUo7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUE7WUFDbkMs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

/***/ }),
/* 1 */
/*!****************************************!*\
  !*** ./node_modules/stimulus/index.js ***!
  \****************************************/
/*! exports provided: Action, ActionDescriptor, Application, Context, Controller, defaultSchema */
/*! exports used: Application, Controller */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stimulus_core__ = __webpack_require__(/*! @stimulus/core */ 13);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__stimulus_core__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__stimulus_core__["b"]; });



/***/ }),
/* 2 */
/*!***************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/action.js ***!
  \***************************************************************/
/*! exports provided: Action */
/*! exports used: Action */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Action; });
var Action = /** @class */ (function () {
    function Action(context, descriptor, eventTarget) {
        this.context = context;
        this.descriptor = descriptor;
        this.eventTarget = eventTarget;
    }
    Action.prototype.connect = function () {
        this.eventTarget.addEventListener(this.eventName, this, false);
    };
    Action.prototype.disconnect = function () {
        this.eventTarget.removeEventListener(this.eventName, this, false);
    };
    Action.prototype.hasSameDescriptorAs = function (action) {
        return action != null && action.descriptor.isEqualTo(this.descriptor);
    };
    Action.prototype.handleEvent = function (event) {
        if (this.willBeInvokedByEvent(event)) {
            this.invokeWithEvent(event);
        }
    };
    Object.defineProperty(Action.prototype, "eventName", {
        get: function () {
            return this.descriptor.eventName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "method", {
        get: function () {
            var method = this.controller[this.methodName];
            if (typeof method == "function") {
                return method;
            }
            throw new Error("Action \"" + this.descriptor + "\" references undefined method \"" + this.methodName + "\"");
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype.invokeWithEvent = function (event) {
        try {
            this.method.call(this.controller, event);
        }
        catch (error) {
            this.context.handleError(error, "invoking action \"" + this.descriptor + "\"", { event: event });
        }
    };
    Action.prototype.willBeInvokedByEvent = function (event) {
        var eventTarget = event.target;
        if (this.element === eventTarget) {
            return true;
        }
        else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
            return this.scope.containsElement(eventTarget);
        }
        else {
            return true;
        }
    };
    Object.defineProperty(Action.prototype, "controller", {
        get: function () {
            return this.context.controller;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "methodName", {
        get: function () {
            return this.descriptor.methodName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "scope", {
        get: function () {
            return this.context.scope;
        },
        enumerable: true,
        configurable: true
    });
    return Action;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHN0aW11bHVzL2NvcmUvc3JjL2FjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQTtJQUtFLGdCQUFZLE9BQWdCLEVBQUUsVUFBNEIsRUFBRSxXQUF3QjtRQUNsRixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtRQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtJQUNoQyxDQUFDO0lBRUQsd0JBQU8sR0FBUDtRQUNFLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDaEUsQ0FBQztJQUVELDJCQUFVLEdBQVY7UUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQ25FLENBQUM7SUFFRCxvQ0FBbUIsR0FBbkIsVUFBb0IsTUFBcUI7UUFDdkMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ3ZFLENBQUM7SUFFRCw0QkFBVyxHQUFYLFVBQVksS0FBWTtRQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDN0IsQ0FBQztJQUNILENBQUM7SUFFRCxzQkFBSSw2QkFBUzthQUFiO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFBO1FBQ2xDLENBQUM7OztPQUFBO0lBRUQsc0JBQUksMEJBQU07YUFBVjtZQUNFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxNQUFNLENBQUE7WUFDZixDQUFDO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFXLElBQUksQ0FBQyxVQUFVLHlDQUFrQyxJQUFJLENBQUMsVUFBVSxPQUFHLENBQUMsQ0FBQTtRQUNqRyxDQUFDOzs7T0FBQTtJQUVPLGdDQUFlLEdBQXZCLFVBQXdCLEtBQVk7UUFDbEMsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMxQyxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSx1QkFBb0IsSUFBSSxDQUFDLFVBQVUsT0FBRyxFQUFFLEVBQUUsS0FBSyxPQUFBLEVBQUUsQ0FBQyxDQUFBO1FBQ3BGLENBQUM7SUFDSCxDQUFDO0lBRU8scUNBQW9CLEdBQTVCLFVBQTZCLEtBQVk7UUFDdkMsSUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQTtRQUNoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQTtRQUNiLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxZQUFZLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEYsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ2hELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFDYixDQUFDO0lBQ0gsQ0FBQztJQUVELHNCQUFZLDhCQUFVO2FBQXRCO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFBO1FBQ2hDLENBQUM7OztPQUFBO0lBRUQsc0JBQVksOEJBQVU7YUFBdEI7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUE7UUFDbkMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBWSwyQkFBTzthQUFuQjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQTtRQUMzQixDQUFDOzs7T0FBQTtJQUVELHNCQUFZLHlCQUFLO2FBQWpCO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFBO1FBQzNCLENBQUM7OztPQUFBO0lBQ0gsYUFBQztBQUFELENBQUMsQUEzRUQsSUEyRUMifQ==

/***/ }),
/* 3 */
/*!**************************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/action_descriptor.js ***!
  \**************************************************************************/
/*! exports provided: ActionDescriptor */
/*! exports used: ActionDescriptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActionDescriptor; });
// capture nos.:  12   23 4               43   1 5   5 6  6
var pattern = /^((.+?)(@(window|document))?->)?(.+?)#(.+)$/;
var ActionDescriptor = /** @class */ (function () {
    function ActionDescriptor(identifier, eventName, methodName, eventTarget) {
        this.identifier = identifier;
        this.eventName = eventName;
        this.methodName = methodName;
        this.eventTarget = eventTarget;
    }
    ActionDescriptor.forOptions = function (options) {
        return new ActionDescriptor(options.identifier || error("Missing identifier in action descriptor"), options.eventName || error("Missing event name in action descriptor"), options.methodName || error("Missing method name in action descriptor"), options.eventTarget || error("Missing event target in action descriptor"));
    };
    ActionDescriptor.forElementWithInlineDescriptorString = function (element, descriptorString) {
        try {
            var options = this.parseOptionsFromInlineActionDescriptorString(descriptorString);
            options.eventName = options.eventName || this.getDefaultEventNameForElement(element);
            options.eventTarget = options.eventTarget || element;
            return ActionDescriptor.forOptions(options);
        }
        catch (error) {
            throw new Error("Bad action descriptor \"" + descriptorString + "\": " + error.message);
        }
    };
    ActionDescriptor.parseOptionsFromInlineActionDescriptorString = function (descriptorString) {
        var source = descriptorString.trim();
        var matches = source.match(pattern) || error("Invalid action descriptor syntax");
        return {
            identifier: matches[5],
            eventName: matches[2],
            methodName: matches[6],
            eventTarget: parseEventTarget(matches[4])
        };
    };
    ActionDescriptor.getDefaultEventNameForElement = function (element) {
        return this.defaultEventNames[element.tagName.toLowerCase()](element);
    };
    Object.defineProperty(ActionDescriptor.prototype, "eventTargetName", {
        get: function () {
            return stringifyEventTarget(this.eventTarget);
        },
        enumerable: true,
        configurable: true
    });
    ActionDescriptor.prototype.isEqualTo = function (descriptor) {
        return descriptor != null &&
            descriptor.identifier == this.identifier &&
            descriptor.eventName == this.eventName &&
            descriptor.methodName == this.methodName &&
            descriptor.eventTarget == this.eventTarget;
    };
    ActionDescriptor.prototype.toString = function () {
        var eventNameSuffix = this.eventTargetName ? "@" + this.eventTargetName : "";
        return "" + this.eventName + eventNameSuffix + "->" + this.identifier + "#" + this.methodName;
    };
    ActionDescriptor.defaultEventNames = {
        "a": function (e) { return "click"; },
        "button": function (e) { return "click"; },
        "form": function (e) { return "submit"; },
        "input": function (e) { return e.getAttribute("type") == "submit" ? "click" : "change"; },
        "select": function (e) { return "change"; },
        "textarea": function (e) { return "change"; }
    };
    return ActionDescriptor;
}());

function error(message) {
    throw new Error(message);
}
function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
        return window;
    }
    else if (eventTargetName == "document") {
        return document;
    }
}
function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
        return "window";
    }
    else if (eventTarget == document) {
        return "document";
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uX2Rlc2NyaXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvY29yZS9zcmMvYWN0aW9uX2Rlc2NyaXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsMkRBQTJEO0FBQzNELElBQU0sT0FBTyxHQUFHLDZDQUE2QyxDQUFBO0FBRTdEO0lBa0RFLDBCQUFZLFVBQWtCLEVBQUUsU0FBaUIsRUFBRSxVQUFrQixFQUFFLFdBQXdCO1FBQzdGLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO1FBQzFCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0lBQ2hDLENBQUM7SUF4Q00sMkJBQVUsR0FBakIsVUFBa0IsT0FBZ0M7UUFDaEQsTUFBTSxDQUFDLElBQUksZ0JBQWdCLENBQ3pCLE9BQU8sQ0FBQyxVQUFVLElBQUssS0FBSyxDQUFDLHlDQUF5QyxDQUFDLEVBQ3ZFLE9BQU8sQ0FBQyxTQUFTLElBQU0sS0FBSyxDQUFDLHlDQUF5QyxDQUFDLEVBQ3ZFLE9BQU8sQ0FBQyxVQUFVLElBQUssS0FBSyxDQUFDLDBDQUEwQyxDQUFDLEVBQ3hFLE9BQU8sQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQzFFLENBQUE7SUFDSCxDQUFDO0lBRU0scURBQW9DLEdBQTNDLFVBQTRDLE9BQWdCLEVBQUUsZ0JBQXdCO1FBQ3BGLElBQUksQ0FBQztZQUNILElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQ25GLE9BQU8sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsNkJBQTZCLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDcEYsT0FBTyxD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

/***/ }),
/* 4 */
/*!****************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/context.js ***!
  \****************************************************************/
/*! exports provided: Context */
/*! exports used: Context */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Context; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_set__ = __webpack_require__(/*! ./action_set */ 17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__inline_action_observer__ = __webpack_require__(/*! ./inline_action_observer */ 18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scope__ = __webpack_require__(/*! ./scope */ 22);



var Context = /** @class */ (function () {
    function Context(module, element) {
        this.module = module;
        this.scope = new __WEBPACK_IMPORTED_MODULE_2__scope__["a" /* Scope */](this.schema, this.identifier, element);
        this.actions = new __WEBPACK_IMPORTED_MODULE_0__action_set__["a" /* ActionSet */](this);
        this.inlineActionObserver = new __WEBPACK_IMPORTED_MODULE_1__inline_action_observer__["a" /* InlineActionObserver */](this, this);
        try {
            this.controller = new module.controllerConstructor(this);
            this.controller.initialize();
        }
        catch (error) {
            this.handleError(error, "initializing controller");
        }
    }
    Context.prototype.connect = function () {
        this.actions.start();
        this.inlineActionObserver.start();
        try {
            this.controller.connect();
        }
        catch (error) {
            this.handleError(error, "connecting controller");
        }
    };
    Context.prototype.disconnect = function () {
        try {
            this.controller.disconnect();
        }
        catch (error) {
            this.handleError(error, "disconnecting controller");
        }
        this.inlineActionObserver.stop();
        this.actions.stop();
    };
    Object.defineProperty(Context.prototype, "application", {
        get: function () {
            return this.module.application;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "identifier", {
        get: function () {
            return this.module.identifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "schema", {
        get: function () {
            return this.application.schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "parentElement", {
        get: function () {
            return this.element.parentElement;
        },
        enumerable: true,
        configurable: true
    });
    // Inline action observer delegate
    /** @private */
    Context.prototype.inlineActionConnected = function (action) {
        this.actions.add(action);
    };
    /** @private */
    Context.prototype.inlineActionDisconnected = function (action) {
        this.actions.delete(action);
    };
    // Error handling
    Context.prototype.handleError = function (error, message, detail) {
        if (detail === void 0) { detail = {}; }
        var _a = this, identifier = _a.identifier, controller = _a.controller, element = _a.element;
        detail = Object.assign({ identifier: identifier, controller: controller, element: element }, detail);
        this.application.handleError(error, "Error " + message, detail);
    };
    return Context;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzdGltdWx1cy9jb3JlL3NyYy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFHeEMsT0FBTyxFQUFFLG9CQUFvQixFQUFnQyxNQUFNLDBCQUEwQixDQUFBO0FBRzdGLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFFL0I7SUFPRSxpQkFBWSxNQUFjLEVBQUUsT0FBZ0I7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDN0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNsQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFFaEUsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN4RCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQzlCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUseUJBQXlCLENBQUMsQ0FBQTtRQUNwRCxDQUFDO0lBQ0gsQ0FBQztJQUVELHlCQUFPLEdBQVA7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVqQyxJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQzNCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLENBQUMsQ0FBQTtRQUNsRCxDQUFDO0lBQ0gsQ0FBQztJQUVELDRCQUFVLEdBQVY7UUFDRSxJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQzlCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsMEJBQTBCLENBQUMsQ0FBQTtRQUNyRCxDQUFDO1FBRUQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFBO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDckIsQ0FBQztJQUVELHNCQUFJLGdDQUFXO2FBQWY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUE7UUFDaEMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSwrQkFBVTthQUFkO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFBO1FBQy9CLENBQUM7OztPQUFBO0lBRUQsc0JBQUksMkJBQU07YUFBVjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQTtRQUNoQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDRCQUFPO2FBQVg7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUE7UUFDM0IsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxrQ0FBYTthQUFqQjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQTtRQUNuQyxDQUFDOzs7T0FBQTtJQUVELGtDQUFrQztJQUVsQyxlQUFlO0lBQ2YsdUNBQXFCLEdBQXJCLFVBQXNCLE1BQWM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVELGVBQWU7SUFDZiwwQ0FBd0IsR0FBeEIsVUFBeUIsTUFBYztRQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUM3QixDQUFDO0lBRUQsaUJBQWlCO0lBRWpCLDZCQUFXLEdBQVgsVUFBWSxLQUFZLEVBQUUsT0FBZSxFQUFFLE1BQW1CO1FBQW5CLHVCQUFBLEVBQUEsV0FBbUI7UUFDdEQsSUFBQSxTQUEwQyxFQUF4QywwQkFBVSxFQUFFLDBCQUFVLEVBQUUsb0JBQU8sQ0FBUztRQUNoRCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVUsWUFBQSxFQUFFLFVBQVUsWUFBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDbkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFdBQVMsT0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQ2pFLENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FBQyxBQWxGRCxJQWtGQyJ9

/***/ }),
/* 5 */
/*!**************************************************************!*\
  !*** ./node_modules/@stimulus/multimap/dist/module/index.js ***!
  \**************************************************************/
/*! exports provided: Multimap, IndexedMultimap */
/*! exports used: IndexedMultimap, Multimap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_multimap__ = __webpack_require__(/*! ./src/multimap */ 6);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__src_multimap__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_indexed_multimap__ = __webpack_require__(/*! ./src/indexed_multimap */ 19);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__src_indexed_multimap__["a"]; });


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvbXVsdGltYXAvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYyxnQkFBZ0IsQ0FBQTtBQUM5QixjQUFjLHdCQUF3QixDQUFBIn0=

/***/ }),
/* 6 */
/*!*********************************************************************!*\
  !*** ./node_modules/@stimulus/multimap/dist/module/src/multimap.js ***!
  \*********************************************************************/
/*! exports provided: Multimap */
/*! exports used: Multimap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Multimap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__set_operations__ = __webpack_require__(/*! ./set_operations */ 7);

var Multimap = /** @class */ (function () {
    function Multimap() {
        this.valuesByKey = new Map();
    }
    Object.defineProperty(Multimap.prototype, "values", {
        get: function () {
            var sets = Array.from(this.valuesByKey.values());
            return sets.reduce(function (values, set) { return values.concat(Array.from(set)); }, []);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Multimap.prototype, "size", {
        get: function () {
            var sets = Array.from(this.valuesByKey.values());
            return sets.reduce(function (size, set) { return size + set.size; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Multimap.prototype.add = function (key, value) {
        Object(__WEBPACK_IMPORTED_MODULE_0__set_operations__["a" /* add */])(this.valuesByKey, key, value);
    };
    Multimap.prototype.delete = function (key, value) {
        Object(__WEBPACK_IMPORTED_MODULE_0__set_operations__["b" /* del */])(this.valuesByKey, key, value);
    };
    Multimap.prototype.has = function (key, value) {
        var values = this.valuesByKey.get(key);
        return values != null && values.has(value);
    };
    Multimap.prototype.hasKey = function (key) {
        return this.valuesByKey.has(key);
    };
    Multimap.prototype.hasValue = function (value) {
        var sets = Array.from(this.valuesByKey.values());
        return sets.some(function (set) { return set.has(value); });
    };
    Multimap.prototype.getValuesForKey = function (key) {
        var values = this.valuesByKey.get(key);
        return values ? Array.from(values) : [];
    };
    Multimap.prototype.getKeysForValue = function (value) {
        return Array.from(this.valuesByKey)
            .filter(function (_a) {
            var key = _a[0], values = _a[1];
            return values.has(value);
        })
            .map(function (_a) {
            var key = _a[0], values = _a[1];
            return key;
        });
    };
    return Multimap;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGltYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvbXVsdGltYXAvc3JjL211bHRpbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sa0JBQWtCLENBQUE7QUFFM0M7SUFHRTtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQWEsQ0FBQTtJQUN6QyxDQUFDO0lBRUQsc0JBQUksNEJBQU07YUFBVjtZQUNFLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1lBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSyxPQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUE5QixDQUE4QixFQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQy9FLENBQUM7OztPQUFBO0lBRUQsc0JBQUksMEJBQUk7YUFBUjtZQUNFLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1lBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSyxPQUFBLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFmLENBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN2RCxDQUFDOzs7T0FBQTtJQUVELHNCQUFHLEdBQUgsVUFBSSxHQUFNLEVBQUUsS0FBUTtRQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDbkMsQ0FBQztJQUVELHlCQUFNLEdBQU4sVUFBTyxHQUFNLEVBQUUsS0FBUTtRQUNyQixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDbkMsQ0FBQztJQUVELHNCQUFHLEdBQUgsVUFBSSxHQUFNLEVBQUUsS0FBUTtRQUNsQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN4QyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFFRCx5QkFBTSxHQUFOLFVBQU8sR0FBTTtRQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsMkJBQVEsR0FBUixVQUFTLEtBQVE7UUFDZixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUE7SUFDekMsQ0FBQztJQUVELGtDQUFlLEdBQWYsVUFBZ0IsR0FBTTtRQUNwQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7SUFDekMsQ0FBQztJQUVELGtDQUFlLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQ2hDLE1BQU0sQ0FBQyxVQUFDLEVBQWE7Z0JBQVosV0FBRyxFQUFFLGNBQU07WUFBTSxPQUFBLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQWpCLENBQWlCLENBQUM7YUFDNUMsR0FBRyxDQUFDLFVBQUMsRUFBYTtnQkFBWixXQUFHLEVBQUUsY0FBTTtZQUFNLE9BQUEsR0FBRztRQUFILENBQUcsQ0FBQyxDQUFBO0lBQ2hDLENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQWpERCxJQWlEQyJ9

/***/ }),
/* 7 */
/*!***************************************************************************!*\
  !*** ./node_modules/@stimulus/multimap/dist/module/src/set_operations.js ***!
  \***************************************************************************/
/*! exports provided: add, del, fetch, prune */
/*! exports used: add, del */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = add;
/* harmony export (immutable) */ __webpack_exports__["b"] = del;
/* unused harmony export fetch */
/* unused harmony export prune */
function add(map, key, value) {
    fetch(map, key).add(value);
}
function del(map, key, value) {
    fetch(map, key).delete(value);
    prune(map, key);
}
function fetch(map, key) {
    var values = map.get(key);
    if (!values) {
        values = new Set();
        map.set(key, values);
    }
    return values;
}
function prune(map, key) {
    var values = map.get(key);
    if (values != null && values.size == 0) {
        map.delete(key);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0X29wZXJhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvbXVsdGltYXAvc3JjL3NldF9vcGVyYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sY0FBb0IsR0FBbUIsRUFBRSxHQUFNLEVBQUUsS0FBUTtJQUM3RCxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1QixDQUFDO0FBRUQsTUFBTSxjQUFvQixHQUFtQixFQUFFLEdBQU0sRUFBRSxLQUFRO0lBQzdELEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzdCLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDakIsQ0FBQztBQUVELE1BQU0sZ0JBQXNCLEdBQW1CLEVBQUUsR0FBTTtJQUNyRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNaLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2xCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFBO0FBQ2YsQ0FBQztBQUVELE1BQU0sZ0JBQXNCLEdBQW1CLEVBQUUsR0FBTTtJQUNyRCxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzNCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDakIsQ0FBQztBQUNILENBQUMifQ==

/***/ }),
/* 8 */
/*!************************************************************************!*\
  !*** ./node_modules/@stimulus/mutation-observers/dist/module/index.js ***!
  \************************************************************************/
/*! exports provided: AttributeObserver, ElementObserver, TokenListObserver */
/*! exports used: TokenListObserver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_attribute_observer__ = __webpack_require__(/*! ./src/attribute_observer */ 20);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_element_observer__ = __webpack_require__(/*! ./src/element_observer */ 0);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_token_list_observer__ = __webpack_require__(/*! ./src/token_list_observer */ 21);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_2__src_token_list_observer__["a"]; });



//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvbXV0YXRpb24tb2JzZXJ2ZXJzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGNBQWMsMEJBQTBCLENBQUE7QUFDeEMsY0FBYyx3QkFBd0IsQ0FBQTtBQUN0QyxjQUFjLDJCQUEyQixDQUFBIn0=

/***/ }),
/* 9 */
/*!******************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/selectors.js ***!
  \******************************************************************/
/*! exports provided: attributeValueContainsToken */
/*! exports used: attributeValueContainsToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = attributeValueContainsToken;
/** @private */
function attributeValueContainsToken(attributeName, token) {
    return "[" + attributeName + "~=\"" + token + "\"]";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHN0aW11bHVzL2NvcmUvc3JjL3NlbGVjdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxlQUFlO0FBQ2YsTUFBTSxzQ0FBc0MsYUFBcUIsRUFBRSxLQUFhO0lBQzlFLE1BQU0sQ0FBQyxNQUFJLGFBQWEsWUFBTSxLQUFLLFFBQUksQ0FBQTtBQUN6QyxDQUFDIn0=

/***/ }),
/* 10 */
/*!***************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/schema.js ***!
  \***************************************************************/
/*! exports provided: defaultSchema */
/*! exports used: defaultSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return defaultSchema; });
var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target"
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHN0aW11bHVzL2NvcmUvc3JjL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxNQUFNLENBQUMsSUFBTSxhQUFhLEdBQVc7SUFDbkMsbUJBQW1CLEVBQUUsaUJBQWlCO0lBQ3RDLGVBQWUsRUFBRSxhQUFhO0lBQzlCLGVBQWUsRUFBRSxhQUFhO0NBQy9CLENBQUEifQ==

/***/ }),
/* 11 */
/*!*********************************************!*\
  !*** ./app/javascript/packs/application.js ***!
  \*********************************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_player__ = __webpack_require__(/*! player */ 12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_player___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_player__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_stimulus__ = __webpack_require__(/*! stimulus */ 1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_stimulus_webpack_helpers__ = __webpack_require__(/*! stimulus/webpack-helpers */ 28);
/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb





var application = __WEBPACK_IMPORTED_MODULE_1_stimulus__["a" /* Application */].start();
var context = __webpack_require__(/*! controllers */ 30);
application.load(Object(__WEBPACK_IMPORTED_MODULE_2_stimulus_webpack_helpers__["a" /* definitionsFromContext */])(context));

/***/ }),
/* 12 */
/*!****************************************!*\
  !*** ./app/javascript/player/index.js ***!
  \****************************************/
/*! dynamic exports provided */
/***/ (function(module, exports) {

var Player = "";

/***/ }),
/* 13 */
/*!**********************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/index.js ***!
  \**********************************************************/
/*! exports provided: Action, ActionDescriptor, Application, Context, Controller, defaultSchema */
/*! exports used: Application, Controller */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_action__ = __webpack_require__(/*! ./src/action */ 2);
/* unused harmony reexport Action */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_action_descriptor__ = __webpack_require__(/*! ./src/action_descriptor */ 3);
/* unused harmony reexport ActionDescriptor */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_application__ = __webpack_require__(/*! ./src/application */ 14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_2__src_application__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_context__ = __webpack_require__(/*! ./src/context */ 4);
/* unused harmony reexport Context */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_controller__ = __webpack_require__(/*! ./src/controller */ 26);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_4__src_controller__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_schema__ = __webpack_require__(/*! ./src/schema */ 10);
/* unused harmony reexport defaultSchema */






//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvY29yZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBQ3JDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHlCQUF5QixDQUFBO0FBQzFELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQTtBQUMvQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBQ3ZDLE9BQU8sRUFBRSxVQUFVLEVBQXlCLE1BQU0sa0JBQWtCLENBQUE7QUFFcEUsT0FBTyxFQUFVLGFBQWEsRUFBRSxNQUFNLGNBQWMsQ0FBQSJ9

/***/ }),
/* 14 */
/*!********************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/application.js ***!
  \********************************************************************/
/*! exports provided: Application */
/*! exports used: Application */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Application; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router__ = __webpack_require__(/*! ./router */ 15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__schema__ = __webpack_require__(/*! ./schema */ 10);


var Application = /** @class */ (function () {
    function Application(element, schema) {
        if (element === void 0) { element = document.documentElement; }
        if (schema === void 0) { schema = __WEBPACK_IMPORTED_MODULE_1__schema__["a" /* defaultSchema */]; }
        this.element = element;
        this.schema = schema;
        this.router = new __WEBPACK_IMPORTED_MODULE_0__router__["a" /* Router */](this);
    }
    Application.start = function (element, schema) {
        var application = new Application(element, schema);
        application.start();
        return application;
    };
    Application.prototype.start = function () {
        this.router.start();
    };
    Application.prototype.stop = function () {
        this.router.stop();
    };
    Application.prototype.register = function (identifier, controllerConstructor) {
        this.load({ identifier: identifier, controllerConstructor: controllerConstructor });
    };
    Application.prototype.load = function (head) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var definitions = Array.isArray(head) ? head : [head].concat(rest);
        definitions.forEach(function (definition) { return _this.router.loadDefinition(definition); });
    };
    Application.prototype.unload = function (head) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var identifiers = Array.isArray(head) ? head : [head].concat(rest);
        identifiers.forEach(function (identifier) { return _this.router.unloadIdentifier(identifier); });
    };
    Object.defineProperty(Application.prototype, "controllers", {
        // Controllers
        get: function () {
            return this.router.contexts.map(function (context) { return context.controller; });
        },
        enumerable: true,
        configurable: true
    });
    Application.prototype.getControllerForElementAndIdentifier = function (element, identifier) {
        var context = this.router.getContextForElementAndIdentifier(element, identifier);
        return context ? context.controller : null;
    };
    // Error handling
    Application.prototype.handleError = function (error, message, detail) {
        console.error("%s\n\n%o\n\n%o", message, error, detail);
    };
    return Application;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvY29yZS9zcmMvYXBwbGljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQTtBQUNqQyxPQUFPLEVBQVUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBRWhEO0lBV0UscUJBQVksT0FBMkMsRUFBRSxNQUE4QjtRQUEzRSx3QkFBQSxFQUFBLFVBQW1CLFFBQVEsQ0FBQyxlQUFlO1FBQUUsdUJBQUEsRUFBQSxzQkFBOEI7UUFDckYsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0lBVk0saUJBQUssR0FBWixVQUFhLE9BQWlCLEVBQUUsTUFBZTtRQUM3QyxJQUFNLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDcEQsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ25CLE1BQU0sQ0FBQyxXQUFXLENBQUE7SUFDcEIsQ0FBQztJQVFELDJCQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ3JCLENBQUM7SUFFRCwwQkFBSSxHQUFKO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNwQixDQUFDO0lBRUQsOEJBQVEsR0FBUixVQUFTLFVBQWtCLEVBQUUscUJBQTRDO1FBQ3ZFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLFlBQUEsRUFBRSxxQkFBcUIsdUJBQUEsRUFBRSxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUlELDBCQUFJLEdBQUosVUFBSyxJQUErQjtRQUFwQyxpQkFHQztRQUhxQyxjQUFxQjthQUFyQixVQUFxQixFQUFyQixxQkFBcUIsRUFBckIsSUFBcUI7WUFBckIsNkJBQXFCOztRQUN6RCxJQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksU0FBSyxJQUFJLENBQUMsQ0FBQTtRQUNoRSxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVSxJQUFJLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQXRDLENBQXNDLENBQUMsQ0FBQTtJQUMzRSxDQUFDO0lBSUQsNEJBQU0sR0FBTixVQUFPLElBQXVCO1FBQTlCLGlCQUdDO1FBSCtCLGNBQWlCO2FBQWpCLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtZQUFqQiw2QkFBaUI7O1FBQy9DLElBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxTQUFLLElBQUksQ0FBQyxDQUFBO1FBQ2hFLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVLElBQUksT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUE7SUFDN0UsQ0FBQztJQUlELHNCQUFJLG9DQUFXO1FBRmYsY0FBYzthQUVkO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLE9BQU8sQ0FBQyxVQUFVLEVBQWxCLENBQWtCLENBQUMsQ0FBQTtRQUNoRSxDQUFDOzs7T0FBQTtJQUVELDBEQUFvQyxHQUFwQyxVQUFxQyxPQUFnQixFQUFFLFVBQWtCO1FBQ3ZFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsaUNBQWlDLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBQ2xGLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtJQUM1QyxDQUFDO0lBRUQsaUJBQWlCO0lBRWpCLGlDQUFXLEdBQVgsVUFBWSxLQUFZLEVBQUUsT0FBZSxFQUFFLE1BQWM7UUFDdkQsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQ3pELENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUEzREQsSUEyREMifQ==

/***/ }),
/* 15 */
/*!***************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/router.js ***!
  \***************************************************************/
/*! exports provided: Router */
/*! exports used: Router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Router; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__module__ = __webpack_require__(/*! ./module */ 16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stimulus_mutation_observers__ = __webpack_require__(/*! @stimulus/mutation-observers */ 8);


var Router = /** @class */ (function () {
    function Router(application) {
        this.application = application;
        this.tokenListObserver = new __WEBPACK_IMPORTED_MODULE_1__stimulus_mutation_observers__["a" /* TokenListObserver */](this.element, this.controllerAttribute, this);
        this.modulesByIdentifier = new Map;
    }
    Object.defineProperty(Router.prototype, "schema", {
        get: function () {
            return this.application.schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "element", {
        get: function () {
            return this.application.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "controllerAttribute", {
        get: function () {
            return this.schema.controllerAttribute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "modules", {
        get: function () {
            return Array.from(this.modulesByIdentifier.values());
        },
        enumerable: true,
        configurable: true
    });
    Router.prototype.start = function () {
        this.tokenListObserver.start();
    };
    Router.prototype.stop = function () {
        this.tokenListObserver.stop();
    };
    Router.prototype.loadDefinition = function (definition) {
        var identifier = definition.identifier;
        this.unloadIdentifier(identifier);
        var module = new __WEBPACK_IMPORTED_MODULE_0__module__["a" /* Module */](this.application, definition);
        this.modulesByIdentifier.set(identifier, module);
        this.connectModule(module);
    };
    Router.prototype.unloadIdentifier = function (identifier) {
        var module = this.modulesByIdentifier.get(identifier);
        if (module) {
            this.disconnectModule(module);
            this.modulesByIdentifier.delete(identifier);
        }
    };
    // Token list observer delegate
    /** @private */
    Router.prototype.elementMatchedTokenForAttribute = function (element, token, attributeName) {
        this.connectModuleForIdentifierToElement(token, element);
    };
    /** @private */
    Router.prototype.elementUnmatchedTokenForAttribute = function (element, token, attributeName) {
        this.disconnectModuleForIdentifierFromElement(token, element);
    };
    Object.defineProperty(Router.prototype, "contexts", {
        // Contexts
        get: function () {
            return this.modules.reduce(function (contexts, module) { return contexts.concat(Array.from(module.contexts)); }, []);
        },
        enumerable: true,
        configurable: true
    });
    Router.prototype.getContextForElementAndIdentifier = function (element, identifier) {
        var module = this.modulesByIdentifier.get(identifier);
        if (module) {
            return module.getContextForElement(element);
        }
    };
    Router.prototype.connectModule = function (module) {
        var elements = this.tokenListObserver.getElementsMatchingToken(module.identifier);
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            module.connectElement(element);
        }
    };
    Router.prototype.disconnectModule = function (module) {
        var contexts = module.contexts;
        for (var _i = 0, contexts_1 = contexts; _i < contexts_1.length; _i++) {
            var element = contexts_1[_i].element;
            module.disconnectElement(element);
        }
    };
    Router.prototype.connectModuleForIdentifierToElement = function (identifier, element) {
        var module = this.modulesByIdentifier.get(identifier);
        if (module) {
            module.connectElement(element);
        }
    };
    Router.prototype.disconnectModuleForIdentifierFromElement = function (identifier, element) {
        var module = this.modulesByIdentifier.get(identifier);
        if (module) {
            module.disconnectElement(element);
        }
    };
    return Router;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHN0aW11bHVzL2NvcmUvc3JjL3JvdXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBRWpDLE9BQU8sRUFBRSxpQkFBaUIsRUFBNkIsTUFBTSw4QkFBOEIsQ0FBQTtBQUUzRjtJQUtFLGdCQUFZLFdBQXdCO1FBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO1FBQzlCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO1FBQzVGLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsc0JBQUksMEJBQU07YUFBVjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQTtRQUNoQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDJCQUFPO2FBQVg7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUE7UUFDakMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx1Q0FBbUI7YUFBdkI7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQTtRQUN4QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDJCQUFPO2FBQVg7WUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUN0RCxDQUFDOzs7T0FBQTtJQUVELHNCQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDaEMsQ0FBQztJQUVELHFCQUFJLEdBQUo7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

/***/ }),
/* 16 */
/*!***************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/module.js ***!
  \***************************************************************/
/*! exports provided: Module */
/*! exports used: Module */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Module; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__context__ = __webpack_require__(/*! ./context */ 4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__definition__ = __webpack_require__(/*! ./definition */ 25);


var Module = /** @class */ (function () {
    function Module(application, definition) {
        this.application = application;
        this.definition = Object(__WEBPACK_IMPORTED_MODULE_1__definition__["a" /* blessDefinition */])(definition);
        this.contextsByElement = new WeakMap;
        this.connectedContexts = new Set;
    }
    Object.defineProperty(Module.prototype, "identifier", {
        get: function () {
            return this.definition.identifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "controllerConstructor", {
        get: function () {
            return this.definition.controllerConstructor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "contexts", {
        get: function () {
            return Array.from(this.connectedContexts);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "size", {
        get: function () {
            return this.connectedContexts.size;
        },
        enumerable: true,
        configurable: true
    });
    Module.prototype.connectElement = function (element) {
        var context = this.fetchContextForElement(element);
        if (context && !this.connectedContexts.has(context)) {
            this.connectedContexts.add(context);
            context.connect();
        }
    };
    Module.prototype.disconnectElement = function (element) {
        var context = this.fetchContextForElement(element);
        if (context && this.connectedContexts.has(context)) {
            this.connectedContexts.delete(context);
            context.disconnect();
        }
    };
    Module.prototype.getContextForElement = function (element) {
        return this.contextsByElement.get(element);
    };
    Module.prototype.fetchContextForElement = function (element) {
        var context = this.contextsByElement.get(element);
        if (!context) {
            context = new __WEBPACK_IMPORTED_MODULE_0__context__["a" /* Context */](this, element);
            this.contextsByElement.set(element, context);
        }
        return context;
    };
    return Module;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHN0aW11bHVzL2NvcmUvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFBO0FBRW5DLE9BQU8sRUFBYyxlQUFlLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFFMUQ7SUFPRSxnQkFBWSxXQUF3QixFQUFFLFVBQXNCO1FBQzFELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQzdDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLE9BQU8sQ0FBQTtRQUNwQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLENBQUE7SUFDbEMsQ0FBQztJQUVELHNCQUFJLDhCQUFVO2FBQWQ7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUE7UUFDbkMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx5Q0FBcUI7YUFBekI7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQTtRQUM5QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDRCQUFRO2FBQVo7WUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtRQUMzQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHdCQUFJO2FBQVI7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQTtRQUNwQyxDQUFDOzs7T0FBQTtJQUVELCtCQUFjLEdBQWQsVUFBZSxPQUFnQjtRQUM3QixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDcEQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNuQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDbkIsQ0FBQztJQUNILENBQUM7SUFFRCxrQ0FBaUIsR0FBakIsVUFBa0IsT0FBZ0I7UUFDaEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3RDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVELHFDQUFvQixHQUFwQixVQUFxQixPQUFnQjtRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBRU8sdUNBQXNCLEdBQTlCLFVBQStCLE9BQWdCO1FBQzdDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2IsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUNwQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUM5QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0lBQ0gsYUFBQztBQUFELENBQUMsQUExREQsSUEwREMifQ==

/***/ }),
/* 17 */
/*!*******************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/action_set.js ***!
  \*******************************************************************/
/*! exports provided: ActionSet */
/*! exports used: ActionSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActionSet; });
var ActionSet = /** @class */ (function () {
    function ActionSet(context) {
        this.context = context;
        this.started = false;
        this.actions = new Set;
    }
    ActionSet.prototype.start = function () {
        if (!this.started) {
            this.started = true;
            this.connectActions();
        }
    };
    ActionSet.prototype.stop = function () {
        if (this.started) {
            this.disconnectActions();
            this.started = false;
        }
    };
    ActionSet.prototype.add = function (action) {
        if (!this.actions.has(action)) {
            action.connect();
            this.actions.add(action);
        }
    };
    ActionSet.prototype.delete = function (action) {
        if (this.actions.has(action)) {
            this.actions.delete(action);
            action.disconnect();
        }
    };
    ActionSet.prototype.connectActions = function () {
        this.actions.forEach(function (action) { return action.connect(); });
    };
    ActionSet.prototype.disconnectActions = function () {
        this.actions.forEach(function (action) { return action.disconnect(); });
    };
    return ActionSet;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uX3NldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzdGltdWx1cy9jb3JlL3NyYy9hY3Rpb25fc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0lBS0UsbUJBQVksT0FBZ0I7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQTtJQUN4QixDQUFDO0lBRUQseUJBQUssR0FBTDtRQUNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7WUFDbkIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ3ZCLENBQUM7SUFDSCxDQUFDO0lBRUQsd0JBQUksR0FBSjtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO1FBQ3RCLENBQUM7SUFDSCxDQUFDO0lBRUQsdUJBQUcsR0FBSCxVQUFJLE1BQWM7UUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzFCLENBQUM7SUFDSCxDQUFDO0lBRUQsMEJBQU0sR0FBTixVQUFPLE1BQWM7UUFDbkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzNCLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNyQixDQUFDO0lBQ0gsQ0FBQztJQUVPLGtDQUFjLEdBQXRCO1FBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQWhCLENBQWdCLENBQUMsQ0FBQTtJQUNsRCxDQUFDO0lBRU8scUNBQWlCLEdBQXpCO1FBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQW5CLENBQW1CLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBOUNELElBOENDIn0=

/***/ }),
/* 18 */
/*!*******************************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/inline_action_observer.js ***!
  \*******************************************************************************/
/*! exports provided: InlineActionObserver */
/*! exports used: InlineActionObserver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InlineActionObserver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action__ = __webpack_require__(/*! ./action */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__action_descriptor__ = __webpack_require__(/*! ./action_descriptor */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stimulus_multimap__ = __webpack_require__(/*! @stimulus/multimap */ 5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__stimulus_mutation_observers__ = __webpack_require__(/*! @stimulus/mutation-observers */ 8);




var InlineActionObserver = /** @class */ (function () {
    function InlineActionObserver(context, delegate) {
        this.context = context;
        this.delegate = delegate;
        this.tokenListObserver = new __WEBPACK_IMPORTED_MODULE_3__stimulus_mutation_observers__["a" /* TokenListObserver */](this.element, this.attributeName, this);
        this.connectedActions = new __WEBPACK_IMPORTED_MODULE_2__stimulus_multimap__["b" /* Multimap */]();
    }
    Object.defineProperty(InlineActionObserver.prototype, "scope", {
        get: function () {
            return this.context.scope;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InlineActionObserver.prototype, "schema", {
        get: function () {
            return this.context.schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InlineActionObserver.prototype, "attributeName", {
        get: function () {
            return this.schema.actionAttribute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InlineActionObserver.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InlineActionObserver.prototype, "identifier", {
        get: function () {
            return this.scope.identifier;
        },
        enumerable: true,
        configurable: true
    });
    InlineActionObserver.prototype.start = function () {
        this.tokenListObserver.start();
    };
    InlineActionObserver.prototype.stop = function () {
        this.tokenListObserver.stop();
    };
    // Token list observer delegate
    /** @private */
    InlineActionObserver.prototype.elementMatchedTokenForAttribute = function (element, token, attributeName) {
        if (this.scope.containsElement(element)) {
            var action = this.buildActionForElementWithDescriptorString(element, token);
            if (action) {
                this.connectedActions.add(element, action);
                this.delegate.inlineActionConnected(action);
            }
        }
    };
    /** @private */
    InlineActionObserver.prototype.elementUnmatchedTokenForAttribute = function (element, token, attributeName) {
        var action = this.getConnectedActionForElementWithDescriptorString(element, token);
        if (action) {
            this.connectedActions.delete(element, action);
            this.delegate.inlineActionDisconnected(action);
        }
    };
    InlineActionObserver.prototype.getConnectedActionForElementWithDescriptorString = function (element, descriptorString) {
        var newAction = this.buildActionForElementWithDescriptorString(element, descriptorString);
        if (newAction) {
            var actions = this.connectedActions.getValuesForKey(element);
            return actions.find(function (action) { return action.hasSameDescriptorAs(newAction); });
        }
    };
    InlineActionObserver.prototype.buildActionForElementWithDescriptorString = function (element, descriptorString) {
        try {
            var descriptor = __WEBPACK_IMPORTED_MODULE_1__action_descriptor__["a" /* ActionDescriptor */].forElementWithInlineDescriptorString(element, descriptorString);
            if (descriptor.identifier == this.identifier) {
                return new __WEBPACK_IMPORTED_MODULE_0__action__["a" /* Action */](this.context, descriptor, descriptor.eventTarget);
            }
        }
        catch (error) {
            this.context.handleError(error, "parsing descriptor string \"" + descriptorString + "\"", { element: element });
        }
    };
    return InlineActionObserver;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5saW5lX2FjdGlvbl9vYnNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzdGltdWx1cy9jb3JlL3NyYy9pbmxpbmVfYWN0aW9uX29ic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUE7QUFDakMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUE7QUFFdEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRzdDLE9BQU8sRUFBRSxpQkFBaUIsRUFBNkIsTUFBTSw4QkFBOEIsQ0FBQTtBQU8zRjtJQU1FLDhCQUFZLE9BQWdCLEVBQUUsUUFBc0M7UUFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7UUFDeEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ3RGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLFFBQVEsRUFBbUIsQ0FBQTtJQUN6RCxDQUFDO0lBRUQsc0JBQUksdUNBQUs7YUFBVDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQTtRQUMzQixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHdDQUFNO2FBQVY7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUE7UUFDNUIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSwrQ0FBYTthQUFqQjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQTtRQUNwQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHlDQUFPO2FBQVg7WUFDRSxNQUFNLENB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

/***/ }),
/* 19 */
/*!*****************************************************************************!*\
  !*** ./node_modules/@stimulus/multimap/dist/module/src/indexed_multimap.js ***!
  \*****************************************************************************/
/*! exports provided: IndexedMultimap */
/*! exports used: IndexedMultimap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IndexedMultimap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__multimap__ = __webpack_require__(/*! ./multimap */ 6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__set_operations__ = __webpack_require__(/*! ./set_operations */ 7);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var IndexedMultimap = /** @class */ (function (_super) {
    __extends(IndexedMultimap, _super);
    function IndexedMultimap() {
        var _this = _super.call(this) || this;
        _this.keysByValue = new Map;
        return _this;
    }
    Object.defineProperty(IndexedMultimap.prototype, "values", {
        get: function () {
            return Array.from(this.keysByValue.keys());
        },
        enumerable: true,
        configurable: true
    });
    IndexedMultimap.prototype.add = function (key, value) {
        _super.prototype.add.call(this, key, value);
        Object(__WEBPACK_IMPORTED_MODULE_1__set_operations__["a" /* add */])(this.keysByValue, value, key);
    };
    IndexedMultimap.prototype.delete = function (key, value) {
        _super.prototype.delete.call(this, key, value);
        Object(__WEBPACK_IMPORTED_MODULE_1__set_operations__["b" /* del */])(this.keysByValue, value, key);
    };
    IndexedMultimap.prototype.hasValue = function (value) {
        return this.keysByValue.has(value);
    };
    IndexedMultimap.prototype.getKeysForValue = function (value) {
        var set = this.keysByValue.get(value);
        return set ? Array.from(set) : [];
    };
    return IndexedMultimap;
}(__WEBPACK_IMPORTED_MODULE_0__multimap__["a" /* Multimap */]));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhlZF9tdWx0aW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzdGltdWx1cy9tdWx0aW1hcC9zcmMvaW5kZXhlZF9tdWx0aW1hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUNyQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLGtCQUFrQixDQUFBO0FBRTNDO0lBQTJDLG1DQUFjO0lBR3ZEO1FBQUEsWUFDRSxpQkFBTyxTQUVSO1FBREMsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQTs7SUFDNUIsQ0FBQztJQUVELHNCQUFJLG1DQUFNO2FBQVY7WUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7UUFDNUMsQ0FBQzs7O09BQUE7SUFFRCw2QkFBRyxHQUFILFVBQUksR0FBTSxFQUFFLEtBQVE7UUFDbEIsaUJBQU0sR0FBRyxZQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUNyQixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDbkMsQ0FBQztJQUVELGdDQUFNLEdBQU4sVUFBTyxHQUFNLEVBQUUsS0FBUTtRQUNyQixpQkFBTSxNQUFNLFlBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ3hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsa0NBQVEsR0FBUixVQUFTLEtBQVE7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDcEMsQ0FBQztJQUVELHlDQUFlLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN2QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7SUFDbkMsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQTlCRCxDQUEyQyxRQUFRLEdBOEJsRCJ9

/***/ }),
/* 20 */
/*!*****************************************************************************************!*\
  !*** ./node_modules/@stimulus/mutation-observers/dist/module/src/attribute_observer.js ***!
  \*****************************************************************************************/
/*! exports provided: AttributeObserver */
/*! no exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export AttributeObserver */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element_observer__ = __webpack_require__(/*! ./element_observer */ 0);

var AttributeObserver = /** @class */ (function () {
    function AttributeObserver(element, attributeName, delegate) {
        this.attributeName = attributeName;
        this.delegate = delegate;
        this.elementObserver = new __WEBPACK_IMPORTED_MODULE_0__element_observer__["a" /* ElementObserver */](element, this);
    }
    Object.defineProperty(AttributeObserver.prototype, "element", {
        get: function () {
            return this.elementObserver.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeObserver.prototype, "selector", {
        get: function () {
            return "[" + this.attributeName + "]";
        },
        enumerable: true,
        configurable: true
    });
    AttributeObserver.prototype.start = function () {
        this.elementObserver.start();
    };
    AttributeObserver.prototype.stop = function () {
        this.elementObserver.stop();
    };
    // Element observer delegate
    AttributeObserver.prototype.matchElement = function (element) {
        return element.hasAttribute(this.attributeName);
    };
    AttributeObserver.prototype.matchElementsInTree = function (tree) {
        var match = this.matchElement(tree) ? [tree] : [];
        var matches = Array.from(tree.querySelectorAll(this.selector));
        return match.concat(matches);
    };
    AttributeObserver.prototype.elementMatched = function (element) {
        if (this.delegate.elementMatchedAttribute) {
            this.delegate.elementMatchedAttribute(element, this.attributeName);
        }
    };
    AttributeObserver.prototype.elementUnmatched = function (element) {
        if (this.delegate.elementUnmatchedAttribute) {
            this.delegate.elementUnmatchedAttribute(element, this.attributeName);
        }
    };
    AttributeObserver.prototype.elementAttributeChanged = function (element, attributeName) {
        if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
            this.delegate.elementAttributeValueChanged(element, attributeName);
        }
    };
    return AttributeObserver;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmlidXRlX29ic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvQHN0aW11bHVzL211dGF0aW9uLW9ic2VydmVycy9zcmMvYXR0cmlidXRlX29ic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQTJCLE1BQU0sb0JBQW9CLENBQUE7QUFRN0U7SUFNRSwyQkFBWSxPQUFnQixFQUFFLGFBQXFCLEVBQUUsUUFBbUM7UUFDdEYsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7UUFFeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDM0QsQ0FBQztJQUVELHNCQUFJLHNDQUFPO2FBQVg7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUE7UUFDckMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx1Q0FBUTthQUFaO1lBQ0UsTUFBTSxDQUFDLE1BQUksSUFBSSxDQUFDLGFBQWEsTUFBRyxDQUFBO1FBQ2xDLENBQUM7OztPQUFBO0lBRUQsaUNBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDOUIsQ0FBQztJQUVELGdDQUFJLEdBQUo7UUFDRSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQzdCLENBQUM7SUFFRCw0QkFBNEI7SUFFNUIsd0NBQVksR0FBWixVQUFhLE9BQWdCO1FBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUNqRCxDQUFDO0lBRUQsK0NBQW1CLEdBQW5CLFVBQW9CLElBQWE7UUFDL0IsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO1FBQ25ELElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ2hFLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzlCLENBQUM7SUFFRCwwQ0FBYyxHQUFkLFVBQWUsT0FBZ0I7UUFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ3BFLENBQUM7SUFDSCxDQUFDO0lBRUQsNENBQWdCLEdBQWhCLFVBQWlCLE9BQWdCO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUN0RSxDQUFDO0lBQ0gsQ0FBQztJQUVELG1EQUF1QixHQUF2QixVQUF3QixPQUFnQixFQUFFLGFBQXFCO1FBQzdELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQTRCLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3RGLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFBO1FBQ3BFLENBQUM7SUFDSCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBMURELElBMERDIn0=

/***/ }),
/* 21 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@stimulus/mutation-observers/dist/module/src/token_list_observer.js ***!
  \******************************************************************************************/
/*! exports provided: TokenListObserver */
/*! exports used: TokenListObserver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TokenListObserver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__element_observer__ = __webpack_require__(/*! ./element_observer */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stimulus_multimap__ = __webpack_require__(/*! @stimulus/multimap */ 5);


var TokenListObserver = /** @class */ (function () {
    function TokenListObserver(element, attributeName, delegate) {
        this.attributeName = attributeName;
        this.delegate = delegate;
        this.elementObserver = new __WEBPACK_IMPORTED_MODULE_0__element_observer__["a" /* ElementObserver */](element, this);
        this.tokensByElement = new __WEBPACK_IMPORTED_MODULE_1__stimulus_multimap__["a" /* IndexedMultimap */];
    }
    Object.defineProperty(TokenListObserver.prototype, "started", {
        get: function () {
            return this.elementObserver.started;
        },
        enumerable: true,
        configurable: true
    });
    TokenListObserver.prototype.start = function () {
        this.elementObserver.start();
    };
    TokenListObserver.prototype.stop = function () {
        this.elementObserver.stop();
    };
    TokenListObserver.prototype.refresh = function () {
        this.elementObserver.refresh();
    };
    Object.defineProperty(TokenListObserver.prototype, "element", {
        get: function () {
            return this.elementObserver.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TokenListObserver.prototype, "selector", {
        get: function () {
            return "[" + this.attributeName + "]";
        },
        enumerable: true,
        configurable: true
    });
    TokenListObserver.prototype.getElementsMatchingToken = function (token) {
        return this.tokensByElement.getKeysForValue(token);
    };
    // Element observer delegate
    TokenListObserver.prototype.matchElement = function (element) {
        return element.hasAttribute(this.attributeName);
    };
    TokenListObserver.prototype.matchElementsInTree = function (tree) {
        var match = this.matchElement(tree) ? [tree] : [];
        var matches = Array.from(tree.querySelectorAll(this.selector));
        return match.concat(matches);
    };
    TokenListObserver.prototype.elementMatched = function (element) {
        var newTokens = Array.from(this.readTokenSetForElement(element));
        for (var _i = 0, newTokens_1 = newTokens; _i < newTokens_1.length; _i++) {
            var token = newTokens_1[_i];
            this.elementMatchedToken(element, token);
        }
    };
    TokenListObserver.prototype.elementUnmatched = function (element) {
        var tokens = this.getTokensForElement(element);
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            this.elementUnmatchedToken(element, token);
        }
    };
    TokenListObserver.prototype.elementAttributeChanged = function (element) {
        var newTokenSet = this.readTokenSetForElement(element);
        for (var _i = 0, _a = Array.from(newTokenSet); _i < _a.length; _i++) {
            var token = _a[_i];
            this.elementMatchedToken(element, token);
        }
        for (var _b = 0, _c = this.getTokensForElement(element); _b < _c.length; _b++) {
            var token = _c[_b];
            if (!newTokenSet.has(token)) {
                this.elementUnmatchedToken(element, token);
            }
        }
    };
    // Private
    TokenListObserver.prototype.elementMatchedToken = function (element, token) {
        if (!this.tokensByElement.has(element, token)) {
            this.tokensByElement.add(element, token);
            if (this.delegate.elementMatchedTokenForAttribute) {
                this.delegate.elementMatchedTokenForAttribute(element, token, this.attributeName);
            }
        }
    };
    TokenListObserver.prototype.elementUnmatchedToken = function (element, token) {
        if (this.tokensByElement.has(element, token)) {
            this.tokensByElement.delete(element, token);
            if (this.delegate.elementUnmatchedTokenForAttribute) {
                this.delegate.elementUnmatchedTokenForAttribute(element, token, this.attributeName);
            }
        }
    };
    TokenListObserver.prototype.getTokensForElement = function (element) {
        return this.tokensByElement.getValuesForKey(element);
    };
    TokenListObserver.prototype.readTokenSetForElement = function (element) {
        var tokens = new Set;
        var value = element.getAttribute(this.attributeName) || "";
        for (var _i = 0, _a = value.split(/\s+/); _i < _a.length; _i++) {
            var token = _a[_i];
            if (token.length) {
                tokens.add(token);
            }
        }
        return tokens;
    };
    return TokenListObserver;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5fbGlzdF9vYnNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzdGltdWx1cy9tdXRhdGlvbi1vYnNlcnZlcnMvc3JjL3Rva2VuX2xpc3Rfb2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGVBQWUsRUFBMkIsTUFBTSxvQkFBb0IsQ0FBQTtBQUM3RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFPcEQ7SUFPRSwyQkFBWSxPQUFnQixFQUFFLGFBQXFCLEVBQUUsUUFBbUM7UUFDdEYsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7UUFFeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDekQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLGVBQWUsQ0FBQTtJQUM1QyxDQUFDO0lBRUQsc0JBQUksc0NBQU87YUFBWDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQTtRQUNyQyxDQUFDOzs7T0FBQTtJQUVELGlDQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQzlCLENBQUM7SUFFRCxnQ0FBSSxHQUFKO1FBQ0UsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUM3QixDQUFDO0lBRUQsbUNBQU8sR0FBUDtRQUNFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDaEMsQ0FBQztJQUVELHNCQUFJLHNDQUFPO2FBQVg7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUE7UUFDckMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx1Q0FBUTthQUFaO1lBQ0UsTUFB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

/***/ }),
/* 22 */
/*!**************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/scope.js ***!
  \**************************************************************/
/*! exports provided: Scope */
/*! exports used: Scope */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Scope; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_map__ = __webpack_require__(/*! ./data_map */ 23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__target_set__ = __webpack_require__(/*! ./target_set */ 24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__selectors__ = __webpack_require__(/*! ./selectors */ 9);



var Scope = /** @class */ (function () {
    function Scope(schema, identifier, element) {
        this.schema = schema;
        this.identifier = identifier;
        this.element = element;
        this.targets = new __WEBPACK_IMPORTED_MODULE_1__target_set__["a" /* TargetSet */](this);
        this.data = new __WEBPACK_IMPORTED_MODULE_0__data_map__["a" /* DataMap */](this);
    }
    Scope.prototype.findElement = function (selector) {
        return this.findAllElements(selector)[0];
    };
    Scope.prototype.findAllElements = function (selector) {
        var head = this.element.matches(selector) ? [this.element] : [];
        var tail = this.filterElements(Array.from(this.element.querySelectorAll(selector)));
        return head.concat(tail);
    };
    Scope.prototype.filterElements = function (elements) {
        var _this = this;
        return elements.filter(function (element) { return _this.containsElement(element); });
    };
    Scope.prototype.containsElement = function (element) {
        return element.closest(this.controllerSelector) === this.element;
    };
    Object.defineProperty(Scope.prototype, "controllerSelector", {
        get: function () {
            return Object(__WEBPACK_IMPORTED_MODULE_2__selectors__["a" /* attributeValueContainsToken */])(this.schema.controllerAttribute, this.identifier);
        },
        enumerable: true,
        configurable: true
    });
    return Scope;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NvcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvY29yZS9zcmMvc2NvcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQTtBQUVwQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBQ3hDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQUV6RDtJQU9FLGVBQVksTUFBYyxFQUFFLFVBQWtCLEVBQUUsT0FBZ0I7UUFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7UUFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQy9CLENBQUM7SUFFRCwyQkFBVyxHQUFYLFVBQVksUUFBZ0I7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDMUMsQ0FBQztJQUVELCtCQUFlLEdBQWYsVUFBZ0IsUUFBZ0I7UUFDOUIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDakUsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JGLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFRCw4QkFBYyxHQUFkLFVBQWUsUUFBbUI7UUFBbEMsaUJBRUM7UUFEQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQTdCLENBQTZCLENBQUMsQ0FBQTtJQUNsRSxDQUFDO0lBRUQsK0JBQWUsR0FBZixVQUFnQixPQUFnQjtRQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ2xFLENBQUM7SUFFRCxzQkFBWSxxQ0FBa0I7YUFBOUI7WUFDRSxNQUFNLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDdEYsQ0FBQzs7O09BQUE7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQXBDRCxJQW9DQyJ9

/***/ }),
/* 23 */
/*!*****************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/data_map.js ***!
  \*****************************************************************/
/*! exports provided: DataMap */
/*! exports used: DataMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataMap; });
var DataMap = /** @class */ (function () {
    function DataMap(scope) {
        this.scope = scope;
    }
    Object.defineProperty(DataMap.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataMap.prototype, "identifier", {
        get: function () {
            return this.scope.identifier;
        },
        enumerable: true,
        configurable: true
    });
    DataMap.prototype.get = function (key) {
        key = this.getFormattedKey(key);
        return this.element.getAttribute(key);
    };
    DataMap.prototype.set = function (key, value) {
        key = this.getFormattedKey(key);
        this.element.setAttribute(key, value);
        return this.get(key);
    };
    DataMap.prototype.has = function (key) {
        key = this.getFormattedKey(key);
        return this.element.hasAttribute(key);
    };
    DataMap.prototype.delete = function (key) {
        if (this.has(key)) {
            key = this.getFormattedKey(key);
            this.element.removeAttribute(key);
            return true;
        }
        else {
            return false;
        }
    };
    DataMap.prototype.getFormattedKey = function (key) {
        return "data-" + this.identifier + "-" + dasherize(key);
    };
    return DataMap;
}());

function dasherize(value) {
    return value.toString().replace(/([A-Z])/g, function (_, char) { return "-" + char.toLowerCase(); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YV9tYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvY29yZS9zcmMvZGF0YV9tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7SUFHRSxpQkFBWSxLQUFZO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0lBQ3BCLENBQUM7SUFFRCxzQkFBSSw0QkFBTzthQUFYO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBO1FBQzNCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksK0JBQVU7YUFBZDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQTtRQUM5QixDQUFDOzs7T0FBQTtJQUVELHFCQUFHLEdBQUgsVUFBSSxHQUFXO1FBQ2IsR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3ZDLENBQUM7SUFFRCxxQkFBRyxHQUFILFVBQUksR0FBVyxFQUFFLEtBQUs7UUFDcEIsR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxxQkFBRyxHQUFILFVBQUksR0FBVztRQUNiLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN2QyxDQUFDO0lBRUQsd0JBQU0sR0FBTixVQUFPLEdBQVc7UUFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQTtRQUNiLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxLQUFLLENBQUE7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUVPLGlDQUFlLEdBQXZCLFVBQXdCLEdBQUc7UUFDekIsTUFBTSxDQUFDLFVBQVEsSUFBSSxDQUFDLFVBQVUsU0FBSSxTQUFTLENBQUMsR0FBRyxDQUFHLENBQUE7SUFDcEQsQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBNUNELElBNENDOztBQUVELG1CQUFtQixLQUFLO0lBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFDLENBQUMsRUFBRSxJQUFJLElBQUssT0FBQSxNQUFJLElBQUksQ0FBQyxXQUFXLEVBQUksRUFBeEIsQ0FBd0IsQ0FBQyxDQUFBO0FBQ3BGLENBQUMifQ==

/***/ }),
/* 24 */
/*!*******************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/target_set.js ***!
  \*******************************************************************/
/*! exports provided: TargetSet */
/*! exports used: TargetSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TargetSet; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__selectors__ = __webpack_require__(/*! ./selectors */ 9);

var TargetSet = /** @class */ (function () {
    function TargetSet(scope) {
        this.scope = scope;
    }
    Object.defineProperty(TargetSet.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TargetSet.prototype, "identifier", {
        get: function () {
            return this.scope.identifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TargetSet.prototype, "schema", {
        get: function () {
            return this.scope.schema;
        },
        enumerable: true,
        configurable: true
    });
    TargetSet.prototype.has = function (targetName) {
        return this.find(targetName) != null;
    };
    TargetSet.prototype.find = function () {
        var targetNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            targetNames[_i] = arguments[_i];
        }
        var selector = this.getSelectorForTargetNames(targetNames);
        return this.scope.findElement(selector);
    };
    TargetSet.prototype.findAll = function () {
        var targetNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            targetNames[_i] = arguments[_i];
        }
        var selector = this.getSelectorForTargetNames(targetNames);
        return this.scope.findAllElements(selector);
    };
    TargetSet.prototype.getSelectorForTargetNames = function (targetNames) {
        var _this = this;
        return targetNames.map(function (targetName) { return _this.getSelectorForTargetName(targetName); }).join(", ");
    };
    TargetSet.prototype.getSelectorForTargetName = function (targetName) {
        var targetDescriptor = this.identifier + "." + targetName;
        return Object(__WEBPACK_IMPORTED_MODULE_0__selectors__["a" /* attributeValueContainsToken */])(this.schema.targetAttribute, targetDescriptor);
    };
    return TargetSet;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0X3NldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzdGltdWx1cy9jb3JlL3NyYy90YXJnZXRfc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGFBQWEsQ0FBQTtBQUV6RDtJQUdFLG1CQUFZLEtBQVk7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7SUFDcEIsQ0FBQztJQUVELHNCQUFJLDhCQUFPO2FBQVg7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUE7UUFDM0IsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxpQ0FBVTthQUFkO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFBO1FBQzlCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksNkJBQU07YUFBVjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQTtRQUMxQixDQUFDOzs7T0FBQTtJQUVELHVCQUFHLEdBQUgsVUFBSSxVQUFrQjtRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUE7SUFDdEMsQ0FBQztJQUVELHdCQUFJLEdBQUo7UUFBSyxxQkFBd0I7YUFBeEIsVUFBd0IsRUFBeEIscUJBQXdCLEVBQXhCLElBQXdCO1lBQXhCLGdDQUF3Qjs7UUFDM0IsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUN6QyxDQUFDO0lBRUQsMkJBQU8sR0FBUDtRQUFRLHFCQUF3QjthQUF4QixVQUF3QixFQUF4QixxQkFBd0IsRUFBeEIsSUFBd0I7WUFBeEIsZ0NBQXdCOztRQUM5QixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDNUQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzdDLENBQUM7SUFFTyw2Q0FBeUIsR0FBakMsVUFBa0MsV0FBcUI7UUFBdkQsaUJBRUM7UUFEQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFVBQVUsSUFBSSxPQUFBLEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM1RixDQUFDO0lBRU8sNENBQXdCLEdBQWhDLFVBQWlDLFVBQWtCO1FBQ2pELElBQU0sZ0JBQWdCLEdBQU0sSUFBSSxDQUFDLFVBQVUsU0FBSSxVQUFZLENBQUE7UUFDM0QsTUFBTSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUE7SUFDbkYsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXpDRCxJQXlDQyJ9

/***/ }),
/* 25 */
/*!*******************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/definition.js ***!
  \*******************************************************************/
/*! exports provided: blessDefinition */
/*! exports used: blessDefinition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = blessDefinition;
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function blessDefinition(definition) {
    return {
        identifier: definition.identifier,
        controllerConstructor: blessControllerConstructor(definition.controllerConstructor)
    };
}
function blessControllerConstructor(controllerConstructor) {
    var constructor = extend(controllerConstructor);
    constructor.bless();
    return constructor;
}
var extend = (function () {
    function extendWithReflect(constructor) {
        function Controller() {
            var _newTarget = this && this instanceof Controller ? this.constructor : void 0;
            return Reflect.construct(constructor, arguments, _newTarget);
        }
        Controller.prototype = Object.create(constructor.prototype, {
            constructor: { value: Controller }
        });
        Reflect.setPrototypeOf(Controller, constructor);
        return Controller;
    }
    function testReflectExtension() {
        var a = function () { this.a.call(this); };
        var b = extendWithReflect(a);
        b.prototype.a = function () { };
        return new b;
    }
    try {
        testReflectExtension();
        return extendWithReflect;
    }
    catch (error) {
        return function (constructor) { return /** @class */ (function (_super) {
            __extends(Controller, _super);
            function Controller() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Controller;
        }(constructor)); };
    }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzdGltdWx1cy9jb3JlL3NyYy9kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFPQSxNQUFNLDBCQUEwQixVQUFzQjtJQUNwRCxNQUFNLENBQUM7UUFDTCxVQUFVLEVBQUUsVUFBVSxDQUFDLFVBQVU7UUFDakMscUJBQXFCLEVBQUUsMEJBQTBCLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDO0tBQ3BGLENBQUE7QUFDSCxDQUFDO0FBRUQsb0NBQW9DLHFCQUE0QztJQUM5RSxJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTtJQUNqRCxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbkIsTUFBTSxDQUFDLFdBQVcsQ0FBQTtBQUNwQixDQUFDO0FBRUQsSUFBTSxNQUFNLEdBQUcsQ0FBQztJQUNkLDJCQUEyQixXQUFXO1FBQ3BDOztZQUNFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxTQUFTLGFBQWEsQ0FBQTtRQUM5RCxDQUFDO1FBRUQsVUFBVSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7WUFDMUQsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtTQUNuQyxDQUFDLENBQUE7UUFFRixPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUMvQyxNQUFNLENBQUMsVUFBaUIsQ0FBQTtJQUMxQixDQUFDO0lBRUQ7UUFDRSxJQUFNLENBQUMsR0FBRyxjQUFhLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFBO1FBQzFDLElBQU0sQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzlCLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLGNBQVksQ0FBQyxDQUFBO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNkLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDSCxvQkFBb0IsRUFBRSxDQUFBO1FBQ3RCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQTtJQUMxQixDQUFDO0lBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNmLE1BQU0sQ0FBQyxVQUFDLFdBQVcsSUFBSztZQUF5Qiw4QkFBVztZQUFwQzs7WUFBc0MsQ0FBQztZQUFELGlCQUFDO1FBQUQsQ0FBQyxBQUF2QyxDQUF5QixXQUFXLElBQXBDLENBQXVDLENBQUE7SUFDakUsQ0FBQztBQUNILENBQUMsQ0FBQyxFQUFFLENBQUEifQ==

/***/ }),
/* 26 */
/*!*******************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/controller.js ***!
  \*******************************************************************/
/*! exports provided: Controller */
/*! exports used: Controller */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Controller; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__target_properties__ = __webpack_require__(/*! ./target_properties */ 27);

var Controller = /** @class */ (function () {
    function Controller(context) {
        this.context = context;
    }
    Controller.bless = function () {
        Object(__WEBPACK_IMPORTED_MODULE_0__target_properties__["a" /* defineTargetProperties */])(this);
    };
    Object.defineProperty(Controller.prototype, "application", {
        get: function () {
            return this.context.application;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "scope", {
        get: function () {
            return this.context.scope;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "element", {
        get: function () {
            return this.scope.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "identifier", {
        get: function () {
            return this.scope.identifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "targets", {
        get: function () {
            return this.scope.targets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "data", {
        get: function () {
            return this.scope.data;
        },
        enumerable: true,
        configurable: true
    });
    Controller.prototype.initialize = function () {
        // Override in your subclass to set up initial controller state
    };
    Controller.prototype.connect = function () {
        // Override in your subclass to respond when the controller is connected to the DOM
    };
    Controller.prototype.disconnect = function () {
        // Override in your subclass to respond when the controller is disconnected from the DOM
    };
    Controller.targets = [];
    return Controller;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL0BzdGltdWx1cy9jb3JlL3NyYy9jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHFCQUFxQixDQUFBO0FBTzVEO0lBU0Usb0JBQVksT0FBZ0I7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7SUFDeEIsQ0FBQztJQU5NLGdCQUFLLEdBQVo7UUFDRSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM5QixDQUFDO0lBTUQsc0JBQUksbUNBQVc7YUFBZjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQTtRQUNqQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDZCQUFLO2FBQVQ7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUE7UUFDM0IsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSwrQkFBTzthQUFYO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBO1FBQzNCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksa0NBQVU7YUFBZDtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQTtRQUM5QixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLCtCQUFPO2FBQVg7WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUE7UUFDM0IsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSw0QkFBSTthQUFSO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO1FBQ3hCLENBQUM7OztPQUFBO0lBRUQsK0JBQVUsR0FBVjtRQUNFLCtEQUErRDtJQUNqRSxDQUFDO0lBRUQsNEJBQU8sR0FBUDtRQUNFLG1GQUFtRjtJQUNyRixDQUFDO0lBRUQsK0JBQVUsR0FBVjtRQUNFLHdGQUF3RjtJQUMxRixDQUFDO0lBOUNNLGtCQUFPLEdBQWEsRUFBRSxDQUFBO0lBK0MvQixpQkFBQztDQUFBLEFBaERELElBZ0RDO1NBaERZLFVBQVUifQ==

/***/ }),
/* 27 */
/*!**************************************************************************!*\
  !*** ./node_modules/@stimulus/core/dist/module/src/target_properties.js ***!
  \**************************************************************************/
/*! exports provided: defineTargetProperties */
/*! exports used: defineTargetProperties */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = defineTargetProperties;
function defineTargetProperties(constructor) {
    var prototype = constructor.prototype;
    var targetNames = getTargetNamesForConstructor(constructor);
    targetNames.forEach(function (name) {
        return defineLinkedProperties(prototype, (_a = {},
            _a[name + "Target"] = {
                get: function () {
                    var target = this.targets.find(name);
                    if (target) {
                        return target;
                    }
                    else {
                        throw new Error("Missing target element \"" + this.identifier + "." + name + "\"");
                    }
                }
            },
            _a[name + "Targets"] = {
                get: function () {
                    return this.targets.findAll(name);
                }
            },
            _a["has" + capitalize(name) + "Target"] = {
                get: function () {
                    return this.targets.has(name);
                }
            },
            _a));
        var _a;
    });
}
function getTargetNamesForConstructor(constructor) {
    var ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce(function (targetNames, constructor) {
        getOwnTargetNamesForConstructor(constructor).forEach(function (name) { return targetNames.add(name); });
        return targetNames;
    }, new Set));
}
function getAncestorsForConstructor(constructor) {
    var ancestors = [];
    while (constructor) {
        ancestors.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors;
}
function getOwnTargetNamesForConstructor(constructor) {
    var definition = constructor["targets"];
    return Array.isArray(definition) ? definition : [];
}
function defineLinkedProperties(object, properties) {
    Object.keys(properties).forEach(function (name) {
        if (!(name in object)) {
            var descriptor = properties[name];
            Object.defineProperty(object, name, descriptor);
        }
    });
}
function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyZ2V0X3Byb3BlcnRpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvY29yZS9zcmMvdGFyZ2V0X3Byb3BlcnRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxpQ0FBaUMsV0FBcUI7SUFDMUQsSUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQTtJQUN2QyxJQUFNLFdBQVcsR0FBRyw0QkFBNEIsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUM3RCxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtRQUFJLE9BQUEsc0JBQXNCLENBQUMsU0FBUztZQUMxRCxHQUFJLElBQUksV0FBUSxJQUFHO2dCQUNqQixHQUFHO29CQUNELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO29CQUN0QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNYLE1BQU0sQ0FBQyxNQUFNLENBQUE7b0JBQ2YsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixNQUFNLElBQUksS0FBSyxDQUFDLDhCQUEyQixJQUFJLENBQUMsVUFBVSxTQUFJLElBQUksT0FBRyxDQUFDLENBQUE7b0JBQ3hFLENBQUM7Z0JBQ0gsQ0FBQzthQUNGO1lBQ0QsR0FBSSxJQUFJLFlBQVMsSUFBRztnQkFDbEIsR0FBRztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ25DLENBQUM7YUFDRjtZQUNELEdBQUMsUUFBTSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVEsSUFBRztnQkFDaEMsR0FBRztvQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQy9CLENBQUM7YUFDRjtnQkFDRDs7SUFyQjBCLENBcUIxQixDQUFDLENBQUE7QUFDTCxDQUFDO0FBRUQsc0NBQXNDLFdBQXFCO0lBQ3pELElBQU0sU0FBUyxHQUFHLDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ3pELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQyxXQUFXLEVBQUUsV0FBVztRQUMxRCwrQkFBK0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUE7UUFDbkYsTUFBTSxDQUFDLFdBQVcsQ0FBQTtJQUNwQixDQUFDLEVBQUUsSUFBSSxHQUFrQixDQUFDLENBQUMsQ0FBQTtBQUM3QixDQUFDO0FBRUQsb0NBQW9DLFdBQXFCO0lBQ3ZELElBQU0sU0FBUyxHQUFlLEVBQUUsQ0FBQTtJQUNoQyxPQUFPLFdBQVcsRUFBRSxDQUFDO1FBQ25CLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDM0IsV0FBVyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUNELE1BQU0sQ0FBQyxTQUFTLENBQUE7QUFDbEIsQ0FBQztBQUVELHlDQUF5QyxXQUFxQjtJQUM1RCxJQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0FBQ3BELENBQUM7QUFFRCxnQ0FBZ0MsTUFBVyxFQUFFLFVBQWlDO0lBQzVFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtRQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbkMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBQ2pELENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxvQkFBb0IsSUFBWTtJQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3JELENBQUMifQ==

/***/ }),
/* 28 */
/*!**************************************************!*\
  !*** ./node_modules/stimulus/webpack-helpers.js ***!
  \**************************************************/
/*! exports provided: definitionsFromContext, identifierForContextKey */
/*! exports used: definitionsFromContext */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stimulus_webpack_helpers__ = __webpack_require__(/*! @stimulus/webpack-helpers */ 29);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__stimulus_webpack_helpers__["a"]; });



/***/ }),
/* 29 */
/*!*********************************************************************!*\
  !*** ./node_modules/@stimulus/webpack-helpers/dist/module/index.js ***!
  \*********************************************************************/
/*! exports provided: definitionsFromContext, identifierForContextKey */
/*! exports used: definitionsFromContext */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = definitionsFromContext;
/* unused harmony export identifierForContextKey */
function definitionsFromContext(context) {
    return context.keys()
        .map(function (key) { return definitionForModuleWithContextAndKey(context, key); })
        .filter(function (value) { return value; });
}
function definitionForModuleWithContextAndKey(context, key) {
    var identifier = identifierForContextKey(key);
    if (identifier) {
        return definitionForModuleAndIdentifier(context(key), identifier);
    }
}
function definitionForModuleAndIdentifier(module, identifier) {
    var controllerConstructor = module.default;
    if (typeof controllerConstructor == "function") {
        return { identifier: identifier, controllerConstructor: controllerConstructor };
    }
}
function identifierForContextKey(key) {
    var logicalName = (key.match(/^(?:\.\/)?(.+)(?:[_-]controller\..+?)$/) || [])[1];
    if (logicalName) {
        return logicalName.replace(/_/g, "-").replace(/\//g, "--");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wYWNrYWdlcy9Ac3RpbXVsdXMvd2VicGFjay1oZWxwZXJzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLE1BQU0saUNBQWlDLE9BQTBDO0lBQy9FLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO1NBQ2xCLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLG9DQUFvQyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBbEQsQ0FBa0QsQ0FBQztTQUM5RCxNQUFNLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLEVBQUwsQ0FBSyxDQUFpQixDQUFBO0FBQzNDLENBQUM7QUFFRCw4Q0FBOEMsT0FBMEMsRUFBRSxHQUFXO0lBQ25HLElBQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQy9DLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDZixNQUFNLENBQUMsZ0NBQWdDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQ25FLENBQUM7QUFDSCxDQUFDO0FBRUQsMENBQTBDLE1BQXdCLEVBQUUsVUFBa0I7SUFDcEYsSUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFBO0lBQzVDLEVBQUUsQ0FBQyxDQUFDLE9BQU8scUJBQXFCLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsRUFBRSxVQUFVLFlBQUEsRUFBRSxxQkFBcUIsdUJBQUEsRUFBRSxDQUFBO0lBQzlDLENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTSxrQ0FBa0MsR0FBVztJQUNqRCxJQUFNLFdBQVcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsd0NBQXdDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNsRixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQzVELENBQUM7QUFDSCxDQUFDIn0=

/***/ }),
/* 30 */
/*!*****************************************!*\
  !*** ./app/javascript/controllers .js$ ***!
  \*****************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./player_controller.js": 31
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 30;

/***/ }),
/* 31 */
/*!*********************************************************!*\
  !*** ./app/javascript/controllers/player_controller.js ***!
  \*********************************************************/
/*! exports provided: default */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_stimulus__ = __webpack_require__(/*! stimulus */ 1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_amplitudejs__ = __webpack_require__(/*! amplitudejs */ 32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_amplitudejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_amplitudejs__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var _class = function (_Controller) {
  _inherits(_class, _Controller);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
  }

  _createClass(_class, [{
    key: "initialize",
    value: function initialize() {
      __WEBPACK_IMPORTED_MODULE_1_amplitudejs__["Amplitude"].init({
        songs: []
      });
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
      this.toggleTarget.classList.toggle("playing");
    }
  }, {
    key: "play",
    value: function play() {
      var _this2 = this;

      this.audioTarget.play();
      setInterval(function () {
        return _this2.updateScrub(_this2.audioTarget, _this2.scrubTarget);
      }, 1000);
    }
  }, {
    key: "pause",
    value: function pause() {
      var _this3 = this;

      this.audioTarget.pause();
      clearInterval(function () {
        return _this3.updateScrub(_this3.audioTarget, _this3.scrubTarget);
      });
    }
  }, {
    key: "forward",
    value: function forward() {
      this.seek(30);
    }
  }, {
    key: "back",
    value: function back() {
      this.seek(-15);
    }
  }, {
    key: "seek",
    value: function seek(delta) {
      var newTime = this.audioTarget.currentTime + delta;
      var endTime = this.audioTarget.seekable.end(0);

      if (newTime < 0) {
        this.audioTarget.currentTime = 0;
      } else if (newTime > endTime) {
        this.audioTarget.currentTime = endTime;
      } else {
        this.audioTarget.currentTime = newTime;
      }
    }
  }, {
    key: "scrub",
    value: function scrub() {
      this.audioTarget.currentTime = this.audioTarget.seekable.end(0) * this.scrubTarget.value;
    }
  }, {
    key: "load",
    value: function load(e) {
      this.audioTarget.src = e.target.dataset.audio;
      this.play();
      this.toggleTarget.classList.toggle("playing", true);
    }

    // Internal

  }, {
    key: "render",
    value: function render(template, locals) {
      var pug = __webpack_require__(/*! ../partials */ 33)("./" + template + ".pug");
      return pug(locals);
    }
  }, {
    key: "episodeFrom",
    value: function episodeFrom(element) {
      return {
        episode: element.dataset.episode,
        podcast: element.dataset.podcast,
        date: element.dataset.date,
        audio: element.dataset.audio
      };
    }
  }, {
    key: "isPlaying",
    value: function isPlaying() {
      this.toggleTarget.classList.contains("playing");
    }
  }, {
    key: "updateScrub",
    value: function updateScrub(audio, scrub) {
      scrub.value = audio.currentTime / audio.seekable.end(0);
    }
  }]);

  return _class;
}(__WEBPACK_IMPORTED_MODULE_0_stimulus__["b" /* Controller */]);

Object.defineProperty(_class, "targets", {
  enumerable: true,
  writable: true,
  value: ["audio", "toggle", "scrub"]
});
/* harmony default export */ __webpack_exports__["default"] = (_class);

/***/ }),
/* 32 */
/*!****************************************************!*\
  !*** ./node_modules/amplitudejs/dist/amplitude.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! exports used: Amplitude */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Amplitude", [], factory);
	else if(typeof exports === 'object')
		exports["Amplitude"] = factory();
	else
		root["Amplitude"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * These variables make Amplitude run. The config is the most important
 * containing active settings and parameters.
 *
 * The config JSON is the global settings for ALL of Amplitude functions.
 * This is global and contains all of the user preferences. The default
 * settings are set, and the user overwrites them when they initialize
 * Amplitude.
 *
 * @module config
 * @type {object}
 * @property {string}  	config.version          				- The current version of AmplitudeJS.
 * @property {object} 	config.active_song 		 					-	Handles all of the audio.
 * @property {object} 	config.active_metadata					- Contains the active metadata for the song.
 * @property {string} 	config.active_album							- Holds the active album name. Used to check and see if the album changed and run the album changed callback.
 * @property {number} 	config.active_index							- Contains the index of the actively playing song.
 * @property {string} 	config.active_playlist					- Contains the key to the active playlist index.
 * @property {boolean}	config.autoplay									- Set to true to autoplay the song
 * @property {number} 	config.playback_speed						- Sets the initial playback speed of the song. The values for this can be 1.0, 1.5, 2.0
 * @property {object} 	config.callbacks								- The user can pass a JSON object with a key => value store of callbacks to be run at certain events.
 * @property {array} 		config.songs										- Contains all of the songs the user has passed to Amplitude to use.
 * @property {object} 	config.playlists								- Contains all of the playlists the user created.
 * @property {object} 	config.start_song 							- The index of the song that AmplitudeJS should start with.
 * @property {object} 	config.shuffled_playlists				- Will contain shuffled playlists.
 * @property {string} 	config.starting_playlist 				- The starting playlist the player will intiialize to.
 * @property {object} 	config.shuffled_statuses 				- Contains whether the current playlist is in shuffle mode or not.
 * @property {object} 	config.repeat_statuses 					- Contains whether the playlist is in repeat mode or not.
 * @property {object} 	config.shuffled_active_indexes	- Contains the active index in a shuffled playlist.
 * @property {boolean} 	config.repeat 									- When repeat is on, when the song ends the song will replay itself.
 * @property {object} 	config.shuffle_list							- When shuffled, gets populated with the songs the user provided in a random order.
 * @property {boolean} 	config.shuffle_on								- When on, gets set to true so when traversing through songs, AmplitudeJS knows whether or not to use the songs object or the shuffle_list
 * @property {number} 	config.shuffle_active_index 		- When shuffled, this index is used to let AmplitudeJS know where it's at when traversing.
 * @property {string}		config.default_album_art 				- The user can set default album art to be displayed if the song they set doesn't contain album art.
 * @property {boolean} 	config.debug										- When set to true, AmplitudeJS will print to the console any errors providing helpful feedback to the user.
 * @property {number} 	config.volume 									- The user can set the initial volume to a number between 0 and 1 over-riding the default of .5
 * @property {number} 	config.pre_mute_volume 					- This is set on mute so that when a user un-mutes AmplitudeJS knows what to restore the volume to.
 * @property {number}		config.volume_increment 				- The default values are an integer between 1 and 100 for how much the volume should increase when the user presses the volume up button.
 * @property {number}		config.volume_decrement 				- The default values are an integer between 1 and 100 for how much the volume should decrease when the user presses the volume down button.
 * @property {string} 	config.soundcloud_client 				- When using SoundCloud, the user will have to provide their API Client ID
 * @property {boolean} 	config.soundcloud_use_art 			- The user can set this to true and AmplitudeJS will use the album art for the song returned from the Soundcloud API
 * @property {number} 	config.soundcloud_song_count 		- Used on config to count how many songs are from Soundcloud and compare it to how many are ready for when to move to the rest of the configuration
 * @property {number} 	config.soundcloud_songs_ready 	- Used on config to count how many songs are ready so when we get all of the data from the SoundCloud API that we need this should match the SoundCloud song count meaning we can move to the rest of the config.
 * @property {integer}	config.is_touch_moving 					- Flag for if the user is moving the screen.
 * @property {boolean}	config.buffered									- How much of the song is buffered.
 * @property {object} 	config.bindings									- Array of bindings to certain key events.
 * @property {boolean} 	config.continue_next 						- Determines when a song ends, we should continue to the next song.
 */
module.exports = {
  version: '3.3.0',

  active_song: new Audio(),

  active_metadata: {},

  active_album: '',

  active_index: 0,

  active_playlist: '',

  autoplay: false,

  playback_speed: 1.0,

  callbacks: {},

  songs: [],

  playlists: {},

  start_song: '',

  shuffled_playlists: {},

  starting_playlist: '',

  shuffled_statuses: {},

  shuffled_active_indexes: {},

  repeat_statuses: {},

  repeat: false,

  repeat_song: false,

  shuffle_list: {},

  shuffle_on: false,

  shuffle_active_index: 0,

  default_album_art: '',

  debug: false,

  volume: .5,

  pre_mute_volume: .5,

  volume_increment: 5,

  volume_decrement: 5,

  soundcloud_client: '',

  soundcloud_use_art: false,

  soundcloud_song_count: 0,

  soundcloud_songs_ready: 0,

  is_touch_moving: false,

  buffered: 0,

  bindings: {},

  continue_next: true
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _core = __webpack_require__(3);

var _core2 = _interopRequireDefault(_core);

var _visual = __webpack_require__(2);

var _visual2 = _interopRequireDefault(_visual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * For the sake of code clarity, these functions perform helper tasks
 * assisting the logical functions with what they need such as setting
 * the proper song index after an event has occured.
 *
 * @module core/AmplitudeHelpers
 */


/**
 * AmplitudeJS Core Module
 * @module core/AmplitudeCore
 */
var AmplitudeHelpers = function () {
	/**
  * Resets the config to the default state. This is called on initialize
  * to ensure the user's config is what matters.
  *
  * Public Accessor: AmplitudeHelpers.resetConfig()
  *
  * @access public
  */
	function resetConfig() {
		_config2.default.active_song = new Audio();
		_config2.default.active_metadata = {};
		_config2.default.active_album = '';
		_config2.default.active_index = 0;
		_config2.default.active_playlist = '';
		_config2.default.active_playlist = '';
		_config2.default.autoplay = false;
		_config2.default.playback_speed = 1.0;
		_config2.default.callbacks = {};
		_config2.default.songs = [];
		_config2.default.playlists = {};
		_config2.default.start_song = '';
		_config2.default.shuffled_playlists = {};
		_config2.default.shuffled_statuses = {};
		_config2.default.repeat = false;
		_config2.default.shuffle_list = {};
		_config2.default.shuffle_on = false;
		_config2.default.shuffle_active_index = 0;
		_config2.default.default_album_art = '';
		_config2.default.debug = false;
		_config2.default.handle_song_elements = true;
		_config2.default.volume = .5;
		_config2.default.pre_mute_volume = .5;
		_config2.default.volume_increment = 5;
		_config2.default.volume_decrement = 5;
		_config2.default.soundcloud_client = '';
		_config2.default.soundcloud_use_art = false;
		_config2.default.soundcloud_song_count = 0;
		_config2.default.soundcloud_songs_ready = 0;
		_config2.default.continue_next = true;
	}

	/**
  * Writes out debug message to the console if enabled.
  *
  * Public Accessor: AmplitudeHelpers.writeDebugMessage( message )
  *
  * @access public
  * @param {string} message - The string that gets printed to alert the user of a debugging error.
  */
	function writeDebugMessage(message) {
		if (_config2.default.debug) {
			console.log(message);
		}
	}

	/**
  * Runs a user defined callback method
  *
  * Public Accessor: AmplitudeHelpers.runCallback( callbackName )
  *
  * @access public
  * @param {string} callbackName - The name of the callback we are going to run.
  */
	function runCallback(callbackName) {
		/*
  	Checks to see if a user defined a callback method for the
  	callback we are running.
  */
		if (_config2.default.callbacks[callbackName]) {
			/*
   	Build the callback function
   */
			var callbackFunction = _config2.default.callbacks[callbackName];

			/*
   	Write a debug message stating the callback we are running
   */
			writeDebugMessage('Running Callback: ' + callbackName);

			/*
   	Run the callback function and catch any errors
   */
			try {
				callbackFunction();
			} catch (error) {
				if (error.message == "CANCEL EVENT") {
					throw error;
				} else {
					writeDebugMessage('Callback error: ' + error.message);
				}
			}
		}
	}

	/**
  * Changes the active song in the config. This happens in multiple
  * scenarios: The user clicks a play button that has an index that is
  * different than what is currently playing, the song ends and the next
  * song begins, etc.
  *
  * Public Accessor: AmplitudeHelpers.changeSong( songIndex )
  *
  * @access public
  * @param {number} songIndex - The song index we are changing to
  *
  */
	function changeSong(songIndex) {
		/*
  	Grab the song at the index defined by the user.
  */
		var song = _config2.default.songs[songIndex];

		/*
  	Stops the currently playing song so we can adjust
  	what we need.
  */
		_core2.default.stop();

		/**
   * @todo: Stop Visualization
   */

		/*
  	Set all play buttons to pause while we change
  	the song.
  */
		_visual2.default.setPlayPauseButtonsToPause();

		/*
  	Since it is a new song, we reset the song sliders. These
  	react to time updates and will eventually be updated but we
  	force update them is if there is a song slider bound to a
  	specific song, they won't update.
  */
		_visual2.default.resetSongSliders();

		/*
  	Resets the progress bars
  */
		_visual2.default.resetSongPlayedProgressBars();

		/*
  	Reset all the time place holders accordingly.
  */
		_visual2.default.resetTimes();

		/*
  	Run a callback if an album is going
  	to change.
  */
		if (checkNewAlbum(song)) {
			runCallback('album_change');
		}

		/*
  	Set the new song information so we can use the
  	active meta data later on.
  */
		setNewSong(song, songIndex);

		/*
  	Display the new visual metadata now that the config has
  	been changed. This will show the new song.
  */
		_visual2.default.displaySongMetadata();

		/*
  	Sets the active container. This is a class that
  	designers can use on an element that contains the current
  	song's controls to show it's highlighted.
  */
		_visual2.default.setActiveContainer();

		/*
  	Sets the active song's duration
  */
		_visual2.default.syncSongDuration();

		/*
  	Run song change callback.
  */
		runCallback('song_change');
	}

	/**
  * Checks to see if the new song to be played is different than the song
  * that is currently playing. To be true, the user would have selected
  * play on a new song with a new index. To be false, the user would have
  * clicked play/pause on the song that was playing.
  *
  * Public Accessor: AmplitudeHelpers.checkNewSong( songIndex )
  *
  * @access public
  * @param {number} songIndex - The index of the new song to be played.
  * @returns {boolean} True if we are setting a new song, false if we are not setting a new song.
  */
	function checkNewSong(songIndex) {
		if (songIndex != _config2.default.active_index) {
			return true;
		} else {
			return false;
		}
	}

	/**
  * Checks to see if there is a new album
  *
  * Public Accessor: AmplitudeHelpers.checkNewAlbum( new Album )
  *
  * @access public
  * @param {string} newAlbum - Checks to see if the new song will have a new album.
  * @returns {boolean} True if there is a new album, false if there is not a new ablum.
  */
	function checkNewAlbum(newAlbum) {
		if (_config2.default.active_album != newAlbum) {
			return true;
		} else {
			return false;
		}
	}

	/**
  * Checks to see if there is a new playlist
  *
  * Public Accessor: AmplitudeHelpers.checkNewPlaylist( playlist )
  *
  * @access public
  * @param {string} playlist - The playlist passed in to check against the active playlist.
  * @returns {boolean} True if there is a new playlist, false if there is not a new playlist.
  */
	function checkNewPlaylist(playlist) {
		if (_config2.default.active_playlist != playlist) {
			return true;
		} else {
			return false;
		}
	}

	/**
  * Sets the new song in the config. Sets the src of the audio object,
  * updates the	metadata and sets the active album.
  *
  * @access private
  * @param {object} song 	- The song object of the song we are changing to.
  * @param {number} index 	- The index of the song in the songs object we are changing.
  */
	function setNewSong(song, index) {
		_config2.default.active_song.src = song.url;
		_config2.default.active_metadata = song;
		_config2.default.active_album = song.album;
		_config2.default.active_index = index;
	}

	/**
  * Shuffles individual songs in the config
  * Based off of: http://www.codinghorror.com/blog/2007/12/the-danger-of-naivete.html
  *
  * Public Accessor: AmplitudeHelpers.shuffleSongs()
  *
  * @access public
  */
	function shuffleSongs() {
		/*
  	Builds a temporary array with the length of the config.
  */
		var shuffleTemp = new Array(_config2.default.songs.length);

		/*
  	Set the temporary array equal to the songs array.
  */
		for (var i = 0; i < _config2.default.songs.length; i++) {
			shuffleTemp[i] = _config2.default.songs[i];
			shuffleTemp[i].original_index = i;
		}

		/*
  	Iterate ove rthe songs and generate random numbers to
  	swap the indexes of the shuffle array.
  */
		for (var _i = _config2.default.songs.length - 1; _i > 0; _i--) {
			var randNum = Math.floor(Math.random() * _config2.default.songs.length + 1);
			shuffleSwap(shuffleTemp, _i, randNum - 1);
		}

		/*
  	Set the shuffle list to the shuffle temp.
  */
		_config2.default.shuffle_list = shuffleTemp;
	}

	/**
  * Shuffle songs in a playlist
  *
  * Public Accessor: AmplitudeHelpers.shufflePlaylistSongs( playlist )
  *
  * @access public
  * @param {string} playlist - The playlist we are shuffling.
  */
	function shufflePlaylistSongs(playlist) {
		/*
  	Builds a temporary array with the length of the playlist songs.
  */
		var shuffleTemp = new Array(_config2.default.playlists[playlist].length);

		/*
  	Set the temporary array equal to the playlist array.
  */
		for (var i = 0; i < _config2.default.playlists[playlist].length; i++) {
			shuffleTemp[i] = _config2.default.songs[_config2.default.playlists[playlist][i]];
			shuffleTemp[i].original_index = _config2.default.playlists[playlist][i];
		}

		/*
  	Iterate ove rthe songs and generate random numbers to
  	swap the indexes of the shuffle array.
  */
		for (var _i2 = _config2.default.playlists[playlist].length - 1; _i2 > 0; _i2--) {
			var randNum = Math.floor(Math.random() * _config2.default.playlists[playlist].length + 1);
			shuffleSwap(shuffleTemp, _i2, randNum - 1);
		}

		/*
  	Set the shuffle list to the shuffle temp.
  */
		_config2.default.shuffled_playlists[playlist] = shuffleTemp;
	}

	/**
  * Swaps and randomizes the song shuffle.
  *
  * @access private
  * @param {object} shuffleList 	- The list of songs that is going to be shuffled
  * @param {number} original 		- The original index of he song in the songs array
  * @param {number} random 			- The randomized index that will be the new index of the song in the shuffle array.
  */
	function shuffleSwap(shuffleList, original, random) {
		var temp = shuffleList[original];
		shuffleList[original] = shuffleList[random];
		shuffleList[random] = temp;
	}

	/**
  * Sets the active playlist
  *
  * Public Accessor: AmplitudeHelpers.setActivePlaylist( playlist )
  *
  * @access public
  * @param {string} playlist - The string of the playlist being set to active.
  */
	function setActivePlaylist(playlist) {
		/*
  	If the active playlist is different than the playlist being set,
  	we run the `playlist_changed` callback.
  */
		if (_config2.default.active_playlist != playlist) {
			runCallback('playlist_changed');
		}

		/*
  	Set the active playlist to the playlist parameter.
  */
		_config2.default.active_playlist = playlist;
	}

	/**
  * Determines if the string passed in is a URL or not
  *
  * Public Accessor: AmplitudeHelpers.isURL( url )
  *
  * @access public
  * @param {string} url - The string we are testing to see if it's a URL.
  * @returns {boolean} True if the string is a url, false if it is not.
  */
	function isURL(url) {
		/*
  	Test the string against the URL pattern and return if it matches
  */
		var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

		return pattern.test(url);
	}

	/**
  * Determines if what is passed in is an integer or not.
  *
  * Public Accessor: AmplitudeHelpers.isInt( int )
  *
  * @access public
  * @param {string|number} int - The variable we are testing to see is an integer or not.
  * @returns {boolean} If the variable is an integer or not.
  */
	function isInt(int) {
		return !isNaN(int) && parseInt(Number(int)) == int && !isNaN(parseInt(int, 10));
	}

	/*
 	Returns the public functions
 */
	return {
		resetConfig: resetConfig,
		writeDebugMessage: writeDebugMessage,
		runCallback: runCallback,
		changeSong: changeSong,
		checkNewSong: checkNewSong,
		checkNewAlbum: checkNewAlbum,
		checkNewPlaylist: checkNewPlaylist,
		shuffleSongs: shuffleSongs,
		shufflePlaylistSongs: shufflePlaylistSongs,
		setActivePlaylist: setActivePlaylist,
		isURL: isURL,
		isInt: isInt
	};
}();

/**
 * AmplitudeJS Visual Sync
 * @module visual/AmplitudeVisualSync
*/
/**
 * Imports the config module
 * @module config
 */
exports.default = AmplitudeHelpers;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _helpers = __webpack_require__(10);

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helps with the syncing of the display data
 *
 * @module visual/AmplitudeVisualSync
 */
/**
 * Imports the config module
 * @module config
 */
var AmplitudeVisualSync = function () {
	/**
  * Visually displays the current time on the screen. This is called on
  * time update for the current song.
  *
  * @access public
  * @param {object} currentTime 					- An object containing the current time for the song in seconds, minutes, and hours.
  * @param {float} completionPercentage	- The percent of the way through the song the user is at.
  */
	function syncCurrentTime(currentTime, completionPercentage) {
		/*
  	Set current hour display.
  */
		_helpers2.default.syncCurrentHours(currentTime.hours);

		/*
  	Set current minute display.
  */
		_helpers2.default.syncCurrentMinutes(currentTime.minutes);

		/*
  	Set current second display.
  */
		_helpers2.default.syncCurrentSeconds(currentTime.seconds);

		/*
  	Set current time display.
  */
		_helpers2.default.syncCurrentTime(currentTime);

		/*
  	Set all song sliders to be to the current percentage
  	of the song played.
  */
		syncMainSliderLocation(completionPercentage);
		syncPlaylistSliderLocation(_config2.default.active_playlist, completionPercentage);
		syncSongSliderLocation(_config2.default.active_playlist, _config2.default.active_index, completionPercentage);

		_helpers2.default.syncSongPlayedProgressBar(completionPercentage);
	}

	/**
  * Visually sync all of the times to the initial time of 0. This is so
  * we can keep all the players in sync
  *
  * @access public
  */
	function resetTimes() {
		_helpers2.default.resetCurrentHours();
		_helpers2.default.resetCurrentMinutes();
		_helpers2.default.resetCurrentSeconds();
		_helpers2.default.resetCurrentTime();
	}

	/**
  * Visually syncs the song sliders back to 0. This usually happens when
  * a song has changed, we ensure that all song sliders get reset.
  *
  * @access public
  */
	function resetSongSliders() {
		var songSliders = document.getElementsByClassName("amplitude-song-slider");

		/*
  	Iterate over all of the song sliders and set them to
  	0 essentially resetting them.
  */
		for (var i = 0; i < songSliders.length; i++) {
			songSliders[i].value = 0;
		}
	}

	/**
  * Sets all of the song buffered progress bars to 0
  *
  * @access public
  */
	function resetSongBufferedProgressBars() {
		/*
  	Gets all of the song buffered progress bars.
  */
		var songBufferedProgressBars = document.getElementsByClassName("amplitude-buffered-progress");

		/*
  	Iterate over all of the song buffered progress bar and
  	set them to 0 which is like re-setting them.
  */
		for (var i = 0; i < songBufferedProgressBars.length; i++) {
			songBufferedProgressBars[i].value = 0;
		}
	}

	/**
  * Sets all of the song played progress bars to 0
  *
  * @access public
  */
	function resetSongPlayedProgressBars() {
		var songPlayedProgressBars = document.getElementsByClassName("amplitude-song-played-progress");

		for (var i = 0; i < songPlayedProgressBars.length; i++) {
			songPlayedProgressBars[i].value = 0;
		}
	}

	/**
  * Applies the class 'amplitude-active-song-container' to the element
  * containing visual information regarding the active song.
  *
  * @access public
  */
	function setActiveContainer() {
		var songContainers = document.getElementsByClassName('amplitude-song-container');

		/*
  	Removes all of the active song containrs.
  */
		for (var i = 0; i < songContainers.length; i++) {
			songContainers[i].classList.remove('amplitude-active-song-container');
		}

		/*
  	Finds the active index and adds the active song container to the element
  	that represents the song at the index.
  */
		if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null) {
			if (document.querySelectorAll('.amplitude-song-container[amplitude-song-index="' + _config2.default.active_index + '"]')) {
				var _songContainers = document.querySelectorAll('.amplitude-song-container[amplitude-song-index="' + _config2.default.active_index + '"]');

				for (var _i = 0; _i < _songContainers.length; _i++) {
					if (!_songContainers[_i].hasAttribute('amplitude-playlist')) {
						_songContainers[_i].classList.add('amplitude-active-song-container');
					}
				}
			}
		} else {
			if (document.querySelectorAll('.amplitude-song-container[amplitude-song-index="' + _config2.default.active_index + '"][amplitude-playlist="' + _config2.default.active_playlist + '"]')) {
				var _songContainers2 = document.querySelectorAll('.amplitude-song-container[amplitude-song-index="' + _config2.default.active_index + '"][amplitude-playlist="' + _config2.default.active_playlist + '"]');

				for (var _i2 = 0; _i2 < _songContainers2.length; _i2++) {
					_songContainers2[_i2].classList.add('amplitude-active-song-container');
				}
			}
		}
	}

	/**
  * Displays the active song's metadata. This is called after a song has
  * been changed. This method takes the active song and displays the
  * metadata. So once the new active song is set, we update all of the
  * screen elements.
  *
  * @access public
  */
	function displaySongMetadata() {
		/*
  	Define the image meta data keys. These are managed separately
  	since we aren't actually changing the inner HTML of these elements.
  */
		var imageMetaDataKeys = ['cover_art_url', 'station_art_url', 'podcast_episode_cover_art_url'];

		/*
  	These are the ignored keys that we won't be worrying about displaying.
  	Every other key in the song object can be displayed.
  */
		var ignoredKeys = ['url', 'live'];

		/*
  	Get all of the song info elements
  */
		var songInfoElements = document.querySelectorAll('[amplitude-song-info]');

		/*
  	Iterate over all of the song info elements. We will either
  	set these to the new values, or clear them if the active song
  	doesn't have the info set.
  */
		for (var i = 0; i < songInfoElements.length; i++) {
			/*
   	Get the info so we can check if the active meta data has the
   	key.
   */
			var info = songInfoElements[i].getAttribute('amplitude-song-info');

			/*
   	Get the song info element playlist.
   */
			var playlist = songInfoElements[i].getAttribute('amplitude-playlist');

			/*
   	Get the main song info flag.
   */
			var main = songInfoElements[i].getAttribute('amplitude-main-song-info');

			/*
   	If the playlists match or the element is a main element, then
   	we set the song info.
   */
			if (_config2.default.active_playlist == playlist || main == 'true') {
				/*
    	If the active metadata has the key, then we set it,
    	otherwise we clear it. If it's an image element then
    	we default it to the default info if needed.
    */
				if (_config2.default.active_metadata[info] != undefined) {
					if (imageMetaDataKeys.indexOf(info) >= 0) {
						songInfoElements[i].setAttribute('src', _config2.default.active_metadata[info]);
					} else {
						songInfoElements[i].innerHTML = _config2.default.active_metadata[info];
					}
				} else {
					/*
     	We look for the default album art because
     	the actual key didn't exist. If the default album
     	art doesn't exist then we set the src attribute
     	to null.
     */
					if (imageMetaDataKeys.indexOf(info) >= 0) {
						if (_config2.default.default_album_art != '') {
							songInfoElements[i].setAttribute('src', _config2.default.default_album_art);
						} else {
							songInfoElements[i].setAttribute('src', '');
						}
					} else {
						songInfoElements[i].innerHTML = '';
					}
				}
			}
		}
	}

	/**
   * Sets the first song in the playlist. This is used to fill in the meta
  * data in the playlist
  *
  * @param {object} song 			- The song we are setting to be the first song in the playlist
  * @param {string} playlist 	- Key of the playlist we are setting the first song in
  */
	function setFirstSongInPlaylist(song, playlist) {
		/*
  	Define the image meta data keys. These are managed separately
  	since we aren't actually changing the inner HTML of these elements.
  */
		var imageMetaDataKeys = ['cover_art_url', 'station_art_url', 'podcast_episode_cover_art_url'];

		/*
  	These are the ignored keys that we won't be worrying about displaying.
  	Every other key in the song object can be displayed.
  */
		var ignoredKeys = ['url', 'live'];

		/*
  	Get all of the song info elements
  */
		var songInfoElements = document.querySelectorAll('[amplitude-song-info][amplitude-playlist="' + playlist + '"]');

		/*
  	Iterate over all of the song info elements. We will either
  	set these to the new values, or clear them if the active song
  	doesn't have the info set.
  */
		for (var i = 0; i < songInfoElements.length; i++) {
			/*
   	Get the info so we can check if the active meta data has the
   	key.
   */
			var info = songInfoElements[i].getAttribute('amplitude-song-info');

			/*
   	Get the song info element playlist.
   */
			var elementPlaylist = songInfoElements[i].getAttribute('amplitude-playlist');

			/*
   	If the playlists match or the element is a main element, then
   	we set the song info.
   */
			if (elementPlaylist == playlist) {
				/*
    	If the active metadata has the key, then we set it,
    	otherwise we clear it. If it's an image element then
    	we default it to the default info if needed.
    */
				if (song[info] != undefined) {
					if (imageMetaDataKeys.indexOf(info) >= 0) {
						songInfoElements[i].setAttribute('src', song[info]);
					} else {
						songInfoElements[i].innerHTML = song[info];
					}
				} else {
					/*
     	We look for the default album art because
     	the actual key didn't exist. If the default album
     	art doesn't exist then we set the src attribute
     	to null.
     */
					if (imageMetaDataKeys.indexOf(info) >= 0) {
						if (song.default_album_art != '') {
							songInfoElements[i].setAttribute('src', song.default_album_art);
						} else {
							songInfoElements[i].setAttribute('src', '');
						}
					} else {
						songInfoElements[i].innerHTML = '';
					}
				}
			}
		}
	}

	/**
  * Sets all of the visual playback speed buttons to have the right class
  * to display the background image that represents the current playback
  * speed.
  *
  * @access public
  */
	function syncPlaybackSpeed() {
		/*
  	Gets all of the playback speed classes.
  */
		var playbackSpeedClasses = document.getElementsByClassName("amplitude-playback-speed");

		/*
  	Iterates over all of the playback speed classes
  	applying the right speed class for visual purposes.
  */
		for (var i = 0; i < playbackSpeedClasses.length; i++) {
			/*
   	Removes all of the old playback speed classes.
   */
			playbackSpeedClasses[i].classList.remove('amplitude-playback-speed-10');
			playbackSpeedClasses[i].classList.remove('amplitude-playback-speed-15');
			playbackSpeedClasses[i].classList.remove('amplitude-playback-speed-20');

			/*
   	Switch the current playback speed and apply the appropriate
   	speed class.
   */
			switch (_config2.default.playback_speed) {
				case 1:
					playbackSpeedClasses[i].classList.add('amplitude-playback-speed-10');
					break;
				case 1.5:
					playbackSpeedClasses[i].classList.add('amplitude-playback-speed-15');
					break;
				case 2:
					playbackSpeedClasses[i].classList.add('amplitude-playback-speed-20');
					break;
			}
		}
	}

	/**
  * Syncs the buffered progress bars to the current percentage in the config
  *
  * @access public
  */
	function syncBufferedProgressBars() {
		/*
  	Gets all of the song buffered progress bars.
  */
		var songBufferedProgressBars = document.getElementsByClassName("amplitude-buffered-progress");

		/*
  	Iterate over all of the song buffered progress bar and
  	set them to 0 which is like re-setting them.
  */
		for (var i = 0; i < songBufferedProgressBars.length; i++) {
			songBufferedProgressBars[i].value = parseFloat(parseFloat(_config2.default.buffered) / 100);
		}
	}

	/**
  * Visually syncs the volume sliders so they are all the same if there
  * are more than one.
  *
  * @access public
  */
	function syncVolumeSliders() {
		var amplitudeVolumeSliders = document.getElementsByClassName("amplitude-volume-slider");

		/*
  	Iterates over all of the volume sliders for the song, setting the value
  	to the config value.
  */
		for (var i = 0; i < amplitudeVolumeSliders.length; i++) {
			amplitudeVolumeSliders[i].value = _config2.default.active_song.volume * 100;
		}
	}

	/**
  * Sets all of the play pause buttons to paused.
  *
  * @access public
  */
	function setPlayPauseButtonsToPause() {
		/*
  	Gets all of the play pause elements
  */
		var playPauseElements = document.querySelectorAll('.amplitude-play-pause');

		/*
  	Sets all of the elements to pause
  */
		for (var i = 0; i < playPauseElements.length; i++) {
			_helpers2.default.setElementPause(playPauseElements[i]);
		}
	}

	/**
  * Syncs the main play pause buttons to the state of the active song.
  *
  * @param {string} state The state of the player
  * @access public
  */
	function syncMainPlayPause(state) {
		/*
  	Ensures we have a string for the state otherwise we grab the
  	state from the config.
  */
		if (typeof state != "string") {
			state = _config2.default.active_song.paused ? "paused" : "playing";
		}

		/*
  	Get all play pause buttons.
  */
		var playPauseElements = document.querySelectorAll('.amplitude-play-pause[amplitude-main-play-pause="true"]');

		/*
  	Iterate over all of the play pause elements syncing the
  	display visually.
  */
		for (var i = 0; i < playPauseElements.length; i++) {
			/*
   	Determines what classes we should add and remove
   	from the elements.
   */
			switch (state) {
				case 'playing':
					_helpers2.default.setElementPlay(playPauseElements[i]);
					break;
				case 'paused':
					_helpers2.default.setElementPause(playPauseElements[i]);
					break;
			}
		}
	}

	/**
  * Syncs the main playlist play pause buttons to the state of the active song.
  *
  * @access public
  * @param {string} playlist 	- The playlist we are setting the play pause state for.
  * @param {string} state 			- Either playing or paused for the state of the active song.
  */
	function syncPlaylistPlayPause(playlist, state) {
		/*
  	Ensures we have a string for the state otherwise we grab the
  	state from the config.
  */
		if (typeof state != "string") {
			state = _config2.default.active_song.paused ? "paused" : "playing";
		}

		/*
  	Get all of the main playlist play pause elements
  */
		var playlistPlayPauseElements = document.querySelectorAll('.amplitude-play-pause[amplitude-playlist-main-play-pause="true"]');

		/*
  	Iterate over the play pause elements, syncing the state accordingly.
  */
		for (var i = 0; i < playlistPlayPauseElements.length; i++) {
			/*
   	If the element has the same playlist attribute as the playlist
   	passed in and the state is playing, we set the element to
   	be playing otherwise we set it to pause. Setting to pause
   	means the element doesn't match the active playlist or the
   	state is paused.
   */
			if (playlistPlayPauseElements[i].getAttribute('amplitude-playlist') == playlist && state == 'playing') {

				_helpers2.default.setElementPlay(playlistPlayPauseElements[i]);
			} else {
				_helpers2.default.setElementPause(playlistPlayPauseElements[i]);
			}
		}
	}

	/**
  * Syncs the song play pause buttons to the state of the active song.
  *
  * @access public
  * @param {string} playlist 	- The playlist we are setting the play pause state for.
  * @param {int} song 					- The index of the song we are syncing the state for
  * @param {string} state 			- Either playing or paused for the state of the active song.
  */
	function syncSongPlayPause(playlist, song, state) {
		/*
  	Ensures we have a string for the state otherwise we grab the
  	state from the config.
  */
		if (typeof state != "string") {
			state = _config2.default.active_song.paused ? "paused" : "playing";
		}

		/*
  	If the playlist is null or empty, we make sure that any song
  	that is a part of a playlist is set to paused.
  */
		if (playlist == null || playlist == '') {
			/*
   	Get all of the individual song play pause buttons. These have an
   	amplitude-song-index attribute. Some have amplitude-playlist which
   	means they are individual songs within a playlist.
   */
			var songPlayPauseElements = document.querySelectorAll('.amplitude-play-pause[amplitude-song-index]');

			/*
   	Iterate over all of the song play pause elements
   */
			for (var i = 0; i < songPlayPauseElements.length; i++) {
				/*
    	If the song element has an attribute for amplitude-playlist then
    	we set it to paused no matter what because the state of the player
    	is not in a playlist mode.
    */
				if (songPlayPauseElements[i].hasAttribute('amplitude-playlist')) {
					_helpers2.default.setElementPause(songPlayPauseElements[i]);
				} else {
					/*
     	If the state of the song is playing and the song index matches the
     	index of the song we have, we set the element to playing otherwise
     	we set the element to paused.
     */
					if (state == 'playing' && songPlayPauseElements[i].getAttribute('amplitude-song-index') == song) {
						_helpers2.default.setElementPlay(songPlayPauseElements[i]);
					} else {
						_helpers2.default.setElementPause(songPlayPauseElements[i]);
					}
				}
			}
		} else {
			/*
   	Get all of the individual song play pause buttons. These have an
   	amplitude-song-index attribute. Some have amplitude-playlist which
   	means they are individual songs within a playlist.
   */
			var _songPlayPauseElements = document.querySelectorAll('.amplitude-play-pause[amplitude-song-index]');

			/*
   	Iterate over all of the individual play pause elements.
   */
			for (var _i3 = 0; _i3 < _songPlayPauseElements.length; _i3++) {
				/*
    	Since we have an active playlist this time, we want any stand alone
    	songs to be set to paused since the scope is within a playlist.
    		We check to see if the element has an amplitude-playlist attribute.
    */
				if (_songPlayPauseElements[_i3].hasAttribute('amplitude-playlist')) {

					/*
     	Check to see if the song index matches the index passed in and the
     	playlist matches the scoped playlist we are looking for and the
     	state of the player is playing, then we set the element to play. If those
     	three parameters are not met, set the element to pause.
     */
					if (_songPlayPauseElements[_i3].getAttribute('amplitude-song-index') == song && _songPlayPauseElements[_i3].getAttribute('amplitude-playlist') == playlist && state == 'playing') {
						_helpers2.default.setElementPlay(_songPlayPauseElements[_i3]);
					} else {
						_helpers2.default.setElementPause(_songPlayPauseElements[_i3]);
					}
				} else {
					/*
     	Set any individual songs (songs outside of a playlist scope) to pause
     	since we are in the scope of a playlist.
     */
					_helpers2.default.setElementPause(_songPlayPauseElements[_i3]);
				}
			}
		}
	}

	/**
  * Syncs repeat for all of the repeat buttons. Users
  * can apply styles to the 'amplitude-repeat-on' and
  * 'amplitude-repeat-off' classes. They represent the state
  * of the player.
  */
	function syncRepeat() {
		/*
  	Gets all of the repeat classes
  */
		var repeatClasses = document.getElementsByClassName("amplitude-repeat");

		/*
  	Iterate over all of the repeat classes. If repeat is on,
  	then add the 'amplitude-repeat-on' class and remove the
  	'amplitude-repeat-off' class. If it's off, then do the
  	opposite.
  */
		for (var i = 0; i < repeatClasses.length; i++) {
			if (_config2.default.repeat) {
				repeatClasses[i].classList.add('amplitude-repeat-on');
				repeatClasses[i].classList.remove('amplitude-repeat-off');
			} else {
				repeatClasses[i].classList.remove('amplitude-repeat-on');
				repeatClasses[i].classList.add('amplitude-repeat-off');
			}
		}
	}

	/**
  * Syncs repeat for all of the playlist repeat buttons. Users
  * can apply styles to the `amplitude-repeat-on` and `amplitude-repeat-off`
  * classes. They repreent the state of the playlist in the player.
  */
	function syncRepeatPlaylist(playlist) {
		/*
   Gets all of the repeat buttons.
  */
		var repeatButtons = document.getElementsByClassName("amplitude-repeat");

		/*
   Iterate over all of the repeat buttons
  */
		for (var i = 0; i < repeatButtons.length; i++) {
			/*
    Ensure that the repeat button belongs to matches the
    playlist we are syncing the state for.
   */
			if (repeatButtons[i].getAttribute('amplitude-playlist') == playlist) {
				/*
     If the state of the playlist is shuffled on, true, then
     we add the 'amplitude-repeat-on' class and remove the
     'amplitude-repeat-off' class. If the player is not shuffled
     then we do the opposite.
    */
				if (_config2.default.repeat_statuses[playlist]) {
					repeatButtons[i].classList.add('amplitude-repeat-on');
					repeatButtons[i].classList.remove('amplitude-repeat-off');
				} else {
					repeatButtons[i].classList.add('amplitude-repeat-off');
					repeatButtons[i].classList.remove('amplitude-repeat-on');
				}
			}
		}
	}

	/**
  * Syncs repeat for all of the repeat song buttons. Users
  * can apply styles to the 'amplitude-repeat-song-on' and
  * 'amplitude-repeat-song-off' classes. They represent the state
  * of the player.
  */
	function syncRepeatSong() {
		/*
  	Gets all of the repeat song classes
  */
		var repeatSongClasses = document.getElementsByClassName("amplitude-repeat-song");

		/*
  	Iterate over all of the repeat song classes. If repeat is on,
  	then add the 'amplitude-repeat-song-on' class and remove the
  	'amplitude-repeat-song-off' class. If it's off, then do the
  	opposite.
  */
		for (var i = 0; i < repeatSongClasses.length; i++) {
			if (_config2.default.repeat_song) {
				repeatSongClasses[i].classList.add('amplitude-repeat-song-on');
				repeatSongClasses[i].classList.remove('amplitude-repeat-song-off');
			} else {
				repeatSongClasses[i].classList.remove('amplitude-repeat-song-on');
				repeatSongClasses[i].classList.add('amplitude-repeat-song-off');
			}
		}
	}

	/**
  * Syncs mute for all of the mute buttons. This represents the
  * state of the player if it's muted or not.
  *
  * @access public
  * @param {string} state 	- The muted state of the player.
  */
	function syncMute(state) {
		/*
  	Get all of the mute buttons.
  */
		var muteClasses = document.getElementsByClassName("amplitude-mute");

		/*
  	Iterate over all of the mute classes. If the state of the player
  	is not-muted then we add the amplitude-not-muted classe and remove
  	the amplitude muted class otherwise we do the opposite.
  */
		for (var i = 0; i < muteClasses.length; i++) {
			if (!state) {
				muteClasses[i].classList.add('amplitude-not-muted');
				muteClasses[i].classList.remove('amplitude-muted');
			} else {
				muteClasses[i].classList.remove('amplitude-not-muted');
				muteClasses[i].classList.add('amplitude-muted');
			}
		}
	}

	/**
  * Syncs the global shuffle button visual state.
  *
  * @access public
  * @param {boolean} state  	- The shuffled state of the player.
  */
	function syncShuffle(state) {
		/*
  	Gets the shuffle buttons.
  */
		var shuffleButtons = document.getElementsByClassName("amplitude-shuffle");

		/*
  	Iterate over all of the shuffle buttons.
  */
		for (var i = 0; i < shuffleButtons.length; i++) {
			/*
   	Ensure the shuffle button doesn't belong to a playlist. We have
   	a separate method for that.
   */
			if (shuffleButtons[i].getAttribute('amplitude-playlist') == null) {
				/*
    	If the state of the player is shuffled on, true, then
    	we add the 'amplitude-shuffle-on' class and remove the
    	'amplitude-shuffle-off' class. If the player is not shuffled
    	then we do the opposite.
    */
				if (state) {
					shuffleButtons[i].classList.add('amplitude-shuffle-on');
					shuffleButtons[i].classList.remove('amplitude-shuffle-off');
				} else {
					shuffleButtons[i].classList.add('amplitude-shuffle-off');
					shuffleButtons[i].classList.remove('amplitude-shuffle-on');
				}
			}
		}
	}

	/**
  * Syncs the playlist shuffle button visual state.
  *
  * @access public
  * @param {boolean} state 	- The shuffled state of the player.
  * @param {string} playlist - The playlist string the shuffle button belongs to.
  */
	function syncPlaylistShuffle(state, playlist) {
		/*
  	Gets all of the shuffle buttons.
  */
		var shuffleButtons = document.getElementsByClassName("amplitude-shuffle");

		/*
  	Iterate over all of the shuffle buttons
  */
		for (var i = 0; i < shuffleButtons.length; i++) {
			/*
   	Ensure that the playlist the shuffle button belongs to matches the
   	playlist we are syncing the state for.
   */
			if (shuffleButtons[i].getAttribute('amplitude-playlist') == playlist) {
				/*
    	If the state of the playlist is shuffled on, true, then
    	we add the 'amplitude-shuffle-on' class and remove the
    	'amplitude-shuffle-off' class. If the player is not shuffled
    	then we do the opposite.
    */
				if (state) {
					shuffleButtons[i].classList.add('amplitude-shuffle-on');
					shuffleButtons[i].classList.remove('amplitude-shuffle-off');
				} else {
					shuffleButtons[i].classList.add('amplitude-shuffle-off');
					shuffleButtons[i].classList.remove('amplitude-shuffle-on');
				}
			}
		}
	}

	/**
  * Syncs the main slider location
  *
  * @access public
  * @param {number} location 	- The location of the song as a percentage.
  */
	function syncMainSliderLocation(location) {
		/*
  	Ensure we have a location that's a number
  */
		location = !isNaN(location) ? location : 0;

		/*
  	Gets the main song sliders
  */
		var mainSongSliders = document.querySelectorAll('.amplitude-song-slider[amplitude-main-song-slider="true"]');

		/*
  	Iterates over all of the main sliders and sets the value to the
  	percentage of the song played.
  */
		for (var i = 0; i < mainSongSliders.length; i++) {
			mainSongSliders[i].value = location;
		}
	}

	/**
  * Syncs playlist song slider locations
  *
  * @access public
  * @param {string} playlist 	- The playlist we are setting the song slider for.
  * @param {number} location 	- The location of the song as a percentage.
  */
	function syncPlaylistSliderLocation(playlist, location) {
		/*
  	Ensure we have a location that's a number
  */
		location = !isNaN(location) ? location : 0;

		/*
  	Gets the playlist song sliders
  */
		var playlistSongSliders = document.querySelectorAll('.amplitude-song-slider[amplitude-playlist-song-slider="true"][amplitude-playlist="' + playlist + '"]');

		/*
  	Iterates over all of the playlist sliders and sets the value to the
  	percentage of the song played.
  */
		for (var i = 0; i < playlistSongSliders.length; i++) {
			playlistSongSliders[i].value = location;
		}
	}

	/**
  * Syncs individual song slider locations
  *
  * @access public
  * @param {string} playlist 	- The playlist we are setting the song slider for.
  * @param {number} songIndex 	- The index of the song we are adjusting the song slider for.
  * @param {number} location 	- The location of the song as a percentage.
  */
	function syncSongSliderLocation(playlist, songIndex, location) {
		/*
  	Ensure we have a location that's a number
  */
		location = !isNaN(location) ? location : 0;
		/*
  	If the playlist is set, we get all of the individual song sliders
  	that relate to the song and the playlist.
  */
		if (playlist != '' && playlist != null) {
			/*
   	Gets the song sliders for the individual songs and the
   	playlist
   */
			var songSliders = document.querySelectorAll('.amplitude-song-slider[amplitude-playlist="' + playlist + '"][amplitude-song-index="' + songIndex + '"]');

			/*
   	Iterates over all of the playlist sliders and set the value to the
   	percentage of the song played.
   */
			for (var i = 0; i < songSliders.length; i++) {
				songSliders[i].value = location;
			}
		} else {
			/*
   	Get the individual song slider by index
   */
			var _songSliders = document.querySelectorAll('.amplitude-song-slider[amplitude-song-index="' + songIndex + '"]');

			/*
   	Iterats over all of the song sliders that have the index of
   	the song we are sliding. If the song doesn't have a playlist
   	attribute, we set the location.
   */
			for (var _i4 = 0; _i4 < _songSliders.length; _i4++) {
				if (!_songSliders[_i4].hasAttribute('amplitude-playlist')) {
					if (location != 0) {
						_songSliders[_i4].value = location;
					}
				}
			}
		}
	}

	/**
  * Sets the volume slider location
  *
  * @access public
  * @param {number} volume 	- The volume from 0 - 1 for song volume.
  */
	function syncVolumeSliderLocation(volume) {
		/*
  	Gets all of the volume sliders
  */
		var volumeSliders = document.querySelectorAll('.amplitude-volume-slider');

		/*
  	Iterates over all of the sliders and sets their volume
  	to the volume of the song.
  */
		for (var i = 0; i < volumeSliders.length; i++) {
			volumeSliders[i].value = volume;
		}
	}

	/**
  * Syncs the song's duration
  *
  * @access public
  * @param {object} currentTime 		- Object containing information about the current time of the song.
  * @param {object} songDuration 	- Object containing information about the duration of the song.
  */
	function syncSongDuration(currentTime, songDuration) {
		/*
  	Set duration hour display.
  */
		_helpers2.default.syncDurationHours(songDuration != undefined && !isNaN(songDuration.hours) ? songDuration.hours : '00');

		/*
  	Set duration minute display.
  */
		_helpers2.default.syncDurationMinutes(songDuration != undefined && !isNaN(songDuration.minutes) ? songDuration.minutes : '00');

		/*
  	Set duration second display.
  */
		_helpers2.default.syncDurationSeconds(songDuration != undefined && !isNaN(songDuration.seconds) ? songDuration.seconds : '00');

		/*
  	Set duration time display.
  */
		_helpers2.default.syncDurationTime(songDuration != undefined ? songDuration : {});

		/*
  	Set count down time display.
  */
		_helpers2.default.syncCountDownTime(currentTime, songDuration);
	}

	/**
  * Sets the meta data for songs loaded in the songs array
  */
	function syncSongsMetaData() {
		/*
  	Define the image meta data keys. These are managed separately
  	since we aren't actually changing the inner HTML of these elements.
  */
		var imageMetaDataKeys = ['cover_art_url', 'station_art_url', 'podcast_episode_cover_art_url'];

		/*
  	These are the ignored keys that we won't be worrying about displaying.
  	Every other key in the song object can be displayed.
  */
		var ignoredKeys = ['url', 'live'];

		/*
  	Get all of the song info elements
  */
		var songInfoElements = document.querySelectorAll('[amplitude-song-info]');

		/*
  	Iterate over all of the song info elements. We will either
  	set these to the new values, or clear them if the active song
  	doesn't have the info set.
  */
		for (var i = 0; i < songInfoElements.length; i++) {

			/*
   	For this method we do not want the element to have any playlist or
   	main song info. This way we aren't adjusting the main song information for the
   	global player or the playlist player.
   */
			if (songInfoElements[i].getAttribute('amplitude-playlist') == null && songInfoElements[i].getAttribute('amplitude-main-song-info') == null && songInfoElements[i].getAttribute('amplitude-song-index') != null) {

				/*
    		Get the info so we can check if the active meta data has the
    		key.
    	*/
				var info = songInfoElements[i].getAttribute('amplitude-song-info');
				var index = songInfoElements[i].getAttribute('amplitude-song-index');

				/*
    	Make sure that the song index they are referencing is defined.
    */
				if (_config2.default.songs[index][info] != undefined) {

					/*
     	If it's an image meta data key, then we set the src attribute of
     	the element. Otherwise we set the inner HTML of the element.
     */
					if (imageMetaDataKeys.indexOf(info) >= 0) {
						songInfoElements[i].setAttribute('src', _config2.default.songs[index][info]);
					} else {
						songInfoElements[i].innerHTML = _config2.default.songs[index][info];
					}
				}
			}
		}
	}

	/**
 	Returns the publically available functions
 	@TODO Re-order to order of methods in module
 */
	return {
		syncCurrentTime: syncCurrentTime,
		resetTimes: resetTimes,
		resetSongSliders: resetSongSliders,
		resetSongPlayedProgressBars: resetSongPlayedProgressBars,
		resetSongBufferedProgressBars: resetSongBufferedProgressBars,
		setActiveContainer: setActiveContainer,
		displaySongMetadata: displaySongMetadata,
		syncPlaybackSpeed: syncPlaybackSpeed,
		syncBufferedProgressBars: syncBufferedProgressBars,
		syncVolumeSliders: syncVolumeSliders,
		setPlayPauseButtonsToPause: setPlayPauseButtonsToPause,
		setFirstSongInPlaylist: setFirstSongInPlaylist,
		syncMainPlayPause: syncMainPlayPause,
		syncPlaylistPlayPause: syncPlaylistPlayPause,
		syncSongPlayPause: syncSongPlayPause,
		syncRepeat: syncRepeat,
		syncRepeatSong: syncRepeatSong,
		syncRepeatPlaylist: syncRepeatPlaylist,
		syncMute: syncMute,
		syncShuffle: syncShuffle,
		syncPlaylistShuffle: syncPlaylistShuffle,
		syncMainSliderLocation: syncMainSliderLocation,
		syncPlaylistSliderLocation: syncPlaylistSliderLocation,
		syncSongSliderLocation: syncSongSliderLocation,
		syncVolumeSliderLocation: syncVolumeSliderLocation,
		syncSongDuration: syncSongDuration,
		syncSongsMetaData: syncSongsMetaData
	};
}();

/**
 * Imports the Amplitude Visual Sync Helpers to keep the display in sync
 * @module visual/AmplitudeVisualSyncHelpers
 */
exports.default = AmplitudeVisualSync;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _visual = __webpack_require__(2);

var _visual2 = _interopRequireDefault(_visual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Interacts directly with native functions of the Audio element. Logic
 * leading up to these methods are handled by click handlers which call
 * helpers and visual synchronizers. These are the core functions of AmplitudeJS.
 * Every other function that leads to these prepare the information to be
 * acted upon by these functions.
 *
 * @module core/AmplitudeCore
 */


/**
 * AmplitudeJS Core Helpers
 * @module core/helpers
 */
var AmplitudeCore = function () {
	/**
  * Plays the active song. If the current song is live, it reconnects
  * the stream before playing.
  *
  * Public Accessor: Amplitude.play()
  *
  * @access public
  */
	function play() {
		/*
  	Run the before play callback
  */
		_helpers2.default.runCallback('before_play');

		/*
  	If the audio is live we re-conenct the stream.
  */
		if (_config2.default.active_metadata.live) {
			reconnectStream();
		}

		/*
  	Mobile remote sources need to be reconnected on play. I think this is
  	because mobile browsers are optimized not to load all resources
  	for speed reasons. We only do this if mobile and the paused button
  	is not clicked. If the pause button was clicked then we don't reconnect
  	or the user will lose their place in the stream.
  */
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !_config2.default.paused) {
			reconnectStream();
		}

		/*
  	Play the song and set the playback rate to the playback
  	speed.
  */
		_config2.default.active_song.play();
		_config2.default.active_song.playbackRate = _config2.default.playback_speed;

		/*
  	Run the after play callback
  */
		_helpers2.default.runCallback('after_play');
	}

	/**
  * Pauses the active song. If it's live, it disconnects the stream.
  *
  * Public Accessor: Amplitude.pause()
  *
  * @access public
  */
	function pause() {
		/*
  	Run the before pause callback.
  */
		_helpers2.default.runCallback('before_pause');

		/*
  	Pause the active song.
  */
		_config2.default.active_song.pause();

		/*
  	Flag that pause button was clicked.
  */
		_config2.default.paused = true;

		/*
  	If the song is live, we disconnect the stream so we aren't
  	saving it to memory.
  */
		if (_config2.default.active_metadata.live) {
			disconnectStream();
		}

		/*
  	Run the after pause callback.
  */
		_helpers2.default.runCallback('after_pause');
	}

	/**
  * Stops the active song by setting the current song time to 0.
  * When the user resumes, it will be from the beginning.
  * If it's a live stream it disconnects.
  *
  * Public Accessor: Amplitude.stop()
  *
  * @access public
  */
	function stop() {
		/*
  	Runs the before stop callback.
  */
		_helpers2.default.runCallback('before_stop');

		/*
  	Set the current time of the song to 0 which will reset the song.
  */
		if (_config2.default.active_song.currentTime != 0) {
			_config2.default.active_song.currentTime = 0;
		}

		/*
  	Run pause so the song will stop
  */
		_config2.default.active_song.pause();

		/*
  	If the song is live, disconnect the stream.
  */
		if (_config2.default.active_metadata.live) {
			disconnectStream();
		}

		/*
  	Run the after stop callback
  */
		_helpers2.default.runCallback('after_stop');
	}

	/**
  * Sets the song volume.
  *
  * Public Accessor: Amplitude.setVolume( volumeLevel )
  *
  * @access public
  * @param {number} volumeLevel - A number between 1 and 100 as a percentage of
  * min to max for a volume level.
  */
	function setVolume(volumeLevel) {
		/*
  	If the volume is set to mute somewhere else, we sync the display.
  */
		if (volumeLevel == 0) {
			_visual2.default.syncMute(true);
		} else {
			_visual2.default.syncMute(false);
		}

		/*
  	Set the volume of the active song.
  */
		_config2.default.active_song.volume = volumeLevel / 100;
	}

	/**
  * Sets the song percentage. If it's a live song, we ignore this because
  * we can't skip ahead. This is an issue if you have a playlist with
  * a live source.
  *
  * Public Accessor: Amplitude.setSongLocation( songPercentage )
  *
  * @access public
  * @param {number} songPercentage - A number between 1 and 100 as a percentage of song completion.
  */
	function setSongLocation(songPercentage) {
		/*
  	As long as the song is not live, we can set the current time of the
  	song to the percentage the user passed in.
  */
		if (!_config2.default.active_metadata.live) {
			_config2.default.active_song.currentTime = _config2.default.active_song.duration * (song_percentage / 100);
		}
	}

	/**
  * Skips to a location in a song
  *
  * Public Accessor: Amplitude.skipToLocation( seconds )
  *
  * @access public
  * @param {number} seconds - An integer containing the seconds to skip to
  */
	function skipToLocation(seconds) {
		/*
  	When the active song can be played through, we can check to
  	see if the seconds will work. We only bind the event handler
  	once and remove it once it's fired.
  */
		_config2.default.active_song.addEventListener('canplaythrough', function () {
			/*
   	If the active song duration is greater than or equal to the
   	amount of seconds the user wants to skip to and the seconds
   	is greater than 0, we skip to the seconds defined.
   */
			if (_config2.default.active_song.duration >= seconds && seconds > 0) {
				_config2.default.active_song.currentTime = seconds;
			} else {
				_helpers2.default.writeDebugMessage('Amplitude can\'t skip to a location greater than the duration of the audio or less than 0');
			}
		}, { once: true });
	}

	/**
  * Disconnects the live stream
  *
  * Public Accessor: Amplitude.disconnectStream()
  *
  * @access public
  */
	function disconnectStream() {
		_config2.default.active_song.src = '';
		_config2.default.active_song.load();
	}

	/**
  * Reconnects the live stream
  *
  * Public Accessor: Amplitude.reconnectStream()
  *
  * @access public\
  */
	function reconnectStream() {
		_config2.default.active_song.src = _config2.default.active_metadata.url;
		_config2.default.active_song.load();
	}

	/**
  * When you pass a song object it plays that song right awawy.  It sets
  * the active song in the config to the song you pass in and synchronizes
  * the visuals.
  *
  * Public Accessor: Amplitude.playNow( song )
  *
  * @access public
  * @param {object} song - JSON representation of a song.
  */
	function playNow(song) {
		/*
  	Makes sure the song object has a URL associated with it
  	or there will be nothing to play.
  */
		if (song.url) {
			_config2.default.active_song.src = song.url;
			_config2.default.active_metadata = song;
			_config2.default.active_album = song.album;
		} else {
			/*
   	Write error message since the song passed in doesn't
   	have a URL.
   */
			_helpers2.default.writeDebugMessage('The song needs to have a URL!');
		}

		/*
  	Sets the main song control status visual
  */
		_visual2.default.syncMainPlayPause('playing');

		/*
  	Update the song meta data
  */
		_visual2.default.displaySongMetadata();

		/*
  	Reset the song sliders, song progress bar info, and
  	reset times. This ensures everything stays in sync.
  */
		_visual2.default.resetSongSliders();

		_visual2.default.resetSongPlayedProgressBars();

		_visual2.default.resetTimes();

		/*
  	Plays the song.
  */
		play();
	}

	/**
  * Plays the song at a specific index in the songs array
  *
  * Public Accessor: Amplitude.playSongAtIndex( song )
  *
  * @access public
  * @param {number} index - The number representing the song in the songs array
  */
	function playSongAtIndex(index) {
		/*
  	Stop the current song.
  */
		stop();

		/*
  	Determine if there is a new playlist, if so set the active playlist and change the song.
  */
		if (_helpers2.default.checkNewPlaylist(null)) {
			_helpers2.default.setActivePlaylist(null);

			_helpers2.default.changeSong(index);
		}

		/*
  	Check if the song is new. If so, change the song.
  */
		if (_helpers2.default.checkNewSong(index)) {
			_helpers2.default.changeSong(index);
		}

		/*
   Sync all of the play pause buttons.
  */
		_visual2.default.syncMainPlayPause('playing');
		_visual2.default.syncPlaylistPlayPause(_config2.default.active_playlist, 'playing');
		_visual2.default.syncSongPlayPause(_config2.default.active_playlist, _config2.default.active_index, 'playing');

		/*
   Play the song
  */
		play();
	}

	/**
 * Plays a song at the index passed in for the playlist provided. The index passed
 * in should be the index of the song in the playlist and not the songs array.
 *
 * @access public
 * @param {number} index 		- The number representing the song in the playlist array.
 * @param {string} playlist 	- The key string representing the playlist we are playing the song from.
 *
 */
	function playPlaylistSongAtIndex(index, playlist) {
		/*
  		Stop the current song.
  */
		stop();

		/*
  		Get the index of the song in the songs array. This is the integer at the index
  	in the playlist.
  */
		var songIndex = _config2.default.playlists[playlist][index];

		/*
  		Determine if there is a new playlist, if so set the active playlist and change the song.
  */
		if (_helpers2.default.checkNewPlaylist(playlist)) {
			_helpers2.default.setActivePlaylist(playlist);

			_helpers2.default.changeSong(songIndex);
		}

		/*
  		Check if the song is new. If so, change the song.
  */
		if (_helpers2.default.checkNewSong(songIndex)) {
			_helpers2.default.changeSong(songIndex);
		}

		/*
  	Sync all of the play pause buttons.
  */
		_visual2.default.syncMainPlayPause('playing');
		_visual2.default.syncPlaylistPlayPause(_config2.default.active_playlist, 'playing');
		_visual2.default.syncSongPlayPause(_config2.default.active_playlist, _config2.default.active_index, 'playing');

		/*
  	Play the song
  */
		play();
	}

	/**
  * Sets the playback speed for the song.
  *
  * @param {number} playbackSpeed The speed we want the song to play back at.
  */
	function setPlaybackSpeed(playbackSpeed) {
		/*
  	Set the config playback speed.
  */
		_config2.default.playback_speed = playbackSpeed;

		/*
  	Set the active song playback rate.
  */
		_config2.default.active_song.playbackRate = _config2.default.playback_speed;
	}

	/*
 	Return publically facing functions
 */
	return {
		play: play,
		pause: pause,
		stop: stop,
		setVolume: setVolume,
		setSongLocation: setSongLocation,
		skipToLocation: skipToLocation,
		disconnectStream: disconnectStream,
		reconnectStream: reconnectStream,
		playNow: playNow,
		playSongAtIndex: playSongAtIndex,
		playPlaylistSongAtIndex: playPlaylistSongAtIndex,
		setPlaybackSpeed: setPlaybackSpeed
	};
}();

/**
 * AmplitudeJS Visual Sync
 * @module visual/visual
*/
/**
 * Imports the config module
 * @module config
 */
exports.default = AmplitudeCore;
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _handlers = __webpack_require__(7);

var _handlers2 = _interopRequireDefault(_handlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
|----------------------------------------------------------------------------------------------------
| EVENTS METHODS
|----------------------------------------------------------------------------------------------------
| These methods are called when we need to bind events to certain elements.
|
| METHODS:
| 	initializeEvents()
|	bindPlay()
|	bindPause()
|	bindPlayPause()
|	bindStop()
|	bindMute()
|	bindVolumeUp()
|	bindVolumeDown()
|	bindSongSlider()
|	bindVolumeSlider()
|	bindNext()
|	bindPrev()
|	bindShuffle()
|	bindRepeat()
|	bindPlaybackSpeed()
|	bindSkipTo()
|      bindProgress()
*/
var AmplitudeEvents = function () {
	/*--------------------------------------------------------------------------
 	Initializes the handlers for the events listened to by Amplitude
 --------------------------------------------------------------------------*/
	function initializeEvents() {
		/*
  	Write out debug message
  */
		_helpers2.default.writeDebugMessage('Beginning initialization of event handlers..');

		/*
  	Sets flag that the screen is moving and not a tap
  */
		document.addEventListener('touchmove', function () {
			_config2.default.is_touch_moving = true;
		});

		/*
  	On touch end if it was a touch move event, set moving to
  	false
  */
		document.addEventListener('touchend', function () {
			if (_config2.default.is_touch_moving) {
				_config2.default.is_touch_moving = false;
			}
		});

		/*
  	On time update for the audio element, update visual displays that
  	represent the time on either a visualized element or time display.
  */
		bindTimeUpdate();

		/*
  	Binds key down event handlers for matching key codes to functions.
  */
		bindKeyDownEventHandlers();

		/*
  	When the audio element has ended playing, we handle the song
  	ending. In a single song or multiple modular song instance,
  	this just synchronizes the visuals for time and song time
  	visualization, but for a playlist it determines whether
  	it should play the next song or not.
  */
		bindSongEnded();

		/*
  	Binds progress event so we can see how much of the song is loaded.
  */
		bindProgress();

		/*
  	Binds 'amplitude-play' event handlers
  */
		bindPlay();

		/*
  	Binds 'amplitude-pause' event handlers.
  */
		bindPause();

		/*
  	Binds 'amplitude-play-pause' event handlers.
  */
		bindPlayPause();

		/*
  	Binds 'amplitude-stop' event handlers.
  */
		bindStop();

		/*
  	Binds 'amplitude-mute' event handlers.
  */
		bindMute();

		/*
  	Binds 'amplitude-volume-up' event handlers
  */
		bindVolumeUp();

		/*
  	Binds 'amplitude-volume-down' event handlers
  */
		bindVolumeDown();

		/*
  	Binds 'amplitude-song-slider' event handlers
  */
		bindSongSlider();

		/*
  	Binds 'amplitude-volume-slider' event handlers.
  */
		bindVolumeSlider();

		/*
  	Binds 'amplitude-next' event handlers.
  */
		bindNext();

		/*
  	Binds 'amplitude-prev' event handlers.
  */
		bindPrev();

		/*
  	Binds 'amplitude-shuffle' event handlers.
  */
		bindShuffle();

		/*
  	Binds 'amplitude-repeat' event handlers.
  */
		bindRepeat();

		/*
  	Binds 'amplitude-playback-speed' event handlers.
  */
		bindPlaybackSpeed();

		/*
  	Binds 'amplitude-skip-to' event handlers.
  */
		bindSkipTo();
	}

	/*--------------------------------------------------------------------------
 	On time update for the audio element, update visual displays that
 		represent the time on either a visualized element or time display.
 --------------------------------------------------------------------------*/
	function bindTimeUpdate() {
		_config2.default.active_song.removeEventListener('timeupdate', _handlers2.default.updateTime);
		_config2.default.active_song.addEventListener('timeupdate', _handlers2.default.updateTime);

		// also bind change of duratuion
		_config2.default.active_song.removeEventListener('durationchange', _handlers2.default.updateTime);
		_config2.default.active_song.addEventListener('durationchange', _handlers2.default.updateTime);
	}

	/*--------------------------------------------------------------------------
 	On keydown, we listen to what key got pressed so we can map the key to
 	a function. This allows the user to map pause and play, next, etc. to key
 	presses.
 --------------------------------------------------------------------------*/
	function bindKeyDownEventHandlers() {
		document.removeEventListener("keydown", _helpers2.default.keydown);
		document.addEventListener("keydown", _handlers2.default.keydown);
	}

	/*--------------------------------------------------------------------------
 	When the audio element has ended playing, we handle the song
 	ending. In a single song or multiple modular song instance,
 	this just synchronizes the visuals for time and song time
 	visualization, but for a playlist it determines whether
 	it should play the next song or not.
 --------------------------------------------------------------------------*/
	function bindSongEnded() {
		_config2.default.active_song.removeEventListener('ended', _handlers2.default.songEnded);
		_config2.default.active_song.addEventListener('ended', _handlers2.default.songEnded);
	}

	/*--------------------------------------------------------------------------
 	As the audio is loaded, the progress event gets fired. We bind into this
 	to grab the buffered percentage of the song. We can then add more elements
 	to show the buffered amount.
 --------------------------------------------------------------------------*/
	function bindProgress() {
		_config2.default.active_song.removeEventListener('progress', _handlers2.default.progess);
		_config2.default.active_song.addEventListener('progress', _handlers2.default.progress);
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-play"
 		Binds click and touchend events for amplitude play buttons.
 --------------------------------------------------------------------------*/
	function bindPlay() {
		/*
  	Gets all of the elements with the class amplitude-play
  */
		var play_classes = document.getElementsByClassName("amplitude-play");

		/*
  	Iterates over all of the play classes and binds the event interaction
  	method to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < play_classes.length; i++) {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				play_classes[i].removeEventListener('touchend', _handlers2.default.play);
				play_classes[i].addEventListener('touchend', _handlers2.default.play);
			} else {
				play_classes[i].removeEventListener('click', _handlers2.default.play);
				play_classes[i].addEventListener('click', _handlers2.default.play);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-pause"
 		Binds click and touchend events for amplitude pause buttons.
 --------------------------------------------------------------------------*/
	function bindPause() {
		/*
  	Gets all of the elements with the class amplitude-pause
  */
		var pause_classes = document.getElementsByClassName("amplitude-pause");

		/*
  	Iterates over all of the pause classes and binds the event interaction
  	method to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < pause_classes.length; i++) {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				pause_classes[i].removeEventListener('touchend', _handlers2.default.pause);
				pause_classes[i].addEventListener('touchend', _handlers2.default.pause);
			} else {
				pause_classes[i].removeEventListener('click', _handlers2.default.pause);
				pause_classes[i].addEventListener('click', _handlers2.default.pause);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-play-pause"
 		Binds click and touchend events for amplitude play pause buttons.
 --------------------------------------------------------------------------*/
	function bindPlayPause() {
		/*
  	Gets all of the elements with the class amplitude-play-pause
  */
		var play_pause_classes = document.getElementsByClassName("amplitude-play-pause");

		/*
  	Iterates over all of the play/pause classes and binds the event interaction
  	method to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < play_pause_classes.length; i++) {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				play_pause_classes[i].removeEventListener('touchend', _handlers2.default.playPause);
				play_pause_classes[i].addEventListener('touchend', _handlers2.default.playPause);
			} else {
				play_pause_classes[i].removeEventListener('click', _handlers2.default.playPause);
				play_pause_classes[i].addEventListener('click', _handlers2.default.playPause);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-stop"
 		Binds click and touchend events for amplitude stop buttons
 --------------------------------------------------------------------------*/
	function bindStop() {
		/*
  	Gets all of the elements with the class amplitude-stop
  */
		var stop_classes = document.getElementsByClassName("amplitude-stop");

		/*
  	Iterates over all of the stop classes and binds the event interaction
  	method to the element.  If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < stop_classes.length; i++) {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				stop_classes[i].removeEventListener('touchend', _handlers2.default.stop);
				stop_classes[i].addEventListener('touchend', _handlers2.default.stop);
			} else {
				stop_classes[i].removeEventListener('click', _handlers2.default.stop);
				stop_classes[i].addEventListener('click', _handlers2.default.stop);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-mute"
 		Binds click and touchend events for amplitude mute buttons
 --------------------------------------------------------------------------*/
	function bindMute() {
		/*
  	Gets all of the elements with the class amplitue-mute
  */
		var mute_classes = document.getElementsByClassName("amplitude-mute");

		/*
  	Iterates over all of the mute classes and binds the event interaction
  	method to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < mute_classes.length; i++) {
			/*
   	WARNING: If iOS, we don't do anything because iOS does not allow the
   	volume to be adjusted through anything except the buttons on the side of
   	the device.
   */
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				/*
    	Checks for an iOS device and displays an error message if debugging
    	is turned on.
    */
				if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
					_helpers2.default.writeDebugMessage('iOS does NOT allow volume to be set through javascript: https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW4');
				} else {
					mute_classes[i].removeEventListener('touchend', _handlers2.default.mute);
					mute_classes[i].addEventListener('touchend', _handlers2.default.mute);
				}
			} else {
				mute_classes[i].removeEventListener('click', _handlers2.default.mute);
				mute_classes[i].addEventListener('click', _handlers2.default.mute);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-volume-up"
 		Binds click and touchend events for amplitude volume up buttons
 --------------------------------------------------------------------------*/
	function bindVolumeUp() {
		/*
  	Gets all of the elements with the class amplitude-volume-up
  */
		var volume_up_classes = document.getElementsByClassName("amplitude-volume-up");

		/*
  	Iterates over all of the volume up classes and binds the event interaction
  	methods to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < volume_up_classes.length; i++) {
			/*
   	WARNING: If iOS, we don't do anything because iOS does not allow the
   	volume to be adjusted through anything except the buttons on the side of
   	the device.
   */
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				/*
    	Checks for an iOS device and displays an error message if debugging
    	is turned on.
    */
				if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
					_helpers2.default.writeDebugMessage('iOS does NOT allow volume to be set through javascript: https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW4');
				} else {
					volume_up_classes[i].removeEventListener('touchend', _handlers2.default.volumeUp);
					volume_up_classes[i].addEventListener('touchend', _handlers2.default.volumeUp);
				}
			} else {
				volume_up_classes[i].removeEventListener('click', _handlers2.default.volumeUp);
				volume_up_classes[i].addEventListener('click', _handlers2.default.volumeUp);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-volume-down"
 		Binds click and touchend events for amplitude volume down buttons
 --------------------------------------------------------------------------*/
	function bindVolumeDown() {
		/*
  	Gets all of the elements with the class amplitude-volume-down
  */
		var volume_down_classes = document.getElementsByClassName("amplitude-volume-down");

		/*
  	Iterates over all of the volume down classes and binds the event interaction
  	methods to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < volume_down_classes.length; i++) {
			/*
   	WARNING: If iOS, we don't do anything because iOS does not allow the
   	volume to be adjusted through anything except the buttons on the side of
   	the device.
   */
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				/*
    	Checks for an iOS device and displays an error message if debugging
    	is turned on.
    */
				if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
					_helpers2.default.writeDebugMessage('iOS does NOT allow volume to be set through javascript: https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW4');
				} else {
					volume_down_classes[i].removeEventListener('touchend', _handlers2.default.volumeDown);
					volume_down_classes[i].addEventListener('touchend', _handlers2.default.volumeDown);
				}
			} else {
				volume_down_classes[i].removeEventListener('click', _handlers2.default.volumeDown);
				volume_down_classes[i].addEventListener('click', _handlers2.default.volumeDown);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-song-slider"
 		Binds change and input events for amplitude song slider inputs
 --------------------------------------------------------------------------*/
	function bindSongSlider() {
		/*
  	Gets browser so if we need to apply overrides, like we usually
  	have to do for anything cool in IE, we can do that.
  */
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");

		/*
  	Gets all of the elements with the class amplitude-song-slider
  */
		var song_sliders = document.getElementsByClassName("amplitude-song-slider");

		/*
  	Iterates over all of the song slider classes and binds the event interaction
  	methods to the element. If the browser is IE we listen to the change event
  	where if it is anything else, it's the input method.
  */
		for (var i = 0; i < song_sliders.length; i++) {
			if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
				song_sliders[i].removeEventListener('change', _handlers2.default.songSlider);
				song_sliders[i].addEventListener('change', _handlers2.default.songSlider);
			} else {
				song_sliders[i].removeEventListener('input', _handlers2.default.songSlider);
				song_sliders[i].addEventListener('input', _handlers2.default.songSlider);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-volume-slider"
 		Binds change and input events for amplitude volume slider inputs
 --------------------------------------------------------------------------*/
	function bindVolumeSlider() {
		/*
  	Gets browser so if we need to apply overrides, like we usually
  	have to do for anything cool in IE, we can do that.
  */
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf("MSIE ");

		/*
  Gets all of the elements with the class amplitude-volume-slider
  */
		var volume_sliders = document.getElementsByClassName("amplitude-volume-slider");

		/*
  	Iterates over all of the volume slider classes and binds the event interaction
  	methods to the element. If the browser is IE we listen to the change event
  	where if it is anything else, it's the input method.
  */
		for (var i = 0; i < volume_sliders.length; i++) {
			/*
   	WARNING: If iOS, we don't do anything because iOS does not allow the
   	volume to be adjusted through anything except the buttons on the side of
   	the device.
   */
			if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
				_helpers2.default.writeDebugMessage('iOS does NOT allow volume to be set through javascript: https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW4');
			} else {
				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
					volume_sliders[i].removeEventListener('change', _handlers2.default.volumeSlider);
					volume_sliders[i].addEventListener('change', _handlers2.default.volumeSlider);
				} else {
					volume_sliders[i].removeEventListener('input', _handlers2.default.volumeSlider);
					volume_sliders[i].addEventListener('input', _handlers2.default.volumeSlider);
				}
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-next"
 		Binds click and touchend events for amplitude next buttons.
 --------------------------------------------------------------------------*/
	function bindNext() {
		/*
  	Gets all of the elements with the class amplitude-next
        */
		var next_classes = document.getElementsByClassName("amplitude-next");

		/*
  	Iterates over all of the next classes and binds the event interaction
  	methods to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < next_classes.length; i++) {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				next_classes[i].removeEventListener('touchend', _handlers2.default.next);
				next_classes[i].addEventListener('touchend', _handlers2.default.next);
			} else {
				next_classes[i].removeEventListener('click', _handlers2.default.next);
				next_classes[i].addEventListener('click', _handlers2.default.next);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-prev"
 		Binds click and touchend events for amplitude prev buttons.
 --------------------------------------------------------------------------*/
	function bindPrev() {
		/*
  	Gets all of the elements with the class amplitude-prev
  */
		var prev_classes = document.getElementsByClassName("amplitude-prev");

		/*
  	Iterates over all of the prev classes and binds the event interaction
  	methods to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < prev_classes.length; i++) {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				prev_classes[i].removeEventListener('touchend', _handlers2.default.prev);
				prev_classes[i].addEventListener('touchend', _handlers2.default.prev);
			} else {
				prev_classes[i].removeEventListener('click', _handlers2.default.prev);
				prev_classes[i].addEventListener('click', _handlers2.default.prev);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-shuffle"
 		Binds click and touchend events for amplitude shuffle buttons.
 --------------------------------------------------------------------------*/
	function bindShuffle() {
		/*
  	Gets all of the elements with the class amplitude-shuffle
  */
		var shuffle_classes = document.getElementsByClassName("amplitude-shuffle");

		/*
  	Iterates over all of the shuffle classes and binds the event interaction
  	methods to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < shuffle_classes.length; i++) {
			/*
   	Since we are re-binding everything we remove any classes that signify
   	a state of the shuffle control.
   */
			shuffle_classes[i].classList.remove('amplitude-shuffle-on');
			shuffle_classes[i].classList.add('amplitude-shuffle-off');

			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				shuffle_classes[i].removeEventListener('touchend', _handlers2.default.shuffle);
				shuffle_classes[i].addEventListener('touchend', _handlers2.default.shuffle);
			} else {
				shuffle_classes[i].removeEventListener('click', _handlers2.default.shuffle);
				shuffle_classes[i].addEventListener('click', _handlers2.default.shuffle);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-repeat"
 		Binds click and touchend events for amplitude repeat buttons.
 --------------------------------------------------------------------------*/
	function bindRepeat() {
		/*
  	Gets all of the elements with the class amplitude-repeat
  */
		var repeat_classes = document.getElementsByClassName("amplitude-repeat");

		/*
  	Iterates over all of the repeat classes and binds the event interaction
  	methods to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < repeat_classes.length; i++) {
			/*
   	Since we are re-binding everything we remove any classes that signify
   	a state of the repeat control.
   */
			repeat_classes[i].classList.remove('amplitude-repeat-on');
			repeat_classes[i].classList.add('amplitude-repeat-off');

			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				repeat_classes[i].removeEventListener('touchend', _handlers2.default.repeat);
				repeat_classes[i].addEventListener('touchend', _handlers2.default.repeat);
			} else {
				repeat_classes[i].removeEventListener('click', _handlers2.default.repeat);
				repeat_classes[i].addEventListener('click', _handlers2.default.repeat);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-playback-speed"
 		Binds click and touchend events for amplitude playback speed buttons.
 --------------------------------------------------------------------------*/
	function bindPlaybackSpeed() {
		/*
  	Gets all of the elements with the class amplitude-playback-speed
  */
		var playback_speed_classes = document.getElementsByClassName("amplitude-playback-speed");

		/*
  	Iterates over all of the playback speed classes and binds the event interaction
  	methods to the element. If the browser is mobile, then the event is touchend
  	otherwise it is click.
  */
		for (var i = 0; i < playback_speed_classes.length; i++) {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				playback_speed_classes[i].removeEventListener('touchend', _handlers2.default.playbackSpeed);
				playback_speed_classes[i].addEventListener('touchend', _handlers2.default.playbackSpeed);
			} else {
				playback_speed_classes[i].removeEventListener('click', _handlers2.default.playbackSpeed);
				playback_speed_classes[i].addEventListener('click', _handlers2.default.playbackSpeed);
			}
		}
	}

	/*--------------------------------------------------------------------------
 	BINDS: class="amplitude-skip-to"
 		Binds click and touchend events for amplitude skip to buttons.
 --------------------------------------------------------------------------*/
	function bindSkipTo() {
		/*
  	Gets all of the skip to elements with the class 'amplitude-skip-to'
  */
		var skipToClasses = document.getElementsByClassName("amplitude-skip-to");

		/*
  	Iterates over all of the skip to classes and binds the event interaction
  	methods to the element. If the browser is mobile, then the event is touchend
  	otherwise it's a click.
  */
		for (var i = 0; i < skipToClasses.length; i++) {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				skipToClasses[i].removeEventListener('touchend', _handlers2.default.skipTo);
				skipToClasses[i].addEventListener('touchend', _handlers2.default.skipTo);
			} else {
				skipToClasses[i].removeEventListener('click', _handlers2.default.skipTo);
				skipToClasses[i].addEventListener('click', _handlers2.default.skipTo);
			}
		}
	}

	return {
		initializeEvents: initializeEvents
	};
}(); /*
     	Import the necessary classes and config to use
     	with the events.
     */
exports.default = AmplitudeEvents;
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _visual = __webpack_require__(2);

var _visual2 = _interopRequireDefault(_visual);

var _core = __webpack_require__(3);

var _core2 = _interopRequireDefault(_core);

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * These methods help handle interactions whether it's computation or shuffling
 * songs.
 *
 * @module events/AmplitudeEventsHelpers
 */


/**
 * Imports the Amplitude Core module
 * @module core/AmplitudeCore
 */
/**
 * Imports the config module
 * @module config
 */
var AmplitudeEventsHelpers = function () {
	/**
  * Computes the current song time. Breaks down where the song is into
  * hours, minutes, seconds and formats it to be displayed to the user.
  *
  * @access public
  */
	function computeCurrentTimes() {
		/*
  	Initialize the current time object that will be returned.
  */
		var currentTime = {};

		/*
  	Computes the current seconds for the song.
  */
		var currentSeconds = (Math.floor(_config2.default.active_song.currentTime % 60) < 10 ? '0' : '') + Math.floor(_config2.default.active_song.currentTime % 60);

		/*
  	Computes the current minutes for the song.
  */
		var currentMinutes = Math.floor(_config2.default.active_song.currentTime / 60);

		/*
  	Initialize the current hours variable.
  */
		var currentHours = '00';

		/*
  	If the current minutes is less than 10, we add a leading 0.
  */
		if (currentMinutes < 10) {
			currentMinutes = '0' + currentMinutes;
		}

		/*
  	If the user is more than 60 minutes into the song, then
  	we extract the hours.
  */
		if (currentMinutes >= 60) {
			currentHours = Math.floor(currentMinutes / 60);
			currentMinutes = currentMinutes % 60;

			/*
   	If the user is less than 10 minutes in, we append the
   	additional 0 to the minutes.
   */
			if (currentMinutes < 10) {
				currentMinutes = '0' + currentMinutes;
			}
		}

		/*
  	Build a clean current time object and send back the appropriate information.
  */
		currentTime.seconds = currentSeconds;
		currentTime.minutes = currentMinutes;
		currentTime.hours = currentHours;

		return currentTime;
	}

	/**
  * Computes the current song duration. Breaks down where the song is into
  * hours, minutes, seconds and formats it to be displayed to the user.
  *
  * @access public
  */
	function computeSongDuration() {
		/*
  	Initialize the song duration object that will be returned.
  */
		var songDuration = {};

		/*
  	Computes the duration of the song's seconds.
  */
		var songDurationSeconds = (Math.floor(_config2.default.active_song.duration % 60) < 10 ? '0' : '') + Math.floor(_config2.default.active_song.duration % 60);

		/*
  	Computes the duration of the song's minutes.
  */
		var songDurationMinutes = Math.floor(_config2.default.active_song.duration / 60);

		/*
  	Initialize the hours duration variable.
  */
		var songDurationHours = '0';

		/*
  	If the song duration minutes is less than 10, we add a leading 0.
  */
		if (songDurationMinutes < 10) {
			songDurationMinutes = '0' + songDurationMinutes;
		}

		/*
  	If there is more than 60 minutes in the song, then we
  	extract the hours.
  */
		if (songDurationMinutes >= 60) {
			songDurationHours = Math.floor(songDurationMinutes / 60);
			songDurationMinutes = songDurationMinutes % 60;

			/*
   	If the song duration minutes is less than 10 we append
   	the additional 0.
   */
			if (songDurationMinutes < 10) {
				songDurationMinutes = '0' + songDurationMinutes;
			}
		}

		/*
  	Build a clean song duration object and send back the appropriate information.
  */
		songDuration.seconds = songDurationSeconds;
		songDuration.minutes = songDurationMinutes;
		songDuration.hours = songDurationHours;

		return songDuration;
	}

	/**
  * Computes the song completion percentage.
  *
  * @access public
  */
	function computeSongCompletionPercentage() {
		return _config2.default.active_song.currentTime / _config2.default.active_song.duration * 100;
	}

	/**
  * Sets the current song's playback speed
  *
  * @access public
  * @param {number} speed 	- The float with a base of 1 representing the speed
  *
  */
	function setPlaybackSpeed(speed) {
		_core2.default.setPlaybackSpeed(speed);
	}

	/**
  * Sets the state of the repeat for the current song.
  *
  * @access public
  * @param {boolean} repeat - A boolean representing whether the repeat should be on or off
  * @param {string} playlist - The key of the playlist for repeating
  */
	function setRepeat(repeat, playlist) {
		/*
    If the playlist is null, then we are dealing with the global
    repeat status.
  */
		if (playlist == null) {
			/*
   	Set the global repeat to be toggled
   */
			_config2.default.repeat = repeat;

			/*
   	Visually sync repeat
   */
			_visual2.default.syncRepeat();
		} else {
			/*
   	Set the playlist repeat to be toggled.
   */
			_config2.default.repeat_statuses[playlist] = repeat;

			/*
   	Visually sync playlist repeat
   */
			_visual2.default.syncRepeatPlaylist(playlist);
		}

		/** When song ends and in playlis mode and done with playlist check repeat  **/
	}

	/**
  * Sets the state of the repeat song
  *
  * @access public
  * @param {boolean} repeat - A boolean representing whether the repeat shoudl be on or off for the song.
  */
	function setRepeatSong(repeat) {
		_config2.default.repeat_song = repeat;
	}

	/**
  * Sets the main play pause buttons to the current state of the song.
  *
  * @access public
  */
	function setMainPlayPause() {
		/*
  	Determines what action we should take based on the
  	state of the song.
  */
		if (_config2.default.active_song.paused) {
			/*
   	The song was paused so we sync visually for the song
   	that is playing and we play the song.
   */
			_visual2.default.syncMainPlayPause('playing');

			/*
   	If there is an active playlist, then
   	we need to sync that playlist's play pause
   	button to the state of playing.
   */
			_visual2.default.syncPlaylistPlayPause(_config2.default.active_playlist, 'playing');

			/*
   	Sync the song play pause buttons
   */
			_visual2.default.syncSongPlayPause(_config2.default.active_playlist, _config2.default.active_index, 'playing');

			/*
   	Play the song
   */
			_core2.default.play();
		} else {
			/*
   	The song was playing so we sync visually for the song
   	to be paused and we pause the song.
   */
			_visual2.default.syncMainPlayPause('paused');

			/*
   	If there is an active playlist, then
   	we need to sync that playlist's play pause
   	button to the state of paused.
   */
			_visual2.default.syncPlaylistPlayPause(_config2.default.active_playlist, 'paused');

			/*
   	Sync the song play pause buttons
   */
			_visual2.default.syncSongPlayPause(_config2.default.active_playlist, _config2.default.active_index, 'paused');

			/*
   	Pause the song
   */
			_core2.default.pause();
		}
	}

	/**
  * Sets the playlist main play pause buttons to the current state of the song.
  *
  * @access public
  * @param {string} playlist The playlist the main play pause button controls
  */
	function setPlaylistPlayPause(playlist) {
		/*
  	The only thing that can change when you click a playlist
  	play pause is the playlist. Main play pauses have no change
  	in song, song play pauses can change playlist and song.
  */
		if (_helpers2.default.checkNewPlaylist(playlist)) {
			_helpers2.default.setActivePlaylist(playlist);

			/*
   	Play first song in the playlist since we just
   	switched playlists, we start from the first song.
   		If the user has shuffle on for the playlist, then
   	we go from the first song in the shuffle playlist array.
   */
			if (_config2.default.shuffled_statuses[playlist]) {
				_helpers2.default.changeSong(_config2.default.shuffled_playlists[playlist][0].original_index);
			} else {
				_helpers2.default.changeSong(_config2.default.playlists[playlist][0]);
			}
		}

		/*
  	Determines what action we should take based on the
  	state of the song.
  */
		if (_config2.default.active_song.paused) {
			/*
   	The song was paused so we sync visually for the song
   	that is playing and we play the song.
   */
			_visual2.default.syncMainPlayPause('playing');

			/*
   	If there is an active playlist, then
   	we need to sync that playlist's play pause
   	button to the state of playing.
   */
			_visual2.default.syncPlaylistPlayPause(_config2.default.active_playlist, 'playing');

			/*
   	Sync the song play pause buttons
   */
			_visual2.default.syncSongPlayPause(_config2.default.active_playlist, _config2.default.active_index, 'playing');

			/*
   	Play the song
   */
			_core2.default.play();
		} else {
			/*
   	The song was playing so we sync visually for the song
   	to be paused and we pause the song.
   */
			_visual2.default.syncMainPlayPause('paused');

			/*
   	If there is an active playlist, then
   	we need to sync that playlist's play pause
   	button to the state of paused.
   */
			_visual2.default.syncPlaylistPlayPause(_config2.default.active_playlist, 'paused');

			/*
   	Sync the song play pause buttons
   */
			_visual2.default.syncSongPlayPause(_config2.default.active_playlist, _config2.default.active_index, 'paused');

			/*
   	Pause the song
   */
			_core2.default.pause();
		}
	}

	/**
  * Sets the song play pause buttons to the current state of the song.
  *
  * @access public
  * @param {string} playlist The playlist the song is a part of
  * @param {number} songIndex The index of the song being played/paused
  *
  */
	function setSongPlayPause(playlist, songIndex) {
		/*
  	There can be multiple playlists on the page and there can be
  	multiple songs on the page AND there can be songs in multiple
  	playlists, so we have some checking to do.
  */

		/*
  	Check to see if the playlist has changed. If it has,
  	set the active playlist.
  */
		if (_helpers2.default.checkNewPlaylist(playlist)) {
			_helpers2.default.setActivePlaylist(playlist);

			/*
   	If there's a new playlist then we reset the
   	song since the song could be in 2 playlists,
   	but the user selects another playlist.
   */
			_helpers2.default.changeSong(songIndex);
		}

		/*
  	Check to see if the song has changed. If it has,
  	set the active song. If it was in a playlist, the
  	song wouldn't change here, since we already set the
  	song when we checked for a playlist.
  */
		if (_helpers2.default.checkNewSong(songIndex)) {
			/*
   	The song selected is different, so we change the
   	song.
   */
			_helpers2.default.changeSong(songIndex);
		}

		/*
  	Determines what action we should take based on the
  	state of the song.
  */
		if (_config2.default.active_song.paused) {
			/*
   	The song was paused so we sync visually for the song
   	that is playing and we play the song.
   */
			_visual2.default.syncMainPlayPause('playing');

			/*
   	If there is an active playlist, then
   	we need to sync that playlist's play pause
   	button to the state of playing.
   */
			_visual2.default.syncPlaylistPlayPause(_config2.default.active_playlist, 'playing');

			/*
   	Sync the song play pause buttons
   */
			_visual2.default.syncSongPlayPause(_config2.default.active_playlist, _config2.default.active_index, 'playing');

			/*
   	Play the song
   */
			_core2.default.play();
		} else {
			/*
   	The song was playing so we sync visually for the song
   	to be paused and we pause the song.
   */
			_visual2.default.syncMainPlayPause('paused');

			/*
   	If there is an active playlist, then
   	we need to sync that playlist's play pause
   	button to the state of paused.
   */
			_visual2.default.syncPlaylistPlayPause(_config2.default.active_playlist, 'paused');

			/*
   	Sync the song play pause buttons
   */
			_visual2.default.syncSongPlayPause(_config2.default.active_playlist, _config2.default.active_index, 'paused');

			/*
   	Pause the song
   */
			_core2.default.pause();
		}
	}

	/**
  * Sets the shuffle state for a playlist
  *
  * @access public
  * @param {string} playlist - The playlist being shuffled
  */
	function setShuffle(playlist) {
		/*
  	If the playlist is null, then we are dealing with the global
  	shuffle status.
  */
		if (playlist == null) {
			/*
   	If shuffle is on, we toggle it off. If shuffle is off, we
   	toggle on.
   */
			if (_config2.default.shuffle_on) {
				_config2.default.shuffle_on = false;
				_config2.default.shuffle_list = {};
			} else {
				_config2.default.shuffle_on = true;
				_helpers2.default.shuffleSongs();
			}

			/*
   	Visually sync the shuffle statuses
   */
			_visual2.default.syncShuffle(_config2.default.shuffle_on);
		} else {
			/*
   	If the playlist shuffled is on, we toggle it off. If the
   	playlist shuffled is off, we toggle it on.
   */
			if (_config2.default.shuffled_statuses[playlist]) {
				_config2.default.shuffled_statuses[playlist] = false;
				_config2.default.shuffled_playlists[playlist] = [];
			} else {
				_config2.default.shuffled_statuses[playlist] = true;
				_helpers2.default.shufflePlaylistSongs(playlist);
			}

			/*
   	Visually sync the playlist shuffle statuses.
   */
			_visual2.default.syncPlaylistShuffle(_config2.default.shuffled_statuses[playlist], playlist);
		}
	}

	/**
  * Sets the next song when next is clicked
  *
  * @access public
  * @param {boolean} [songEnded=false] If the song ended, this is set to true
  * so we take into effect the repeat setting.
 */
	function setNext() {
		var songEnded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		/*
  	Initializes the next index variable. This will be the
  	index of the song that is next.
  */
		var nextIndex = 0;
		/*
    Ensure we don't loop in the playlist if config.repeat is not true
  */
		var endOfList = false;

		if (_config2.default.repeat_song) {
			/*
   	If the playlist is shuffled, get the now playing index.
   */
			if (_config2.default.shuffle_on) {
				nextIndex = _config2.default.shuffle_active_index;
			} else {
				nextIndex = _config2.default.active_index;
			}
		} else {

			/*
   	If the shuffle is on, we use the shuffled list of
   	songs to determine our next song.
   */
			if (_config2.default.shuffle_on) {
				/*
    	If the active shuffle index + 1 is less than the length, then
    	we use the next shuffle otherwise we go to the beginning
    	of the shuffle list.
    */
				if (parseInt(_config2.default.shuffle_active_index) + 1 < _config2.default.shuffle_list.length) {
					_config2.default.shuffle_active_index = parseInt(_config2.default.shuffle_active_index) + 1;

					/*
     	Set the next index to be the index of the song in the shuffle list.
     */
					nextIndex = _config2.default.shuffle_list[parseInt(_config2.default.shuffle_active_index)].original_index;
				} else {
					_config2.default.shuffle_active_index = 0;
					nextIndex = 0;
					endOfList = true;
				}
			} else {
				/*
    	If the active index + 1 is less than the length of the songs, then
    	we use the next song otherwise we go to the beginning of the
    	song list.
    */
				if (parseInt(_config2.default.active_index) + 1 < _config2.default.songs.length) {
					_config2.default.active_index = parseInt(_config2.default.active_index) + 1;
				} else {
					_config2.default.active_index = 0;
					endOfList = true;
				}

				/*
    	Sets the next index.
    */
				nextIndex = _config2.default.active_index;
			}
		}

		/*
  	Stops the active song.
  */
		_core2.default.stop();

		/*
  	Change the song to the index we need.
  */
		_helpers2.default.changeSong(nextIndex);

		/*
  	If it's the end of the list and repeat is not on, do nothing.
  */
		if (endOfList && !_config2.default.repeat) {} else {
			/*
   	If the song has ended and repeat is on, play the song.
   */
			if (!(songEnded && !_config2.default.repeat && endOfList)) {
				_core2.default.play();
			}
		}

		/*
  	Syncs the main play pause button, playlist play pause button and
  	song play pause.
  */
		_visual2.default.syncMainPlayPause();
		_visual2.default.syncSongPlayPause(null, nextIndex);

		/*
  	Call after next callback
  */
		_helpers2.default.runCallback('after_next');

		/*
  	If we are repeating the song, call the song repeated callback
  */
		if (_config2.default.repeat_song) {
			_helpers2.default.runCallback('song_repeated');
		}
	}

	/**
  * Sets the next song in a playlist
  *
  * @param {string} playlist - The playlist being shuffled
  * @param {boolean} [songEnded=false] - If the song ended, this is set to true
  * so we take into effect the repeat setting.
  */
	function setNextPlaylist(playlist) {
		var songEnded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		/*
  	Initializes the next index
  */
		var nextIndex = 0;

		/*
    Used to determine whether the playlist looped over
    If it did, only play if repeat is allowed, end otherwise
    @TODO: Different settings for song loop, in-playlist loop and global loop
  */
		var endOfList = false;

		/*
  	If we are repeating the song, then we just start the song over.
  */

		if (_config2.default.repeat_song) {
			/*
   	If the playlist is shuffled, get the now playing index.
   */
			if (_config2.default.shuffled_statuses[playlist]) {
				nextIndex = _config2.default.shuffled_playlists[playlist][_config2.default.shuffled_active_indexes[playlist]].original_index;
			} else {
				nextIndex = _config2.default.active_index;
			}
		} else {
			/*
   	If the playlist is shuffled we get the next index of the playlist.
   */
			if (_config2.default.shuffled_statuses[playlist]) {
				/*
    	Gets the shuffled playlist's active song index.
    */
				var shuffledPlaylistActiveSongIndex = parseInt(_config2.default.shuffled_active_indexes[playlist]);

				/*
    	If the index + 1 is less than the length of the playlist, we increment
    	the next index otherwise we take the first index of 0.
    */
				if (shuffledPlaylistActiveSongIndex + 1 < _config2.default.shuffled_playlists[playlist].length) {
					/*
     	Set the shuffled playlist active song index.
     */
					_config2.default.shuffled_active_indexes[playlist] = shuffledPlaylistActiveSongIndex + 1;
					/*
     	Get the index of the song that we will be switching to.
     */
					nextIndex = _config2.default.shuffled_playlists[playlist][_config2.default.shuffled_active_indexes[playlist]].original_index;
				} else {
					/*
     	Sets the active shuffled playlist active index to 0 and gets the original index of
     	the song at the shuffled index of 0.
     */
					_config2.default.shuffled_active_indexes[playlist] = 0;
					nextIndex = _config2.default.shuffled_playlists[playlist][0].original_index;
					endOfList = true;
				}
			} else {
				/*
    	Gets the index of the active song within the scope
    	of the playlist.
    */
				var playlistActiveSongIndex = _config2.default.playlists[playlist].indexOf(parseInt(_config2.default.active_index));

				/*
    	Checks to see if the next index is still less than the length of the playlist.
    	If it is, use the next index othwerwise get the first song in the playlist.
    */
				if (playlistActiveSongIndex + 1 < _config2.default.playlists[playlist].length) {
					_config2.default.active_index = parseInt(_config2.default.playlists[playlist][playlistActiveSongIndex + 1]);
				} else {
					_config2.default.active_index = parseInt(_config2.default.playlists[playlist][0]);
					endOfList = true;
				}

				/*
    	Sets the next inex to the active index in the config.
    */
				nextIndex = _config2.default.active_index;
			}
		}

		/*
  	Stops the active song playing.
  */

		_core2.default.stop();

		/*
  	Changes the song to the next song in the playlist.
  */
		_helpers2.default.changeSong(nextIndex);

		/*
  	If it's the end of the song in the playlist, and repeat for
  	the playlist is not on, do nothing.
  */
		if (endOfList && !_config2.default.repeat_statuses[playlist]) {} else {
			/*
   	If the song has ended and repeat is on, play the song.
   */
			if (!(songEnded && !_config2.default.repeat_statuses[playlist] && endOfList)) {
				_core2.default.play();
			}
		}

		_helpers2.default.setActivePlaylist(playlist);

		/*
  	Syncs the main play pause button, playlist play pause button and
  	song play pause.
  */
		_visual2.default.syncMainPlayPause();
		_visual2.default.syncPlaylistPlayPause(playlist);
		_visual2.default.syncSongPlayPause(playlist, nextIndex);

		/*
  	Call after next callback
  */
		_helpers2.default.runCallback('after_next');

		/*
  	If we are repeating the song, call the song repeated callback
  */
		if (_config2.default.repeat_song) {
			_helpers2.default.runCallback('song_repeated');
		}
	}

	/**
  * Sets the previous song
  * @access public
  *
 /*--------------------------------------------------------------------------
 	Sets the previous song
 --------------------------------------------------------------------------*/
	function setPrev() {
		/*
  	Initializes the prev index variable. This will be the
  	index of the song that is next.
  */
		var prevIndex = 0;

		/*
  	If the shuffle is on for the individual songs, we get the previous
  	song.
  */
		if (_config2.default.shuffle_on) {
			/*
   	If the previous index is greater than or equal to 0, we use the active
   	index - 1.
   */
			if (parseInt(_config2.default.shuffle_active_index) - 1 >= 0) {
				/*
    	Sets the new active to be 1 less than the current active index.
    */
				_config2.default.shuffle_active_index = parseInt(_config2.default.shuffle_active_index) - 1;

				/*
    	Gets the index of the song in the song array for the new index.
    */
				prevIndex = _config2.default.shuffle_list[parseInt(_config2.default.shuffle_active_index)].original_index;
			} else {
				/*
    	Set the active index and previous index.
    */
				_config2.default.shuffle_active_index = _config2.default.shuffle_list.length - 1;
				prevIndex = _config2.default.shuffle_list[parseInt(_config2.default.shuffle_list.length) - 1].original_index;
			}
		} else {
			/*
   	If the active index - 1 is greater than or equal to 0, we subtract 1 from the
   	active index otherwise we set the active index to the end of the songs array index.
   */
			if (parseInt(_config2.default.active_index) - 1 >= 0) {
				_config2.default.active_index = parseInt(_config2.default.active_index) - 1;
			} else {
				_config2.default.active_index = _config2.default.songs.length - 1;
			}

			/*
   	Set the previous index.
   */
			prevIndex = _config2.default.active_index;
		}

		/*
  	Stops the active song.
  */
		_core2.default.stop();

		/*
  	Change the song to the index we need.
  */
		_helpers2.default.changeSong(prevIndex);

		/*
  	Play the next song.
  */
		_core2.default.play();

		/*
  	Sync the play/pause buttons to the current state of the player.
  */
		_visual2.default.syncMainPlayPause('playing');
		_visual2.default.syncSongPlayPause(null, prevIndex, 'playing');

		/*
  	Call after prev callback
  */
		_helpers2.default.runCallback('after_prev');
	}

	/**
  * Sets the previous song in a playlist
  *
  * @access public
  * @param {string} playlist 	- The playlist we are setting the previous for.
  */
	function setPrevPlaylist(playlist) {
		/*
  	Initializes the prev index variable. This will be the
  	index of the song that is next.
  */
		var prevIndex = 0;

		/*
  	If the shuffle is on for the playlist, we get the previous
  	song.
  */
		if (_config2.default.shuffled_statuses[playlist]) {
			/*
   	Gets the active song index for the shuffled playlist
   */
			var shuffledPlaylistActiveSongIndex = parseInt(_config2.default.shuffled_active_indexes[playlist]);

			/*
   	If the shuffled song active index is greater than or equal to 0,
   	we use the active index - 1.
   */
			if (shuffledPlaylistActiveSongIndex - 1 >= 0) {
				/*
    	Sets the active index to the active song index - 1
    */
				_config2.default.shuffled_active_indexes[playlist] = shuffledPlaylistActiveSongIndex - 1;

				/*
    	Gets the index of the song in the song array for the new index.
    */
				prevIndex = _config2.default.shuffled_playlists[playlist][_config2.default.shuffled_active_indexes[playlist]].original_index;
			} else {
				/*
    	Set the active index and previous index.
    */
				_config2.default.shuffled_active_indexes[playlist] = _config2.default.shuffled_playlists[playlist].length - 1;
				prevIndex = _config2.default.shuffled_playlists[playlist][_config2.default.shuffled_playlists[playlist].length - 1].original_index;
			}
		} else {
			/*
   	Gets the active song index for the playlist
   */
			var playlistActiveSongIndex = _config2.default.playlists[playlist].indexOf(parseInt(_config2.default.active_index));

			/*
   	If the active song index in the playlist - 1 is greater than
   	or equal to 0, then we use the active song index - 1.
   */
			if (playlistActiveSongIndex - 1 >= 0) {
				_config2.default.active_index = parseInt(_config2.default.playlists[playlist][playlistActiveSongIndex - 1]);
			} else {
				_config2.default.active_index = parseInt(_config2.default.playlists[playlist][_config2.default.playlists[playlist].length - 1]);
			}

			/*
   	Set the previous index to the active index for use later.
   */
			prevIndex = _config2.default.active_index;
		}

		/*
  	Stops the active song.
  */
		_core2.default.stop();

		/*
  	Changes the song to the prev song in the playlist.
  */
		_helpers2.default.changeSong(prevIndex);
		_helpers2.default.setActivePlaylist(playlist);

		/*
  	Plays the song
  */
		_core2.default.play();

		/*
  	Syncs the main play pause button, playlist play pause button and
  	song play pause.
  */
		_visual2.default.syncMainPlayPause('playing');
		_visual2.default.syncPlaylistPlayPause(playlist, 'playing');
		_visual2.default.syncSongPlayPause(playlist, prevIndex, 'playing');

		/*
  	Call after prev callback
  */
		_helpers2.default.runCallback('after_prev');
	}

	/**
  * Runs an event on key down
  *
  * @access public
  * @param {number} key 	- The key code the event is bound to.
  */
	function runKeyEvent(key) {
		/*
  	Checks to see if the user bound an event to the code pressed.
  */
		if (_config2.default.bindings[key] != undefined) {
			/*
   	Determine which event should be run if bound.
   */
			switch (_config2.default.bindings[key]) {
				/*
    	Fires a play pause event.
    */
				case 'play_pause':
					setSongPlayPause(_config2.default.active_playlist, _config2.default.active_index);
					break;

				/*
    	Fires a next event.
    */
				case 'next':
					/*
     	Check to see if the current state of the player
     	is in playlist mode or not playlist mode.
     */
					if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null) {
						setNext();
					} else {
						setNextPlaylist(_config2.default.active_playlist);
					}
					break;

				/*
    	Fires a previous event.
    */
				case 'prev':
					/*
     	Check to see if the current playlist has been set
     	or null and set the previous song.
     */
					if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null) {
						AmplitudeEventsHelpers.setPrev();
					} else {
						AmplitudeEventsHelpers.setPrevPlaylist(_config2.default.active_playlist);
					}
					break;

				/*
    	Fires a stop event.
    */
				case 'stop':
					/*
     	Sets all of the play/pause buttons to pause
     */
					_visual2.default.setPlayPauseButtonsToPause();

					/*
     	Stops the active song.
     */
					_core2.default.stop();
					break;

				/*
    	Fires a shuffle event.
    */
				case 'shuffle':
					/*
     	Check to see if the current playlist has been set
     	or null and set the previous song.
     */
					if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null) {
						AmplitudesEventHelpers.setShuffle(null);
					} else {
						AmplitudeEvenstHelpers.setShuffle(_config2.default.active_playlist);
					}
					break;

				/*
    	Fires a repeat event.
    */
				case 'repeat':
					/*
     	Sets repeat to the opposite of what it was set to
     */
					AmplitudeEventsHelpers.setRepeat(!_config2.default.repeat);

					/*
     	Visually sync repeat
     */
					_visual2.default.syncRepeat();
					break;
			}
		}
	}

	/*
 	Return the publically scoped functions
 */
	return {
		computeCurrentTimes: computeCurrentTimes,
		computeSongDuration: computeSongDuration,
		computeSongCompletionPercentage: computeSongCompletionPercentage,
		setPlaybackSpeed: setPlaybackSpeed,
		setRepeat: setRepeat,
		setRepeatSong: setRepeatSong,
		setMainPlayPause: setMainPlayPause,
		setPlaylistPlayPause: setPlaylistPlayPause,
		setSongPlayPause: setSongPlayPause,
		setShuffle: setShuffle,
		setNext: setNext,
		setNextPlaylist: setNextPlaylist,
		setPrev: setPrev,
		setPrevPlaylist: setPrevPlaylist,
		runKeyEvent: runKeyEvent
	};
}();

/**
 * Imports the Amplitude Core Helpers module
 * @module core/AmplitudeCoreHelpers
 */


/**
 * Imports the Amplitude Visual Sync module
 * @module visual/AmplitudeVisualSync
 */
exports.default = AmplitudeEventsHelpers;
module.exports = exports['default'];

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _core = __webpack_require__(3);

var _core2 = _interopRequireDefault(_core);

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _events = __webpack_require__(4);

var _events2 = _interopRequireDefault(_events);

var _soundcloud = __webpack_require__(9);

var _soundcloud2 = _interopRequireDefault(_soundcloud);

var _visual = __webpack_require__(2);

var _visual2 = _interopRequireDefault(_visual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * AmplitudeJS Initializer Module. Helps with the handling of all of the
 * initialization for AmplitudeJS.
 *
 * @module init/AmplitudeInitializer
 */


/**
 * AmplitudeJS Soundcloud
 * @module soundcloud/AmplitudeSoundcloud
 */


/**
 * AmplitudeJS Core Helpers
 * @module core/AmplitudeHelpers
 */
/**
 * Imports the config module
 * @module config
 */
var AmplitudeInitializer = function () {

	/**
   * The main init function.  The user will call this through
  * Amplitude.init({}) and pass in their settings.
  *
  * Public Accessor: Amplitude.init( user_config_json )
  * @access public
   * @param {object} userConfig - A JSON object of user defined values that help configure and initialize AmplitudeJS.
   */
	function initialize(userConfig) {
		var ready = false;

		/*
  	Reset the config on init so we have a clean slate. This is if the
  	user has to re-init.
  */
		_helpers2.default.resetConfig();

		/*
  	Initialize event handlers on init. This will clear any old
  	event handlers on the amplitude element and re-bind what is
  	necessary.
  */
		_events2.default.initializeEvents();

		/*
  	Initializes debugging right away so we can use it for the rest
  	of the configuration.
  */
		_config2.default.debug = userConfig.debug != undefined ? userConfig.debug : false;

		/*
  	Checks to see if the user has songs defined.
  */
		if (userConfig.songs) {
			/*
   	Checks to see if the user has some songs in the songs array.
   */
			if (userConfig.songs.length != 0) {
				/*
    	Copies over the user defined songs. and prepares
    	Amplitude for the rest of the configuration.
    */
				_config2.default.songs = userConfig.songs;
				/*
    	Flag amplitude as ready.
    */
				ready = true;
			} else {
				_helpers2.default.writeDebugMessage('Please add some songs, to your songs object!');
			}
		} else {
			_helpers2.default.writeDebugMessage('Please provide a songs object for AmplitudeJS to run!');
		}

		/**
   * Initializes the audio context. In this method it checks to see if the
   * user wants to use visualizations or not before proceeding.
   * @todo MAKE HANDLED BY AMPLITUDE FX.
   */
		//privateHelpInitializeAudioContext();

		/*
  	Checks if the user has any playlists defined. If they do
  	we have to initialize the functionality for the playlists.
  */
		if (userConfig.playlists && countPlaylists(userConfig.playlists) > 0) {
			/*
   	Copy the playlists over to Amplitude
   */
			_config2.default.playlists = userConfig.playlists;

			/*
   	Initialize default live settings
   */
			initializeDefaultLiveSettings();

			/*
   	Check to see if the user has valid song indexes in their playlist.
   */
			checkValidSongsInPlaylists();

			/*
   	Initialize the shuffle status of the playlists.
   */
			initializePlaylistShuffleStatuses();

			/*
   	Initialize the repeat status for the playlits.
   */
			initializePlaylistsRepeatStatuses();

			/*
   	Initialize temporary place holders for shuffle lists.
   */
			initializePlaylistShuffleLists();

			/*
   	Initializes the active shuffled indexes for shuffled playlists.
   */
			initializePlaylistShuffleIndexes();

			/*
   	Initializes the first song in the playlist
   */
			initializeFirstSongInPlaylistMetaData();
		}

		/*
  	When the preliminary config is ready, we are ready to proceed.
  */
		if (ready) {
			/*
   	Copies over the soundcloud information to the global config
   	which will determine where we go from there.
   */
			_config2.default.soundcloud_client = userConfig.soundcloud_client != undefined ? userConfig.soundcloud_client : '';

			/*
   	Checks if we want to use the art loaded from soundcloud.
   */
			_config2.default.soundcloud_use_art = userConfig.soundcloud_use_art != undefined ? userConfig.soundcloud_use_art : '';

			/*
   	If the user provides a soundcloud client then we assume that
   	there are URLs in their songs that will reference SoundcCloud.
   	We then copy over the user config they provided to the
   	temp_user_config so we don't mess up the global or their configs
   	and load the soundcloud information.
   */
			var tempUserConfig = {};

			if (_config2.default.soundcloud_client != '') {
				tempUserConfig = userConfig;

				/*
    	Load up SoundCloud for use with AmplitudeJS.
    */
				_soundcloud2.default.loadSoundCloud(tempUserConfig);
			} else {
				/*
    	The user is not using Soundcloud with Amplitude at this point
    	so we just finish the configuration with the users's preferences.
    */
				setConfig(userConfig);
			}
		}

		/*
  	Debug out what was initialized with AmplitudeJS.
  */
		_helpers2.default.writeDebugMessage('Initialized With: ');
		_helpers2.default.writeDebugMessage(_config2.default);
	}

	/**
  * Rebinds all of the elements in the display.
  *
  * Public Accessor: Amplitude.rebindDisplay()
  * @access public
  */
	function rebindDisplay() {
		_events2.default.initializeEvents();
		_visual2.default.displaySongMetadata();
	}

	/**
  * Finishes the initalization of the config. Takes all of the user defined
  * parameters and makes sure they override the defaults. The important
  * config information is assigned in the publicInit() function.
  *
  * This function can be called from 2 different locations:
  * 	1. Right away on init after the important settings are defined.
  *
  * 	2. After all of the Soundcloud URLs are resolved properly and
  *	 	soundcloud is configured.  We will need the proper URLs from Soundcloud
  * 		to stream through Amplitude so we get those right away before we
  * 		set the information and the active song
  *
  * @access public
  * @param {object} userConfig - A JSON object of user defined values that help configure and initialize AmplitudeJS.
  */
	function setConfig(userConfig) {
		/*
  	Check to see if the user entered a start song
  */
		if (userConfig.start_song != undefined) {
			/*
   	Ensure what has been entered is an integer.
   */
			if (_helpers2.default.isInt(userConfig.start_song)) {
				_helpers2.default.changeSong(userConfig.start_song);
			} else {
				_helpers2.default.writeDebugMessage("You must enter an integer index for the start song.");
			}
		} else {
			_helpers2.default.changeSong(0);
		}

		/*
  	Initialize a sh
  */
		if (userConfig.shuffle_on != undefined && userConfig.shuffle_on) {
			_config2.default.shuffle_on = true;
			_helpers2.default.shuffleSongs();

			/*
   	Visually sync the shuffle statuses
   */
			_visual2.default.syncShuffle(_config2.default.shuffle_on);

			_helpers2.default.changeSong(_config2.default.shuffle_list[0].original_index);
		}

		/*
  	Allows the user to set whether they want to continue to the next song
  	when the current song finishes or not. In any scenario that's not a playlist,
  	contining to the next song may not be desired.
  */
		_config2.default.continue_next = userConfig.continue_next != undefined ? userConfig.continue_next : true;

		/*
  	If the user defined a playback speed, we copy over their
  	preference here, otherwise we default to normal playback
  	speed of 1.0.
  */
		_config2.default.playback_speed = userConfig.playback_speed != undefined ? userConfig.playback_speed : 1.0;

		/*
  	Sets the audio playback speed.
  */
		_core2.default.setPlaybackSpeed(_config2.default.playback_speed);

		/*
  	If the user wants the song to be pre-loaded for instant
  	playback, they set it to true. By default it's set to just
  	load the metadata.
  */
		_config2.default.active_song.preload = userConfig.preload != undefined ? userConfig.preload : "auto";

		/*
  	Initializes the user defined callbacks. This should be a JSON
  	object that contains a key->value store of the callback name
  	and the name of the function the user needs to call.
  */
		_config2.default.callbacks = userConfig.callbacks != undefined ? userConfig.callbacks : {};

		/*
  	Initializes the user defined key bindings. This should be a JSON
  	object that contains a key->value store of the key event number
  	pressed and the method to be run.
  */
		_config2.default.bindings = userConfig.bindings != undefined ? userConfig.bindings : {};

		/*
  	The user can define a starting volume in a range of 0-100 with
  	0 being muted and 100 being the loudest. After the config is set
  	Amplitude sets the active song's volume to the volume defined
  	by the user.
  */
		_config2.default.volume = userConfig.volume != undefined ? userConfig.volume : 50;

		/*
  	The user can set the volume increment and decrement values between 1 and 100
  	for when the volume up or down button is pressed.  The default is an increase
  	or decrease of 5.
  */
		_config2.default.volume_increment = userConfig.volume_increment != undefined ? userConfig.volume_increment : 5;

		_config2.default.volume_decrement = userConfig.volume_decrement != undefined ? userConfig.volume_decrement : 5;

		/*
  	Set the volume to what is defined in the config. The user can define this,
  	so we should set it up that way.
  */
		_core2.default.setVolume(_config2.default.volume);

		/*
  	Since the user can define a start volume, we want our volume
  	sliders to sync with the user defined start value.
  */
		_visual2.default.syncVolumeSliders();

		/*
  	If the user defines default album art, this image will display if the active
  	song doesn't have album art defined.
  */
		if (userConfig.default_album_art != undefined) {
			_config2.default.default_album_art = userConfig.default_album_art;
		} else {
			_config2.default.default_album_art = '';
		}

		/*
  	Syncs all of the visual time elements to 00.
  */
		_visual2.default.resetTimes();

		/*
  	Sets all of the play pause buttons to pause.
  */
		_visual2.default.setPlayPauseButtonsToPause();

		/*
  	Sets the meta data for the songs automatically.
  */
		_visual2.default.syncSongsMetaData();

		/*
  	If the user has autoplay enabled, then begin playing the song. Everything should
  	be configured for this to be ready to play.
  */
		if (userConfig.autoplay) {
			/*
   	If the user hasn't set a starting playlist, set it to null otherwise initialize to the
   	starting playlist selected by the user.
   */
			if (userConfig.starting_playlist == '') {
				_config2.default.active_playlist = null;
			} else {
				_config2.default.active_playlist = userConfig.starting_playlist;
			}

			/*
   	Sync the main and song play pause buttons.
   */
			_visual2.default.syncMainPlayPause('playing');
			_visual2.default.syncSongPlayPause(_config2.default.active_playlist, 0, 'playing');

			/*
   	Start playing the song
   */
			_core2.default.play();
		}

		/*
  	If the user has selected a starting playlist, we need to set the starting playlist
  	and sync the visuals
  */
		if (userConfig.starting_playlist != '' && userConfig.starting_playlist != undefined) {
			/*
   	Set the active playlist to the starting playlist by the user
   */
			_config2.default.active_playlist = userConfig.starting_playlist;

			/*
   	Set the player to the first song in the playlist
   */
			_helpers2.default.changeSong(userConfig.playlists[userConfig.starting_playlist][0]);

			/*
   	Sync the main and song play pause buttons.
   */
			_visual2.default.syncMainPlayPause('paused');
			_visual2.default.syncSongPlayPause(_config2.default.active_playlist, 0, 'paused');
		}

		/*
  	Run after init callback
  */
		_helpers2.default.runCallback('after_init');
	}

	/**
  * Counts the number of playlists the user has configured. This ensures
  * that the user has at least 1 playlist so we can validate the songs
  * defined in the playlist are correct and they didn't enter an invalid
  * ID.
  *
  * @access private
  * @param {object} playlists 	-
  */
	function countPlaylists(playlists) {
		/*
  	Initialize the placeholders to iterate through the playlists
  	and find out how many we have to account for.
  */
		var size = 0,
		    key = void 0;

		/*
  	Iterate over playlists and if the user has the playlist defined,
  	increment the size of playlists.
  */
		for (key in playlists) {
			if (playlists.hasOwnProperty(key)) {
				size++;
			}
		}

		/*
  	Debug how many playlists are in the config.
  */
		_helpers2.default.writeDebugMessage('You have ' + size + ' playlist(s) in your config');

		/*
  	Return the number of playlists in the config.
  */
		return size;
	}

	/**
 * Ensures the indexes in the playlists are valid indexes. The song has
 * to exist in the Amplitude config to be played correctly.
 *
 * @access private
 */
	function checkValidSongsInPlaylists() {
		/*
  	Iterate over all of the config's playlists
  */
		for (var key in _config2.default.playlists) {
			/*
   	Checks if the playlist key is accurate.
   */
			if (_config2.default.playlists.hasOwnProperty(key)) {
				/*
    	Checks if the playlist has songs.
    */
				if (_config2.default.playlists[key].songs) {
					/*
     	Iterate over all of the songs in the playlist
     */
					for (var i = 0; i < _config2.default.playlists[key].songs.length; i++) {
						/*
      	Check to see if the index for the song in the playlist
      	exists in the songs config.
      */
						if (!_config2.default.songs[_config2.default.playlists[key].songs[i]]) {
							_helpers2.default.writeDebugMessage('The song index: ' + _config2.default.playlists[key].songs[i] + ' in playlist with key: ' + key + ' is not defined in your songs array!');
						}
					}
				}
			}
		}
	}

	/**
  * Initializes the shuffle statuses for each of the playlists. These will
  * be referenced when we shuffle individual playlists.
  *
  * @access private
  */
	function initializePlaylistShuffleStatuses() {
		/*
  	Iterate over all of the playlists the user defined adding
  	the playlist key to the shuffled playlist array and creating
  	and empty object to house the statuses.
  */
		for (var key in _config2.default.playlists) {
			_config2.default.shuffled_statuses[key] = false;
		}
	}

	/**
  * Initializes the repeat statuses for each of the playlists.  These will
  * be referenced when we repeat individual playlits.
  *
  * @access private
  */
	function initializePlaylistsRepeatStatuses() {
		/*
  	Iterate over all of the playlists the user defined adding
  	the playlist key to the repeated playlist array and creating
  	and empty object to house the statuses.
  */
		for (var key in _config2.default.playlists) {
			_config2.default.repeat_statuses[key] = false;
		}
	}

	/**
  * Initializes the shuffled playlist placeholders. These will be set for
  * playlists that are shuffled and contain the shuffled songs.
  *
  * @access private
 	 */
	function initializePlaylistShuffleLists() {
		/*
  	Iterate over all of the playlists the user defined adding
  	the playlist key to the shuffled playlists array and creating
  	and empty object to house the shuffled playlists
  */
		for (var key in _config2.default.playlists) {
			_config2.default.shuffled_playlists[key] = [];
		}
	}

	/**
  * Initializes the shuffled playlist indexes array. These will be set for
  * playlists that are shuffled and contain the active shuffled index.
  *
  * @access private
  */
	function initializePlaylistShuffleIndexes() {
		/*
  	Iterates over all of the playlists adding a key
  	to the shuffled_active_indexes array that contains
  	the active shuffled index.
  */
		for (var key in _config2.default.playlists) {
			_config2.default.shuffled_active_indexes[key] = 0;
		}
	}

	/**
  * Intializes the display for the first song in the playlist meta data.
  *
  * @access private
  */
	function initializeFirstSongInPlaylistMetaData() {
		/*
  	Iterates over all of the playlists setting the meta data for the
  	first song.
  */
		for (var key in _config2.default.playlists) {
			_visual2.default.setFirstSongInPlaylist(_config2.default.songs[_config2.default.playlists[key][0]], key);
		}
	}

	/**
  * Intializes the default live settings for all of the songs.
  *
  * @access priavet
  */
	function initializeDefaultLiveSettings() {
		for (var i = 0; i < _config2.default.songs.length; i++) {
			if (_config2.default.songs[i].live == undefined) {
				_config2.default.songs[i].live = false;
			}
		}
	}

	/*
 	Returns the publicly accessible methods
 */
	return {
		initialize: initialize,
		setConfig: setConfig,
		rebindDisplay: rebindDisplay
	};
}();

/**
 * AmplitudeJS Visual Sync
 * @module visual/AmplitudeVisualSync
*/


/**
 * AmplitudeJS Events
 * @module events/AmplitudeEvents
 */


/**
 * AmplitudeJS Core Module
 * @module core/AmplitudeCore
 */
exports.default = AmplitudeInitializer;
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _helpers = __webpack_require__(5);

var _helpers2 = _interopRequireDefault(_helpers);

var _visual = __webpack_require__(2);

var _visual2 = _interopRequireDefault(_visual);

var _core = __webpack_require__(3);

var _core2 = _interopRequireDefault(_core);

var _helpers3 = __webpack_require__(1);

var _helpers4 = _interopRequireDefault(_helpers3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * These functions handle the events that we bound to each element and
 * prepare for a function to be called. These kind of act like filters/middleware.
 *
 * @module events/AmplitudeHandlers
 */


/**
 * Imports the core module of Amplitude which handles the basic functions
 * @module core/AmplitudeCore
 */


/**
 * Imports the helpers for the event handlers.
 * @module events/AmplitudeEventsHelpers
 */
exports.default = {
	/**
  * When the time updates on the active song, we sync the current time displays
  *
  * HANDLER FOR: timeupdate
  *
  * @access public
  */
	updateTime: function updateTime() {
		/*
  	Help from: http://jsbin.com/badimipi/1/edit?html,js,output
  */
		if (_config2.default.active_song.buffered.length - 1 >= 0) {
			var bufferedEnd = _config2.default.active_song.buffered.end(_config2.default.active_song.buffered.length - 1);
			var duration = _config2.default.active_song.duration;

			_config2.default.buffered = bufferedEnd / duration * 100;
		}

		/*
  	Sync the buffered progress bars.
  */
		_visual2.default.syncBufferedProgressBars();

		/*
  	If the current song is not live, then
  	we can update the time information. Otherwise the
  	current time updates wouldn't mean much since the time
  	is infinite.
  */
		if (!_config2.default.active_metadata.live) {
			/*
   	Compute the current time
   */
			var currentTime = _helpers2.default.computeCurrentTimes();

			/*
   	Compute the song completion percentage
   */
			var songCompletionPercentage = _helpers2.default.computeSongCompletionPercentage();

			/*
   	Computes the song duration
   */
			var songDuration = _helpers2.default.computeSongDuration();

			/*
   	Sync the current time elements with the current
   	location of the song and the song duration elements with
   	the duration of the song.
   */
			_visual2.default.syncCurrentTime(currentTime, songCompletionPercentage);
			_visual2.default.syncSongDuration(currentTime, songDuration);

			/*
   	Runs the callback defined for the time update.
   */
			_helpers4.default.runCallback('time_update');
		}
	},

	/**
  * When the keydown event is fired, we determine which function should be run
  * based on what was passed in.
  *
  * HANDLER FOR: keydown
  *
  * @access public
  */
	keydown: function keydown(event) {
		_helpers2.default.runKeyEvent(event.which);
	},

	/**
  * When the song has ended, handles what to do next
  *
  * HANDLER FOR: ended
  *
  * @access public
  */
	songEnded: function songEnded() {
		if (_config2.default.continue_next) {
			/*
   	If the active playlist is not set, we set the
   	next song that's in the songs array.
   */
			if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null) {
				_helpers2.default.setNext(true);
			} else {
				/*
    	Set the next song in the playlist
    */
				_helpers2.default.setNextPlaylist(_config2.default.active_playlist, true);
			}
		} else {
			if (!_config2.default.is_touch_moving) {
				/*
    	Sets all of the play/pause buttons to pause
    */
				_visual2.default.setPlayPauseButtonsToPause();

				/*
    	Stops the active song.
    */
				_core2.default.stop();
			}
		}
	},

	/**
  * As the song is buffered, we can display the buffered percentage in
  * a progress bar.
  *
  * HANDLER FOR: ended
  *
  * @access public
  */
	progress: function progress() {
		/*
  	Help from: http://jsbin.com/badimipi/1/edit?html,js,output
  */
		if (_config2.default.active_song.buffered.length - 1 >= 0) {
			var bufferedEnd = _config2.default.active_song.buffered.end(_config2.default.active_song.buffered.length - 1);
			var duration = _config2.default.active_song.duration;

			_config2.default.buffered = bufferedEnd / duration * 100;
		}

		/*
  	Sync the buffered progress bars.
  */
		_visual2.default.syncBufferedProgressBars();
	},

	/**
  * Handles an event on a play button in Amplitude.
  *
  * HANDLER FOR: 'amplitude-play'
  *
  * @access public
  * @TODO Finish commenting and re-structure
  */
	play: function play() {
		if (!_config2.default.is_touch_moving) {
			/*
   	Gets the attribute for song index so we can check if
   	there is a need to change the song.  In some scenarios
   	there might be multiple play classes on the page. In that
   	case it is possible the user could click a different play
   	class and change the song.
   */
			var playButtonSongIndex = this.getAttribute('amplitude-song-index');
			var playButtonPlaylistIndex = this.getAttribute('amplitude-playlist');

			if (playButtonPlaylistIndex == null && playButtonSongIndex == null) {
				_helpers2.default.setSongPlayPause(_config2.default.active_playlist, _config2.default.active_index);
			}

			/*
   	*/
			if (playButtonPlaylistIndex != null && playButtonPlaylistIndex != '') {
				if (_helpers4.default.checkNewPlaylist(playButtonPlaylistIndex)) {
					_helpers4.default.setActivePlaylist(playButtonPlaylistIndex);

					if (playButtonSongIndex != null) {
						_helpers4.default.changeSong(playButtonSongIndex);
						_helpers2.default.setPlaylistPlayPause(playButtonPlaylistIndex);
					} else {
						_helpers4.default.changeSong(_config2.default.playlists[playButtonPlaylistIndex][0]);
						_helpers2.default.setPlaylistPlayPause(playButtonPlaylistIndex);
					}
				} else {
					if (playButtonSongIndex != null) {
						_helpers4.default.changeSong(playButtonSongIndex);
						_helpers2.default.setPlaylistPlayPause(playButtonPlaylistIndex);
					} else {
						_helpers4.default.changeSong(_config2.default.active_index);
						_helpers2.default.setPlaylistPlayPause(playButtonPlaylistIndex);
					}
				}
			}

			/*
   	*/
			if ((playButtonPlaylistIndex == null || playButtonPlaylistIndex == '') && playButtonSongIndex != null && playButtonSongIndex != '') {

				if (_helpers4.default.checkNewSong(playButtonSongIndex) || _config2.default.active_playlist != playButtonPlaylistIndex) {
					_helpers4.default.changeSong(playButtonSongIndex);
				}

				_helpers2.default.setSongPlayPause(playButtonPlaylistIndex, playButtonSongIndex);
			}

			/*
   	Start the visualizations for the song.
   	AMPFX-TODO: MAKE HANDLED BY AMPLITUDE FX
   */
			//privateStartVisualization();
		}
	},

	/**
  * Handles an event on a pause button
  *
  * HANDLER FOR: 'amplitude-pause'
  *
  * @access public
  * @TODO Finish commenting and optimize
  */
	pause: function pause() {
		if (!_config2.default.is_touch_moving) {
			var pauseButtonSongIndex = this.getAttribute('amplitude-song-index');
			var pauseButtonPlaylistIndex = this.getAttribute('amplitude-playlist');

			if (pauseButtonSongIndex == null && pauseButtonPlaylistIndex == null) {
				_helpers2.default.setSongPlayPause(_config2.default.active_playlist, _config2.default.active_index);
				_core2.default.pause();
			}

			if (pauseButtonPlaylistIndex != null || pauseButtonPlaylistIndex != '' && _config2.default.active_playlist == pauseButtonPlaylistIndex) {
				/*
    	The song was playing so we sync visually for the song
    	to be paused and we pause the song.
    */
				_visual2.default.syncMainPlayPause('paused');

				/*
    	If there is an active playlist, then
    	we need to sync that playlist's play pause
    	button to the state of paused.
    */
				_visual2.default.syncPlaylistPlayPause(_config2.default.active_playlist, 'paused');

				/*
    	Sync the song play pause buttons
    */
				_visual2.default.syncSongPlayPause(_config2.default.active_playlist, _config2.default.active_index, 'paused');

				_core2.default.pause();
			}

			if ((pauseButtonPlaylistIndex == null || pauseButtonPlaylistIndex == '') && pauseButtonSongIndex == _config2.default.active_index) {
				/*
    	The song was playing so we sync visually for the song
    	to be paused and we pause the song.
    */
				_visual2.default.syncMainPlayPause('paused');

				/*
    	If there is an active playlist, then
    	we need to sync that playlist's play pause
    	button to the state of paused.
    */
				_visual2.default.syncPlaylistPlayPause(_config2.default.active_playlist, 'paused');

				/*
    	Sync the song play pause buttons
    */
				_visual2.default.syncSongPlayPause(_config2.default.active_playlist, _config2.default.active_index, 'paused');

				_core2.default.pause();
			}
		}
	},

	/**
  * Handles an event on a play/pause button
  *
  * HANDLER FOR: 'amplitude-play-pause'
  *
  * @access public
  */
	playPause: function playPause() {
		if (!_config2.default.is_touch_moving) {
			/*
   	Checks to see if the element has an attribute for amplitude-main-play-pause
   	and syncs accordingly
   */
			if (this.getAttribute('amplitude-main-play-pause') != null) {
				_helpers2.default.setMainPlayPause();

				/*
    	Syncs playlist main play pause buttons
    */
			} else if (this.getAttribute('amplitude-playlist-main-play-pause') != null) {
				var playlist = this.getAttribute('amplitude-playlist');

				_helpers2.default.setPlaylistPlayPause(playlist);

				/*
    	Syncs amplitude individual song buttons
    */
			} else {
				var _playlist = this.getAttribute('amplitude-playlist');
				var songIndex = this.getAttribute('amplitude-song-index');

				_helpers2.default.setSongPlayPause(_playlist, songIndex);
			}
		}
	},

	/**
  * Handles an event on a stop element.
  *
  * HANDLER FOR: 'amplitude-stop'
  *
  * @access public
  * @TODO: AMP-FX Before stopping, make sure that AmplitudeFX visualization is stopped as well.
  */
	stop: function stop() {
		if (!_config2.default.is_touch_moving) {
			/*
   	Sets all of the play/pause buttons to pause
   */
			_visual2.default.setPlayPauseButtonsToPause();

			/*
   	Stops the active song.
   */
			_core2.default.stop();
		}
	},

	/**
  * Handles an event for a mute element
  *
  * HANDLER FOR: 'amplitude-mute'
  *
  * @access public
  */
	mute: function mute() {
		if (!_config2.default.is_touch_moving) {
			/*
   	If the current volume in the config is 0, we set the volume to the
   	pre_mute level.  This means that the audio is already muted and
   	needs to be restored to the pre_mute level.
   		Otherwise, we set pre_mute volume to the current volume
   	and set the config volume to 0, muting the audio.
   */
			if (_config2.default.volume == 0) {
				_config2.default.active_song.muted = false;
				_config2.default.volume = _config2.default.pre_mute_volume;
				_visual2.default.syncMute(false);
			} else {
				_config2.default.active_song.muted = true;
				_config2.default.pre_mute_volume = _config2.default.volume;
				_config2.default.volume = 0;
				_visual2.default.syncMute(true);
			}

			/*
   	Calls the core function to set the volume to the computed value
   	based on the user's intent.
   */
			_core2.default.setVolume(_config2.default.volume);

			/*
   	Syncs the volume sliders so the visuals align up with the functionality.
   	If the volume is at 0, then the sliders should represent that so the user
   	has the right starting point.
   */
			_visual2.default.syncVolumeSliders(_config2.default.volume);
		}
	},

	/**
  * Handles a click on a volume up element.
  *
  * HANDLER FOR: 'amplitude-volume-up'
  *
  * @access public
  */
	volumeUp: function volumeUp() {
		if (!_config2.default.is_touch_moving) {
			/*
   	The volume range is from 0 to 1 for an audio element. We make this
   	a base of 100 for ease of working with.
   		If the new value is less than 100, we use the new calculated
   	value which gets converted to the proper unit for the audio element.
   		If the new value is greater than 100, we set the volume to 1 which
   	is the max for the audio element.
   */
			if (_config2.default.volume + _config2.default.volume_increment <= 100) {
				_config2.default.volume = _config2.default.volume + _config2.default.volume_increment;
			} else {
				_config2.default.volume = 100;
			}

			/*
   	Calls the core function to set the volume to the computed value
   	based on the user's intent.
   */
			_core2.default.setVolume(_config2.default.volume);

			/*
   	Syncs the volume sliders so the visuals align up with the functionality.
   	If the volume is at 0, then the sliders should represent that so the user
   	has the right starting point.
   */
			_visual2.default.syncVolumeSliders(_config2.default.volume);
		}
	},

	/**
  * Handles a click on a volume down element.
  *
  * HANDLER FOR: 'amplitude-volume-down'
  *
  * @access public
  */
	volumeDown: function volumeDown() {
		if (!_config2.default.is_touch_moving) {
			/*
   	The volume range is from 0 to 1 for an audio element. We make this
   	a base of 100 for ease of working with.
   		If the new value is less than 100, we use the new calculated
   	value which gets converted to the proper unit for the audio element.
   		If the new value is greater than 100, we set the volume to 1 which
   	is the max for the audio element.
   */
			if (_config2.default.volume - _config2.default.volume_increment > 0) {
				_config2.default.volume = _config2.default.volume - _config2.default.volume_increment;
			} else {
				_config2.default.volume = 0;
			}

			/*
   	Calls the core function to set the volume to the computed value
   	based on the user's intent.
   */
			_core2.default.setVolume(_config2.default.volume);

			/*
   	Syncs the volume sliders so the visuals align up with the functionality.
   	If the volume is at 0, then the sliders should represent that so the user
   	has the right starting point.
   */
			_visual2.default.syncVolumeSliders(_config2.default.volume);
		}
	},

	/**
  * Handles a change on the song slider
  *
  * HANDLER FOR: 'amplitude-song-slider'
  *
  * @access public
  */
	songSlider: function songSlider() {
		/*
  	Gets the percentage of the song we will be setting the location for.
  */
		var locationPercentage = this.value;

		/*
  	Checks to see if the element has an attribute for amplitude-main-play-pause
  	and syncs accordingly
  */
		if (this.getAttribute('amplitude-main-song-slider') != null) {
			/*
   	If the active song is not live, set the current time
   */
			if (!_config2.default.active_metadata.live) {
				var currentTime = _config2.default.active_song.duration * (locationPercentage / 100);

				if (isFinite(currentTime)) {
					_config2.default.active_song.currentTime = currentTime;
				}
			}

			_visual2.default.syncMainSliderLocation(locationPercentage);

			if (_config2.default.active_playlist != '' && _config2.default.active_playlist != null) {
				_visual2.default.syncPlaylistSliderLocation(_config2.default.active_playlist, locationPercentage);
			}
		}

		/*
  	Syncs playlist main play pause buttons
  */
		if (this.getAttribute('amplitude-playlist-song-slider') != null) {
			var playlist = this.getAttribute('amplitude-playlist');

			/*
   	We don't want to song slide a playlist that's not the
   	active placylist.
   */
			if (_config2.default.active_playlist == playlist) {
				/*
    	If the active song is not live, set the current time
    */
				if (!_config2.default.active_metadata.live) {
					_config2.default.active_song.currentTime = _config2.default.active_song.duration * (locationPercentage / 100);
				}
				_visual2.default.syncMainSliderLocation(locationPercentage);
				_visual2.default.syncPlaylistSliderLocation(playlist, locationPercentage);
			}
		}

		/*
  	Syncs amplitude individual song buttons
  */
		if (this.getAttribute('amplitude-playlist-song-slider') == null && this.getAttribute('amplitude-main-song-slider') == null) {

			var _playlist2 = this.getAttribute('amplitude-playlist');
			var songIndex = this.getAttribute('amplitude-song-index');

			if (_config2.default.active_index == songIndex) {
				/*
    	If the active song is not live, set the current time
    */
				if (!_config2.default.active_metadata.live) {
					_config2.default.active_song.currentTime = _config2.default.active_song.duration * (locationPercentage / 100);
				}

				_visual2.default.syncMainSliderLocation();

				if (_config2.default.active_playlist != '' && _config2.default.active_playlist != null && _config2.default.active_playlist == _playlist2) {
					_visual2.default.syncPlaylistSliderLocation(_playlist2, location);
				}

				_visual2.default.syncSongSliderLocation(_playlist2, songIndex, location);
			}
		}
	},

	/**
  * Handles a change on the volume slider
  *
  * HANDLER FOR: 'amplitude-volume-slider'
  *
  * @access public
  */
	volumeSlider: function volumeSlider() {
		/*
  	Calls the core function to set the volume to the computed value
  	based on the user's intent.
  */
		_core2.default.setVolume(this.value);

		/*
  	Sync the volume slider locations
  */
		_visual2.default.syncVolumeSliderLocation(this.value);
	},

	/**
  * Handles an event on the next button
  *
  * HANDLER FOR: 'amplitude-next'
  *
  * @access public
  */
	next: function next() {
		if (!_config2.default.is_touch_moving) {
			/*
   	Checks to see if the button is a playlist next button or
   	if it's a global playlist button.
   */
			if (this.getAttribute('amplitude-playlist') == '' || this.getAttribute('amplitude-playlist') == null) {

				/*
    	Check to see if the current state of the player
    	is in playlist mode or not playlist mode.
    */
				if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null) {
					_helpers2.default.setNext();
				} else {
					_helpers2.default.setNextPlaylist(_config2.default.active_playlist);
				}
			} else {
				/*
    	Gets the playlist of the next button.
    */
				var playlist = this.getAttribute('amplitude-playlist');

				/*
    	Sets the next playlist
    */
				_helpers2.default.setNextPlaylist(playlist);
			}
		}
	},

	/**
  * Handles an event on the previous button
  *
  * HANDLER FOR: 'amplitude-prev'
  *
  * @access public
  */
	prev: function prev() {
		if (!_config2.default.is_touch_moving) {
			/*
   	Checks to see if the previous button is a playlist previous
   	button or if it's a global playlist button.
   */
			if (this.getAttribute('amplitude-playlist') == '' || this.getAttribute('amplitude-playlist') == null) {

				/*
    	Check to see if the current playlist has been set
    	or null and set the previous song.
    */
				if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null) {
					_helpers2.default.setPrev();
				} else {
					_helpers2.default.setPrevPlaylist(_config2.default.active_playlist);
				}
			} else {
				/*
    	Gets the playlist of the previous button.
    */
				var playlist = this.getAttribute('amplitude-playlist');

				/*
    	Sets the previous playlist
    */
				_helpers2.default.setPrevPlaylist(playlist);
			}
		}
	},

	/**
  * Handles an event on the shuffle button
  *
  * HANDLER FOR: 'amplitude-shuffle'
  *
  * @access public
  */
	shuffle: function shuffle() {
		if (!_config2.default.is_touch_moving) {
			/*
   	Check to see if the shuffle button belongs to a playlist
   */
			if (this.getAttribute('amplitude-playlist') == '' || this.getAttribute('amplitude-playlist') == null) {
				/*
    	Sets the shuffle button to null
    */
				_helpers2.default.setShuffle(null);
			} else {
				/*
    	Gets the playlist attribute of the shuffle button and
    	set shuffle to on for the playlist.
    */
				var playlist = this.getAttribute('amplitude-playlist');
				_helpers2.default.setShuffle(playlist);
			}
		}
	},

	/**
  * Handles an event on the repeat button
  *
  * HANDLER FOR: 'amplitude-repeat'
  *
  * @access private
  */
	repeat: function repeat() {
		if (!_config2.default.is_touch_moving) {
			/*
   	Check to see if the repeat button belongs to a playlist
   */
			if (this.getAttribute('amplitude-playlist') == '' || this.getAttribute('amplitude-playlist') == null) {
				/*
    	Sets repeat to the opposite of what it was set to
    */
				_helpers2.default.setRepeat(!_config2.default.repeat, null);
			} else {
				/*
    	Gets the playlist attribute of the repeat button and
    	set repeat to on for the playlist.
    */
				var playlist = this.getAttribute('amplitude-playlist');
				_helpers2.default.setRepeat(!_config2.default.repeat_statuses[playlist], playlist);
			}
		}
	},

	/**
  * Handles an event on the repeat song button
  *
  * HANDLER FOR: 'amplitude-repeat-song'
  *
  * @access private
  */
	repeatSong: function repeatSong() {
		if (!_config2.default.is_touch_moving) {
			/*
   	Sets repeat song to the opposite of what it was set to
   */
			_helpers2.default.setRepeatSong(!_config2.default.repeat_song);

			/*
   	Visually sync repeat song
   */
			_visual2.default.syncRepeatSong();
		}
	},

	/**
  * Handles an event on the playback speed button
  *
  * HANDLER FOR: 'amplitude-playback-speed'
  *
  * @access private
  */
	playbackSpeed: function playbackSpeed() {
		if (!_config2.default.is_touch_moving) {
			/*
   	We increment the speed by .5 everytime we click
   	the button to change the playback speed. Once we are
   	actively playing back at 2, we start back at 1 which
   	is normal speed.
   */
			switch (_config2.default.playback_speed) {
				case 1:
					_helpers2.default.setPlaybackSpeed(1.5);
					break;
				case 1.5:
					_helpers2.default.setPlaybackSpeed(2);
					break;
				case 2:
					_helpers2.default.setPlaybackSpeed(1);
					break;
			}

			/*
   	Visually sync the playback speed.
   */
			_visual2.default.syncPlaybackSpeed();
		}
	},

	/**
  * Handles an event on a skip to button.
  *
  * HANDLER FOR: 'amplitude-skip-to'
  *
  * @access private
  */
	skipTo: function skipTo() {
		if (!_config2.default.is_touch_moving) {
			/*
   	Determines if the skip to button is in the scope of a playlist.
   */
			if (this.hasAttribute('amplitude-playlist')) {
				var playlist = this.getAttribute('amplitude-playlist');

				if (_helpers4.default.checkNewPlaylist(playlist)) {
					_helpers4.default.setActivePlaylist(playlist);
				}
				/*
    	Gets the location, playlist and song index that is being skipped
    	to.
    */
				var seconds = parseInt(this.getAttribute('amplitude-location'));
				var songIndex = parseInt(this.getAttribute('amplitude-song-index'));

				/*
    	Changes the song to where it's being skipped and then
    	play the song.
    */
				_helpers4.default.changeSong(songIndex);
				_core2.default.play();

				_visual2.default.syncMainPlayPause('playing');
				_visual2.default.syncPlaylistPlayPause(playlist, 'playing');
				_visual2.default.syncSongPlayPause(playlist, songIndex, 'playing');

				/*
    	Skip to the location in the song.
    */
				_core2.default.skipToLocation(seconds);
			} else {
				/*
    	Gets the location and song index that is being skipped
    	to.
    */
				var _seconds = parseInt(this.getAttribute('amplitude-location'));
				var _songIndex = parseInt(this.getAttribute('amplitude-song-index'));

				/*
    	Changes the song to where it's being skipped and then
    	play the song.
    */
				_helpers4.default.changeSong(_songIndex);
				_core2.default.play();

				_visual2.default.syncMainPlayPause('playing');
				_visual2.default.syncSongPlayPause(null, _songIndex, 'playing');

				/*
    	Skip to the location in the song.
    */
				_core2.default.skipToLocation(_seconds);
			}
		}
	}
};

/**
 * Imports the core helpers for Amplitude which help run some of AmplitudeJS functions
 * @module core/AmplitudeHelpers
 */


/**
 * Imports the visual sync module to keep the display in sync with AmplitudeJS
 * @module visual/AmplitudeVisualSync
 */
/**
 * Imports the config module
 * @module config
 */

module.exports = exports['default'];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _init = __webpack_require__(6);

var _init2 = _interopRequireDefault(_init);

var _core = __webpack_require__(3);

var _core2 = _interopRequireDefault(_core);

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _events = __webpack_require__(4);

var _events2 = _interopRequireDefault(_events);

var _helpers3 = __webpack_require__(5);

var _helpers4 = _interopRequireDefault(_helpers3);

var _visual = __webpack_require__(2);

var _visual2 = _interopRequireDefault(_visual);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Amplitude should just be an interface to the public functions.
 * Everything else should be handled by other objects
 *
 * @module Amplitude
 */

/**
 * AmplitudeJS Visual Sync Module
 *
 * @module visual/AmplitudeVisualSync
 */


/**
 * AmplitudeJS Events Module
 *
 * @module events/AmplitudeEvents
 */


/**
 * AmplitudeJS Core Module
 *
 * @module core/AmplitudeCore
 */
var Amplitude = function () {
	/**
  * The main init function.  The user will call this through
  * Amplitude.init({}) and pass in their settings.
  *
  * Public Accessor: Amplitude.init( user_config_json );
  *
  * @access public
  * @param {object} userConfig 	- A JSON object of user defined values that helps configure and initialize AmplitudeJS.
  */
	function init(userConfig) {
		_init2.default.initialize(userConfig);
	}

	/**
  * Binds new elements that were added to the page.
  *
  * Public Accessor: Amplitude.bindNewElements()
  *
  * @access public
  */
	function bindNewElements() {
		_init2.default.rebindDisplay();
	}

	/**
  * Returns the active playlist.
  *
  * Public Accessor: Amplitude.getActivePlaylist()
  *
  * @access public
  */
	function getActivePlaylist() {
		return _config2.default.active_playlist;
	}

	/**
  * Returns the current playback speed.
  *
  * Public Accessor: Amplitude.getPlaybackSpeed()
  *
  * @access public
  */
	function getPlaybackSpeed() {
		return _config2.default.playback_speed;
	}

	/**
  * Gets the repeat state of the player.
  *
  * Public Accessor: Amplitude.getRepeat()
  *
  * @access public
  */
	function getRepeat() {
		return _config2.default.repeat;
	}

	/**
  * Returns the shuffle state of the player.
  *
  * Public Accessor: Amplitude.getShuffle()
  *
  * @access public
  */
	function getShuffle() {
		return _config2.default.shuffle_on;
	}

	/**
  * Returns the shuffle state of the playlist.
  *
  * Public Accessor: Amplitude.getShufflePlaylist( playlist )
  *
  * @access public
  * @param {string} playlist 	- The key representing the playlist ID to see if it's shuffled or not.
  */
	function getShufflePlaylist(playlist) {
		return _config2.default.shuffled_statuses[playlist];
	}

	/**
  * Sets the shuffle state for the player.
  *
  * Public Accessor: Amplitude.setShuffle()
  *
  * @access public
  */
	function setShuffle() {
		_helpers4.default.setShuffle(null);
	}

	/**
  * Sets the shuffle state for the playlist
  *
  * Public Accessor: Amplitude.setShufflePlaylist( playlistKey )
  *
  * @access public
 * @param {string} playlistKey 	- The key representing the playlist ID to to shuffle the playlist.
  */
	function setShufflePlaylist(playlistKey) {
		_helpers4.default.setShuffle(playlistKey);
	}

	/**
  * Sets the repeat state for the player.
 *
 * Public Accessor: Amplitude.setRepeat()
 *
 * @access public
  */
	function setRepeat() {
		if (!_config2.default.is_touch_moving) {
			/*
   	Sets repeat to the opposite of what it was set to
   */
			_helpers4.default.setRepeat(!_config2.default.repeat);

			/*
   	Visually sync repeat
   */
			_visual2.default.syncRepeat();
		}
	}

	/**
  * Sets the repeat state for the song.
  *
  * Public Accessor: Amplitude.setRepeatSong()
  *
  * @access public
  */
	function setRepeatSong() {
		if (!_config2.default.is_touch_moving) {
			/*
    Sets repeat to the opposite of what it was set to
   */
			_helpers4.default.setRepeatSong(!_config2.default.repeat_song);

			/*
    Visually sync repeat song
   */
			_visual2.default.syncRepeatSong();
		}
	}

	/**
  * Gets the default album art for the player
  *
  * Public Accessor: Amplitude.getDefaultAlbumArt()
  *
  * @access public
  */
	function getDefaultAlbumArt() {
		return _config2.default.default_album_art;
	}

	/**
  * Sets the default album art for the player
  *
  * Public Accessor: Amplitude.setDefaultAlbumArt( url )
  *
  * @access public
  * @param {string} url 	- A string representing the URL of the new default album art.
  */
	function setDefaultAlbumArt(url) {
		_config2.default.default_album_art = url;
	}

	/**
  * Allows the user to get the percentage of the song played.
  *
  * Public Accessor: Amplitude.getSongPlayedPercentage();
  *
  * @access public
  */
	function getSongPlayedPercentage() {
		/*
  	Returns the percentage of the song played.
  */
		return _config2.default.active_song.currentTime / _config2.default.active_song.duration * 100;
	}

	/**
  * Allows the user to set how far into the song they want to be. This is
  * helpful for implementing custom range sliders. Only works on the current song.
  *
  * Public Accessor: Amplitude.setSongPlayedPercentage( float );
  *
  * @access public
  * @param {number} percentage 	- The percentage of the song played
  */
	function setSongPlayedPercentage(percentage) {
		/*
  	Ensures the percentage is a number and is between 0 and 100.
  */
		if (typeof percentage == 'number' && percentage > 0 && percentage < 100) {
			/*
   	Sets the current time of the song to the percentage.
   */
			_config2.default.active_song.currentTime = _config2.default.active_song.duration * (percentage / 100);
		}
	}

	/**
  * Allows the user to turn on debugging.
  *
  * Public Accessor: Amplitude.setDebug( bool );
  *
  * @access public
  * @param {boolean} state 		- Turns debugging on and off.
  */
	function setDebug(state) {
		/*
  	Sets the global config debug on or off.
  */
		_config2.default.debug = state;
	}

	/**
  * Returns the active song meta data for the user to do what is
  * needed.
  *
  * Public Accessor: Amplitude.getActiveSongMetadata();
  *
  * @access public
  * @returns {object} JSON Object with the active song information
  */
	function getActiveSongMetadata() {
		return _config2.default.active_metadata;
	}

	/**
  * Returns a song in the songs array at that index
  *
  * Public Accessor: Amplitude.getSongByIndex( song_index )
  *
  * @access public
  * @param {number} index 	- The integer for the index of the song in the songs array.
  * @returns {object} JSON representation for the song at a specific index.
  */
	function getSongByIndex(index) {
		return _config2.default.songs[index];
	}

	/**
  * Returns a song at a playlist index
  *
  * Public Accessor: Amplitude.getSongAtPlaylistIndex( playlist, index
  *
  * @access public
  * @param {number} index 			- The integer for the index of the song in the playlist.
  * @param {string} playlist		- The key of the playlist we are getting the song at the index for
  * @returns {object} JSON representation for the song at a specific index.
  */
	function getSongAtPlaylistIndex(playlist, index) {
		var songIndex = _config2.default.playlists[playlist][index];

		return _config2.default.songs[songIndex];
	}

	/**
  * Adds a song to the end of the config array.  This will allow Amplitude
  * to play the song in a playlist type setting.
  *
  * Public Accessor: Amplitude.addSong( song_json )
  *
  * @access public
  * @param {object} song 	- JSON representation of a song.
  * @returns {number} New index of the song.
  */
	function addSong(song) {
		/*
  	Ensures we have a songs array to push to.
  */
		if (_config2.default.songs == undefined) {
			_config2.default.songs = [];
		}

		_config2.default.songs.push(song);
		return _config2.default.songs.length - 1;
	}

	/**
  * Adds a song to a playlist. This will allow Amplitude to play the song in the
  * playlist
  *
  * Public Accessor: Amplitude.addSongToPlaylist( song_json, playlist_key )
  *
  * @access public
  * @param {object} song 			- JSON representation of a song.
  * @param {string} playlist		- Playlist we are adding the song to.
  * @returns {mixed} New index of song in playlist or null if no playlist exists
  */
	function addSongToPlaylist(song, playlist) {
		/*
  	Ensures we have a songs array to push to. This is step 1.
  */
		if (_config2.default.songs == undefined) {
			_config2.default.songs = [];
		}

		_config2.default.songs.push(song);

		var songIndex = _config2.default.songs.length - 1;

		/*
  	Ensures the playlist is valid to push the song on to.
  */
		if (_config2.default.playlists[playlist] != undefined) {
			_config2.default.playlists[playlist].push(songIndex);

			return _config2.default.playlists[playlist].length - 1;
		} else {
			return null;
		}
	}

	/**
  * Removes a song from the song array
  *
  * Public Accessor: Amplitude.removeSong( index )
  *
  * @access public
  * @param {integer} index 			- Index of the song being removed
  * @returns {boolean} True if removed false if not.
  */
	function removeSong(index) {
		if (_config2.default.songs[index] != undefined) {
			_config2.default.songs.splice(index, 1);
			return true;
		} else {
			return false;
		}
	}

	/**
  * Removes a song from the playlist
  *
  * Public Accessor: Amplitude.removeSongFromPlaylist( index, playlist )
  *
  * @access public
  * @param {integer} index 			- Index of the song being removed from the playlist.
  * @param {string} playlist			- Playlist we are removing the song from.
  * @returns {boolean} True if removed false if not.
  */
	function removeSongFromPlaylist(index, playlist) {
		if (_config2.default.playlists[playlist] != undefined) {
			_config2.default.playlists[playlist].splice(index, 1);
		} else {
			return false;
		}
	}

	/**
  * When you pass a song object it plays that song right awawy.  It sets
  * the active song in the config to the song you pass in and synchronizes
  * the visuals.
  *
  * Public Accessor: Amplitude.playNow( song )
  *
  * @access public
  * @param {object} song 	- JSON representation of a song.
  */
	function playNow(song) {
		_core2.default.playNow(song);
	}

	/**
  * Plays a song at the index passed in from the songs array.
  *
  * Public Accessor: Amplitude.playSongAtIndex( index )
  *
  * @access public
  * @param {number} index 	- The number representing the song in the songs array.
  */
	function playSongAtIndex(index) {
		_core2.default.playSongAtIndex(index);
	}

	/**
  * Plays a song at the index passed in for the playlist provided. The index passed
  * in should be the index of the song in the playlist and not the songs array.
  *
  * @access public
  * @param {number} index 		- The number representing the song in the playlist array.
  * @param {string} playlist - The key string representing the playlist we are playing the song from.
  *
  */
	function playPlaylistSongAtIndex(index, playlist) {
		_core2.default.playPlaylistSongAtIndex(index, playlist);
	}

	/**
  * @TODO: Implement Add Song To Playlist Functionality
  */
	function addSongToPlaylist(song, playlist) {}

	/**
  * Allows the user to play whatever the active song is directly
  * through Javascript. Normally ALL of Amplitude functions that access
  * the core features are called through event handlers.
  *
  * Public Accessor: Amplitude.play();
  *
  * @access public
  */
	function play() {
		_core2.default.play();
	}

	/**
  * Allows the user to pause whatever the active song is directly
  * through Javascript. Normally ALL of Amplitude functions that access
  * the core features are called through event handlers.
  *
  * Public Accessor: Amplitude.pause();
  *
  * @access public
  */
	function pause() {
		_core2.default.pause();
	}

	/**
  * Returns the audio object used to play the audio
  *
  * Public Accessor: Amplitude.getAudio();
  *
  * @access public
  */
	function getAudio() {
		return _config2.default.active_song;
	}

	/**
  * Plays the next song either in the playlist or globally.
  *
  * Public Accessor: Amplitude.next( playlist );
  *
  * @access public
  * @param {string} [playlist = null] 	- The playlist key
  */
	function next() {
		var playlist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

		/*
  	If the playlist is empty or null, then we check the active
  	playlist
  */
		if (playlist == '' || playlist == null) {
			/*
   	If the active playlist is null, then we set the next global
   	song or we set the next in the playlist.
   */
			if (_config2.default.active_playlist == null || _config2.default.active_playlist == '') {
				_helpers4.default.setNext();
			} else {
				_helpers4.default.setNextPlaylist(_config2.default.active_playlist);
			}
		} else {
			/*
   	Set the next in the playlist for the key provided.
   */
			_helpers4.default.setNextPlaylist(playlist);
		}
	}

	/**
  * Plays the prev song either in the playlist or globally.
  *
  * Public Accessor: Amplitude.prev( playlist );
  *
  * @access public
  * @param {string} [playlist = null] 	- The playlist key
  */
	function prev() {
		var playlist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

		/*
  	If the playlist is empty or null, then we check the active
  	playlist
  */
		if (playlist == '' || playlist == null) {
			/*
   	If the active playlist is null, then we set the prev global
   	song or we set the prev in the playlist.
   */
			if (_config2.default.active_playlist == null || _config2.default.active_playlist == '') {
				_helpers4.default.setPrev();
			} else {
				_helpers4.default.setPrevPlaylist(_config2.default.active_playlist);
			}
		} else {
			/*
   	Set the prev in the playlist for the key provided.
   */
			_helpers4.default.setPrevPlaylist(playlist);
		}
	}

	/**
  * Gets all of the songs in the songs array
  *
  * Public Accessor: Amplitude.getSongs( );
  *
  * @access public
  */
	function getSongs() {
		return _config2.default.songs;
	}

	/**
  * Gets all of the songs in a playlist
  *
  * Public Accessor: Amplitude.getSongsInPlaylist( playlist );
  *
  * @access public
  * @param {string} playlist 	- The playlist key
  */
	function getSongsInPlaylist(playlist) {
		var songsArray = [];

		for (var i = 0; i < _config2.default.playlists[playlist].length; i++) {
			songsArray.push(_config2.default.songs[i]);
		}

		return songsArray;
	}

	/**
  * Get current state of songs. If shuffled, this will return the shuffled
  * songs.
  *
  * Public Accessor: Amplitude.getSongsState();
  *
  * @access public
  */
	function getSongsState() {
		if (_config2.default.shuffle_on) {
			return _config2.default.shuffle_list;
		} else {
			return _config2.default.songs;
		}
	}

	/**
  * Get current state of songs in playlist. If shuffled, this will return the
  * shuffled songs.
  *
  * Public Accessor: Amplitude.getSongsStatePlaylist( playlist );
  *
  * @access public
  * @param {string} playlist 	- The playlist key
  * @todo Finish commenting
  */
	function getSongsStatePlaylist(playlist) {
		var songsArray = [];

		if (_config2.default.shuffled_status[playlist]) {

			for (var i = 0; i < _config2.default.shuffled_playlists[playlist].length; i++) {
				songsArray.push(_config2.default.songs[i]);
			}
		} else {

			for (var _i = 0; _i < _config2.default.playlists[playlist].length; _i++) {
				songsArray.push(_config2.default.songs[_i]);
			}
		}

		return songsArray;
	}

	/**
  * Gets the active index of the player
  *
  * Public Accessor: Amplitude.getActiveIndex()
  *
  * @access public
  */
	function getActiveIndex() {
		return parseInt(_config2.default.active_index);
	}

	/**
  * Gets the active index with respect to the state of the player whether it is
  * shuffled or not.
  *
  * Public Accessor: Amplitude.getActiveIndexState()
  *
  * @access public
  */
	function getActiveIndexState() {
		if (_config2.default.shuffle_on) {
			return parseInt(_config2.default.shuffle_active_index);
		} else {
			return parseInt(_config2.default.active_index);
		}
	}

	/**
  * Get the version of AmplitudeJS
  *
  * Public Accessor: Amplitude.getVersion()
  *
  * @access public
  */
	function getVersion() {
		return _config2.default.version;
	}

	/**
  * Get the buffered amount for the current song
  *
  * Public Accessor: Amplitude.getBuffered()
  *
  * @access public
  */
	function getBuffered() {
		return _config2.default.buffered;
	}

	/**
  * Skip to a certain location in a selected song.
  *
  * Public Accessor: Amplitude.getBuffered()
  *
  * @access public
  * @param {number} seconds 						- The amount of seconds we should skip to in the song.
  * @param {number} songIndex 					- The index of the song in the songs array.
  * @param {string} [playlist = null]	- The playlist the song we are skipping to belogns to.
  */
	function skipTo(seconds, songIndex) {
		var playlist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		if (playlist != null) {
			if (_helpers2.default.checkNewPlaylist(playlist)) {
				_helpers2.default.setActivePlaylist(playlist);
			}
		}

		seconds = parseInt(seconds);

		/*
  	Changes the song to where it's being skipped and then
  	play the song.
  */
		_helpers2.default.changeSong(songIndex);
		_core2.default.play();

		_visual2.default.syncMainPlayPause('playing');

		if (playlist != null) {
			_visual2.default.syncPlaylistPlayPause(playlist, 'playing');
		}

		_visual2.default.syncSongPlayPause(playlist, songIndex, 'playing');

		/*
  	Skip to the location in the song.
  */
		_core2.default.skipToLocation(seconds);
	}

	/*
 	Returns all of the publically accesible methods.
 */
	return {
		init: init,
		bindNewElements: bindNewElements,
		getActivePlaylist: getActivePlaylist,
		getPlaybackSpeed: getPlaybackSpeed,
		getRepeat: getRepeat,
		getShuffle: getShuffle,
		getShufflePlaylist: getShufflePlaylist,
		setShuffle: setShuffle,
		setShufflePlaylist: setShufflePlaylist,
		setRepeat: setRepeat,
		setRepeatSong: setRepeatSong,
		getDefaultAlbumArt: getDefaultAlbumArt,
		setDefaultAlbumArt: setDefaultAlbumArt,
		getSongPlayedPercentage: getSongPlayedPercentage,
		setSongPlayedPercentage: setSongPlayedPercentage,
		setDebug: setDebug,
		getActiveSongMetadata: getActiveSongMetadata,
		getSongByIndex: getSongByIndex,
		getSongAtPlaylistIndex: getSongAtPlaylistIndex,
		addSong: addSong,
		addSongToPlaylist: addSongToPlaylist,
		removeSong: removeSong,
		removeSongFromPlaylist: removeSongFromPlaylist,
		playNow: playNow,
		playSongAtIndex: playSongAtIndex,
		playPlaylistSongAtIndex: playPlaylistSongAtIndex,
		play: play,
		pause: pause,
		audio: getAudio,
		next: next,
		prev: prev,
		getSongs: getSongs,
		getSongsInPlaylist: getSongsInPlaylist,
		getSongsState: getSongsState,
		getSongsStatePlaylist: getSongsStatePlaylist,
		getActiveIndex: getActiveIndex,
		getActiveIndexState: getActiveIndexState,
		getVersion: getVersion,
		getBuffered: getBuffered,
		skipTo: skipTo
	};
}();

/**
 * Imports the config module
 * @module config
 */


/**
 * AmplitudeJS Events Helpers Module
 *
 * @module events/AmplitudeEventsHelpers
 */


/**
 * AmplitudeJS Core Helpers Module
 *
 * @module core/AmplitudeCoreHelpers
 */
/**
 * @name 		Amplitude.js
 * @version 3.2.0
 * @author 	Dan Pastori (521 Dimensions) <dan@521dimensions.com>
*/

/**
 * AmplitudeJS Initializer Module
 *
 * @module init/AmplitudeInitializer
 */
exports.default = Amplitude;
module.exports = exports['default'];

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _helpers = __webpack_require__(1);

var _helpers2 = _interopRequireDefault(_helpers);

var _init = __webpack_require__(6);

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * These helpers wrap around the basic methods of the Soundcloud API
 * and get the information we need from SoundCloud to make the songs
 * streamable through Amplitude
 *
 * @module soundcloud/AmplitudeSoundcloud
 */


/**
 * Imports the helper functions for the core module
 * @module core/AmplitudeHelers
 */
var AmplitudeSoundcloud = function () {

	/**
  * Defines the temporary user config used while we configure soundcloud
  * @type {object}
  */
	var tempUserConfig = {};

	/**
  * Loads the soundcloud SDK for use with Amplitude so the user doesn't have
  * to load it themselves.
  * With help from: http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file
  *
  * @access public
  * @param {object} userConfig 	- The config defined by the user for AmplitudeJS
  */
	function loadSoundCloud(userConfig) {
		/*
  	Sets the temporary config to the config passed by the user so we can make changes
  	and not break the actual config.
  */
		tempUserConfig = userConfig;

		/*
  	Gets the head tag for the document and create a script element.
  */
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');

		script.type = 'text/javascript';

		/*
  	URL to the remote soundcloud SDK
  */
		script.src = 'https://connect.soundcloud.com/sdk.js';
		script.onreadystatechange = initSoundcloud;
		script.onload = initSoundcloud;

		/*
  	Add the script to the head of the document.
  */
		head.appendChild(script);
	}

	/**
  * Initializes soundcloud with the key provided.
  *
  * @access private
  */
	function initSoundcloud() {
		/*
  	Calls the SoundCloud initialize function
  	from their API and sends it the client_id
  	that the user passed in.
  */
		SC.initialize({
			client_id: _config2.default.soundcloud_client
		});

		/*
  	Gets the streamable URLs to run through Amplitue. This is
  	VERY important since Amplitude can't stream the copy and pasted
  	link from the SoundCloud page, but can resolve the streaming
  	URLs from the link.
  */
		getStreamableURLs();
	}

	/**
  * Gets the streamable URL from the URL provided for
  * all of the soundcloud links.  This will loop through
  * and set all of the information for the soundcloud
  * urls.
  *
  * @access private
  */
	function getStreamableURLs() {
		/*
  	Define the regex to find the soundcloud URLs
  */
		var soundcloud_regex = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;

		for (var i = 0; i < _config2.default.songs.length; i++) {
			/*
   	If the URL matches soundcloud, we grab
   	that url and get the streamable link
   	if there is one.
   */
			if (_config2.default.songs[i].url.match(soundcloud_regex)) {
				_config2.default.soundcloud_song_count++;
				resolveStreamable(_config2.default.songs[i].url, i);
			}
		}
	}

	/**
  * Due to Soundcloud SDK being asynchronous, we need to scope the
  * index of the song in another function. The privateGetSoundcloudStreamableURLs
  * function does the actual iteration and scoping.
  *
  * @access private
  * @param {string} url 		- URL of the soundcloud song
  * @param {number} index 	- The index of the soundcloud song in the songs array.
  */
	function resolveStreamable(url, index) {
		SC.get('/resolve/?url=' + url, function (sound) {
			/*
   	If streamable we get the url and bind the client ID to the end
   	so Amplitude can just stream the song normally. We then overwrite
   	the url the user provided with the streamable URL.
   */
			if (sound.streamable) {
				_config2.default.songs[index].url = sound.stream_url + '?client_id=' + _config2.default.soundcloud_client;

				/*
    	If the user want's to use soundcloud art, we overwrite the
    	cover_art_url with the soundcloud artwork url.
    */
				if (_config2.default.soundcloud_use_art) {
					_config2.default.songs[index].cover_art_url = sound.artwork_url;
				}

				/*
    	Grab the extra metadata from soundcloud and bind it to the
    	song.  The user can get this through the public function:
    	getActiveSongMetadata
    */
				_config2.default.songs[index].soundcloud_data = sound;
			} else {
				/*
    	If not streamable, then we print a message to the user stating
    	that the song with name X and artist X is not streamable. This
    	gets printed ONLY if they have debug turned on.
    */
				_helpers2.default.writeDebugMessage(_config2.default.songs[index].name + ' by ' + _config2.default.songs[index].artist + ' is not streamable by the Soundcloud API');
			}
			/*
   	Increments the song ready counter.
   */
			_config2.default.soundcloud_songs_ready++;

			/*
   	When all songs are accounted for, then amplitude is ready
   	to rock and we set the rest of the config.
   */
			if (_config2.default.soundcloud_songs_ready == _config2.default.soundcloud_song_count) {
				_init2.default.setConfig(tempUserConfig);
			}
		});
	}

	/*
 	Returns the publically accessible methods
 */
	return {
		loadSoundCloud: loadSoundCloud
	};
}();

/**
 * Imports the initializer
 * @module init/AmplitudeInitializer
 */
/**
 * Imports the config module
 * @module config
 */
exports.default = AmplitudeSoundcloud;
module.exports = exports['default'];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * These methods help sync visual displays. They essentially make the visual sync
 * methods smaller and more maintainable.
 *
 * @module visual/AmplitudeVisualSyncHelpers
 */
var AmplitudeVisualSyncHelpers = function () {
	/**
  * Updates any elements that display the current hour for the song.
  *
  * @access public
  * @param {number} hours 	- An integer conaining how many hours into the song.
  */
	function syncCurrentHours(hours) {
		/*
  	Gets all of the song hour selectors.
  */
		var hourSelectors = [];

		if (_config2.default.active_playlist != null && _config2.default.active_playlist != '') {
			hourSelectors = ['.amplitude-current-hours[amplitude-main-current-hours="true"]', '.amplitude-current-hours[amplitude-playlist-current-hours="true"][amplitude-playlist="' + _config2.default.active_playlist + '"]', '.amplitude-current-hours[amplitude-song-index="' + _config2.default.active_index + '"]'];
		} else {
			hourSelectors = ['.amplitude-current-hours[amplitude-main-current-hours="true"]', '.amplitude-current-hours[amplitude-song-index="' + _config2.default.active_index + '"]'];
		}

		/*
  	Ensures that there are some hour selectors.
  */
		if (document.querySelectorAll(hourSelectors.join()).length > 0) {
			/*
   	Get all of the hour selectors
   */
			var currentHourSelectors = document.querySelectorAll(hourSelectors.join());

			/*
   	Set the current hour selector's inner html to hours passed in.
   */
			for (var i = 0; i < currentHourSelectors.length; i++) {
				/*
    	If the selector is a main selector, we set the hours.
    */
				if (currentHourSelectors[i].getAttribute('amplitude-main-current-hours') == 'true') {
					currentHourSelectors[i].innerHTML = hours;
				} else {
					/*
     	If the active playlist is not null or empty
     	and the attribute of the playlist is equal to the
     	active playlist, then we set the inner html.
     */
					if (_config2.default.active_playlist != '' && _config2.default.active_playlist != null && currentHourSelectors[i].getAttribute('amplitude-playlist') == _config2.default.active_playlist) {
						currentHourSelectors[i].innerHTML = hours;
						/*
      	If the active playlist is not set and the selector
      	does not have a playlist then we set the hours. This
      	means that the current selector is an individual song
      	selector.
      */
					} else if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null && !currentHourSelectors[i].hasAttribute('amplitude-playlist')) {
						currentHourSelectors[i].innerHTML = hours;
						/*
      	If nothing else matches, set the selector's inner HTML to '00'
      */
					} else {
						currentHourSelectors[i].innerHTML = '0';
					}
				}
			}
		}
	}

	/*--------------------------------------------------------------------------
 	Resets the current hours displays to 0
 --------------------------------------------------------------------------*/
	function resetCurrentHours() {
		/*
  	Gets the hour display elements
  */
		var hourSelectors = document.querySelectorAll('.amplitude-current-hours');

		/*
  	Iterates over all of the hour selectors and sets the inner HTML
  	to 00.
  */
		for (var i = 0; i < hourSelectors.length; i++) {
			hourSelectors[i].innerHTML = '0';
		}
	}

	/**
  * Updates any elements that display the current minutes for the song.
  *
  * @access public
  * @param {number} minutes 	- An integer conaining how many minutes into the song.
  */
	function syncCurrentMinutes(minutes) {
		/*
  	Gets all of the song minute selectors.
  */
		var minuteSelectors = [];

		if (_config2.default.active_playlist != null && _config2.default.active_playlist != '') {
			minuteSelectors = ['.amplitude-current-minutes[amplitude-main-current-minutes="true"]', '.amplitude-current-minutes[amplitude-playlist-current-minutes="true"][amplitude-playlist="' + _config2.default.active_playlist + '"]', '.amplitude-current-minutes[amplitude-song-index="' + _config2.default.active_index + '"]'];
		} else {
			minuteSelectors = ['.amplitude-current-minutes[amplitude-main-current-minutes="true"]', '.amplitude-current-minutes[amplitude-song-index="' + _config2.default.active_index + '"]'];
		}

		/*
  	Grabs the current minute selectors
  */
		var currentMinuteSelectors = document.querySelectorAll(minuteSelectors.join());

		/*
  	Set the current minute selector's inner html to minutes passed in.
  */
		for (var i = 0, l = currentMinuteSelectors.length; i < l; i++) {
			/*
   	If the selector is a main selector, we set the seconds.
   */
			if (currentMinuteSelectors[i].getAttribute('amplitude-main-current-minutes') == 'true') {
				currentMinuteSelectors[i].innerHTML = minutes;
			} else {
				/*
    	If the active playlist is not null or empty
    	and the attribute of the playlist is equal to the
    	active playlist, then we set the inner html.
    */
				if (_config2.default.active_playlist != '' && _config2.default.active_playlist != null && currentMinuteSelectors[i].getAttribute('amplitude-playlist') == _config2.default.active_playlist) {
					currentMinuteSelectors[i].innerHTML = minutes;
					/*
     	If the active playlist is not set and the selector
     	does not have a playlist then we set the minutes. This
     	means that the current selector is an individual song
     	selector.
     */
				} else if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null && !currentMinuteSelectors[i].hasAttribute('amplitude-playlist')) {
					currentMinuteSelectors[i].innerHTML = minutes;
					/*
     	If nothing else matches, set the selector's inner HTML to '00'
     */
				} else {
					currentMinuteSelectors[i].innerHTML = '00';
				}
			}
		}
	}

	/**
  * Resets the current minutes displays to 00
  *
  * @access public
  */
	function resetCurrentMinutes() {
		/*
  	Gets the minutes display elements
  */
		var minuteSelectors = document.querySelectorAll('.amplitude-current-minutes');

		/*
  	Iterates over all of the minute selectors and sets the inner HTML
  	to 00.
  */
		for (var i = 0; i < minuteSelectors.length; i++) {
			minuteSelectors[i].innerHTML = '00';
		}
	}

	/**
  * Updates any elements that display the current seconds for the song.
  *
  * @access public
  * @param {number} seconds	- An integer conaining how many seconds into the song.
  */
	function syncCurrentSeconds(seconds) {
		/*
  	Gets all of the song second selectors. If the active playlist
  	is not null, then we get the playlist selectors.
  */
		var secondSelectors = [];

		if (_config2.default.active_playlist != null && _config2.default.active_playlist != '') {
			secondSelectors = ['.amplitude-current-seconds[amplitude-main-current-seconds="true"]', '.amplitude-current-seconds[amplitude-playlist-current-seconds="true"][amplitude-playlist="' + _config2.default.active_playlist + '"]', '.amplitude-current-seconds[amplitude-song-index="' + _config2.default.active_index + '"]'];
		} else {
			secondSelectors = ['.amplitude-current-seconds[amplitude-main-current-seconds="true"]', '.amplitude-current-seconds[amplitude-song-index="' + _config2.default.active_index + '"]'];
		}

		/*
  	Get all of the second selectors
  */
		var currentSecondSelectors = document.querySelectorAll(secondSelectors.join());

		/*
  	Iterate over all of the second selectors.
  */
		for (var i = 0, l = currentSecondSelectors.length; i < l; i++) {
			/*
   	If the selector is a main selector, we set the seconds.
   */
			if (currentSecondSelectors[i].getAttribute('amplitude-main-current-seconds') == 'true') {
				currentSecondSelectors[i].innerHTML = seconds;
			} else {
				/*
    	If the active playlist is not null or empty
    	and the attribute of the playlist is equal to the
    	active playlist, then we set the inner html.
    */
				if (_config2.default.active_playlist != '' && _config2.default.active_playlist != null && currentSecondSelectors[i].getAttribute('amplitude-playlist') == _config2.default.active_playlist) {
					currentSecondSelectors[i].innerHTML = seconds;
					/*
     	If the active playlist is not set and the selector
     	does not have a playlist then we set the seconds. This
     	means that the current selector is an individual song
     	selector.
     */
				} else if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null && !currentSecondSelectors[i].hasAttribute('amplitude-playlist')) {
					currentSecondSelectors[i].innerHTML = seconds;
					/*
     	If nothing else matches, set the selector's inner HTML to '00'
     */
				} else {
					currentSecondSelectors[i].innerHTML = '00';
				}
			}
		}
	}

	/**
  * Resets the current seconds displays to 00
  *
  * @access public
  */
	function resetCurrentSeconds() {
		/*
  	Gets the seconds display elements
  */
		var secondSelectors = document.querySelectorAll('.amplitude-current-seconds');

		/*
  	Iterates over all of the seconds selectors and sets the inner HTML
  	to 00.
  */
		for (var i = 0; i < secondSelectors.length; i++) {
			secondSelectors[i].innerHTML = '00';
		}
	}

	/**
  * Updates any elements that display the current time for the song. This
  * is a computed field that will be commonly used.
  *
  * @access public
  * @param {object} currentTime 	- A json object conaining the parts for the current time for the song.
  */
	function syncCurrentTime(currentTime) {
		/*
  	Gets all of the song time selectors.
  */
		var timeSelectors = ['.amplitude-current-time[amplitude-main-current-time="true"]', '.amplitude-current-time[amplitude-playlist-main-current-time="' + _config2.default.active_playlist + '"]', '.amplitude-current-time[amplitude-song-index="' + _config2.default.active_index + '"]'];

		/*
  	Get all of the time selectors.
  */
		var currentTimeSelectors = document.querySelectorAll(timeSelectors.join());

		/*
  	Set the time selector's inner html to the current time for the song. The current
  	time is computed by joining minutes and seconds.
  */
		var timeText = currentTime.minutes + ':' + currentTime.seconds;
		if (currentTime.hours > 0) {
			timeText = currentTime.hours + ':' + timeText;
		}
		for (var i = 0, l = currentTimeSelectors.length; i < l; i++) {
			currentTimeSelectors[i].innerHTML = timeText;
		}
	}

	/**
  * Resets the current time displays to 00:00
  *
  * @access public
  */
	function resetCurrentTime() {
		/*
  	Gets the time selector display elements
  */
		var timeSelectors = document.querySelectorAll('.amplitude-current-time');

		/*
  	Iterates over all of the time selectors and sets the inner HTML
  	to 00.
  */
		for (var i = 0; i < timeSelectors.length; i++) {
			timeSelectors[i].innerHTML = '00:00';
		}
	}

	/**
  * Syncs the song played progress bars. These are HTML5 progress elements.
  *
  * @access private
  * @param {number} songPlayedPercentage  	- The percentage of the song that has been played.
  */
	function syncSongPlayedProgressBar(songPlayedPercentage) {
		syncMainSongPlayedProgressBars(songPlayedPercentage);
		syncPlaylistSongPlayedProgressBars(songPlayedPercentage);
		syncIndividualSongPlayedProgressBars(songPlayedPercentage);
	}

	/**
  * Sync how much has been played with a progress bar. This is the main progress bar.
  *
  * @access private
  * @param {number} songPlayedPercentage 	- The percent of the song completed.
  */
	function syncMainSongPlayedProgressBars(songPlayedPercentage) {
		/*
  	Ensure that the song completion percentage is a number
  */
		if (!isNaN(songPlayedPercentage)) {
			/*
   	Get all of the song progress bars
   */
			var songPlayedProgressBars = document.querySelectorAll('.amplitude-song-played-progress[amplitude-main-song-played-progress="true"]');

			for (var i = 0; i < songPlayedProgressBars.length; i++) {
				var max = songPlayedProgressBars[i].max;

				songPlayedProgressBars[i].value = songPlayedPercentage / 100 * max;
			}
		}
	}

	/**
  * Sync how much has been played with a progress bar. This is the playlist progress bar.
  *
  * @access public
  * @param {number} songPlayedPercentage 	- The percent of the song completed.
  */
	function syncPlaylistSongPlayedProgressBars(songPlayedPercentage) {
		/*
  	Ensure that the song completion percentage is a number
  */
		if (!isNaN(songPlayedPercentage)) {
			/*
   	Get all of the song progress bars
   */
			var songPlayedProgressBars = document.querySelectorAll('.amplitude-song-played-progress[amplitude-playlist-song-played-progress="true"][amplitude-playlist="' + _config2.default.active_playlist + '"]');

			for (var i = 0; i < songPlayedProgressBars.length; i++) {
				var max = songPlayedProgressBars[i].max;

				songPlayedProgressBars[i].value = songPlayedPercentage / 100 * max;
			}
		}
	}

	/**
  * Sync how much has been played with a progress bar. This is for an individual song.
  *
  * @access private
  * @param {number} songPlayedPercentage 	- The percent of the song completed.
  */
	function syncIndividualSongPlayedProgressBars(songPlayedPercentage) {
		/*
  	Ensure that the song completion percentage is a number
  */
		if (!isNaN(songPlayedPercentage)) {
			/*
   	If the active playlist is not null, we get the individual song
   	played progress for the playlist.
   */
			if (_config2.default.active_playlist != '' && _config2.default.active_playlist != null) {
				/*
    	Get all of the song progress bars
    */
				var songPlayedProgressBars = document.querySelectorAll('.amplitude-song-played-progress[amplitude-playlist="' + _config2.default.active_playlist + '"][amplitude-song-index="' + _config2.default.active_index + '"]');

				for (var i = 0; i < songPlayedProgressBars.length; i++) {
					var max = songPlayedProgressBars[i].max;

					songPlayedProgressBars[i].value = songPlayedPercentage / 100 * max;
				}
			} else {
				/*
    	Get all of the song progress bars
    */
				var _songPlayedProgressBars = document.querySelectorAll('.amplitude-song-played-progress[amplitude-song-index="' + _config2.default.active_index + '"]');

				for (var _i = 0; _i < _songPlayedProgressBars.length; _i++) {
					var _max = _songPlayedProgressBars[_i].max;

					_songPlayedProgressBars[_i].value = songPlayedPercentage / 100 * _max;
				}
			}
		}
	}

	/**
  * Sets an element to be playing by removing the 'amplitude-paused' class
  * and adding the 'amplitude-playing' class
  *
  * @access public
  * @param {element} element 	- The element getting the playing class added.
  */
	function setElementPlay(element) {
		element.classList.add('amplitude-playing');
		element.classList.remove('amplitude-paused');
	}

	/**
  * Sets an element to be paused by adding the 'amplitude-paused' class
  * and removing the 'amplitude-playing' class
  *
  * @access public
  * @param {element} element 	- The element getting the paused class added.
  */
	function setElementPause(element) {
		element.classList.remove('amplitude-playing');
		element.classList.add('amplitude-paused');
	}

	/**
  * Updates any elements that display the duration hour for the song.
  *
  * @access public
  * @param {number} hours 		- An integer conaining how many hours are in the song
  */
	function syncDurationHours(hours) {
		/*
  	Gets all of the song hour selectors.
  */
		var hourSelectors = [];

		if (_config2.default.active_playlist != null && _config2.default.active_playlist != '') {
			hourSelectors = ['.amplitude-duration-hours[amplitude-main-duration-hours="true"]', '.amplitude-duration-hours[amplitude-playlist-duration-hours="true"][amplitude-playlist="' + _config2.default.active_playlist + '"]', '.amplitude-duration-hours[amplitude-song-index="' + _config2.default.active_index + '"]'];
		} else {
			hourSelectors = ['.amplitude-duration-hours[amplitude-main-duration-hours="true"]', '.amplitude-duration-hours[amplitude-song-index="' + _config2.default.active_index + '"]'];
		}

		/*
  	Ensures that there are some hour selectors.
  */
		if (document.querySelectorAll(hourSelectors.join()).length > 0) {
			/*
   	Get all of the hour selectors
   */
			var durationHourSelectors = document.querySelectorAll(hourSelectors.join());

			/*
   	Set the duration hour selector's inner html to hours passed in.
   */
			for (var i = 0; i < durationHourSelectors.length; i++) {
				/*
    	If the selector is a main selector, we set the hours.
    */
				if (durationHourSelectors[i].getAttribute('amplitude-main-duration-hours') == 'true') {
					durationHourSelectors[i].innerHTML = hours;
				} else {
					/*
     	If the active playlist is not null or empty
     	and the attribute of the playlist is equal to the
     	active playlist, then we set the inner html.
     */
					if (_config2.default.active_playlist != '' && _config2.default.active_playlist != null && durationHourSelectors[i].getAttribute('amplitude-playlist') == _config2.default.active_playlist) {
						durationHourSelectors[i].innerHTML = hours;
						/*
      	If the active playlist is not set and the selector
      	does not have a playlist then we set the hours. This
      	means that the duration selector is an individual song
      	selector.
      */
					} else if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null && !durationHourSelectors[i].hasAttribute('amplitude-playlist')) {
						durationHourSelectors[i].innerHTML = hours;
						/*
      	If nothing else matches, set the selector's inner HTML to '00'
      */
					} else {
						durationHourSelectors[i].innerHTML = '0';
					}
				}
			}
		}
	}

	/**
  * Updates any elements that display the duration minutes for the song.
  *
  * @access public
  * @param {number} minutes 	- An integer conaining how many minutes into the song.
  */
	function syncDurationMinutes(minutes) {
		/*
  	Gets all of the song minute selectors.
  */
		var minuteSelectors = [];

		if (_config2.default.active_playlist != null && _config2.default.active_playlist != '') {
			minuteSelectors = ['.amplitude-duration-minutes[amplitude-main-duration-minutes="true"]', '.amplitude-duration-minutes[amplitude-playlist-duration-minutes="true"][amplitude-playlist="' + _config2.default.active_playlist + '"]', '.amplitude-duration-minutes[amplitude-song-index="' + _config2.default.active_index + '"]'];
		} else {
			minuteSelectors = ['.amplitude-duration-minutes[amplitude-main-duration-minutes="true"]', '.amplitude-duration-minutes[amplitude-song-index="' + _config2.default.active_index + '"]'];
		}

		/*
  	Get all of the minute selectors
  */
		var durationMinuteSelectors = document.querySelectorAll(minuteSelectors.join());

		/*
  	Set the duration minute selector's inner html to minutes passed in.
  */
		for (var i = 0; i < durationMinuteSelectors.length; i++) {
			/*
   	If the selector is a main selector, we set the seconds.
   */
			if (durationMinuteSelectors[i].getAttribute('amplitude-main-duration-minutes') == 'true') {
				durationMinuteSelectors[i].innerHTML = minutes;
			} else {
				/*
    	If the active playlist is not null or empty
    	and the attribute of the playlist is equal to the
    	active playlist, then we set the inner html.
    */
				if (_config2.default.active_playlist != '' && _config2.default.active_playlist != null && durationMinuteSelectors[i].getAttribute('amplitude-playlist') == _config2.default.active_playlist) {
					durationMinuteSelectors[i].innerHTML = minutes;
					/*
     	If the active playlist is not set and the selector
     	does not have a playlist then we set the minutes. This
     	means that the duration selector is an individual song
     	selector.
     */
				} else if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null && !durationMinuteSelectors[i].hasAttribute('amplitude-playlist')) {
					durationMinuteSelectors[i].innerHTML = minutes;
					/*
     	If nothing else matches, set the selector's inner HTML to '00'
     */
				} else {
					durationMinuteSelectors[i].innerHTML = '00';
				}
			}
		}
	}

	/**
  * Updates any elements that display the duration seconds for the song.
  *
  * @access private
  * @param {number} seconds 	- An integer conaining how many seconds into the song.
  */
	function syncDurationSeconds(seconds) {
		/*
  	Gets all of the song second selectors. If the active playlist
  	is not null, then we get the playlist selectors.
  */
		var secondSelectors = [];

		if (_config2.default.active_playlist != null && _config2.default.active_playlist != '') {
			secondSelectors = ['.amplitude-duration-seconds[amplitude-main-duration-seconds="true"]', '.amplitude-duration-seconds[amplitude-playlist-duration-seconds="true"][amplitude-playlist="' + _config2.default.active_playlist + '"]', '.amplitude-duration-seconds[amplitude-song-index="' + _config2.default.active_index + '"]'];
		} else {
			secondSelectors = ['.amplitude-duration-seconds[amplitude-main-duration-seconds="true"]', '.amplitude-duration-seconds[amplitude-song-index="' + _config2.default.active_index + '"]'];
		}

		/*
  	Get all of the second selectors
  */
		var durationSecondSelectors = document.querySelectorAll(secondSelectors.join());

		/*
  	Iterate over all of the second selectors.
  */
		for (var i = 0; i < durationSecondSelectors.length; i++) {
			/*
   	If the selector is a main selector, we set the seconds.
   */
			if (durationSecondSelectors[i].getAttribute('amplitude-main-duration-seconds') == 'true') {
				durationSecondSelectors[i].innerHTML = seconds;
			} else {
				/*
    	If the active playlist is not null or empty
    	and the attribute of the playlist is equal to the
    	active playlist, then we set the inner html.
    */
				if (_config2.default.active_playlist != '' && _config2.default.active_playlist != null && durationSecondSelectors[i].getAttribute('amplitude-playlist') == _config2.default.active_playlist) {
					durationSecondSelectors[i].innerHTML = seconds;
					/*
     	If the active playlist is not set and the selector
     	does not have a playlist then we set the seconds. This
     	means that the duration selector is an individual song
     	selector.
     */
				} else if (_config2.default.active_playlist == '' || _config2.default.active_playlist == null && !durationSecondSelectors[i].hasAttribute('amplitude-playlist')) {
					durationSecondSelectors[i].innerHTML = seconds;
					/*
     	If nothing else matches, set the selector's inner HTML to '00'
     */
				} else {
					durationSecondSelectors[i].innerHTML = '00';
				}
			}
		}
	}

	/**
  * Updates any elements that display the duration time for the song. This
  * is a computed field that will be commonly used.
  *
  * @access public
  * @param {object} durationTime 	- A json object conaining the parts for the duration time for the song.
  */
	function syncDurationTime(durationTime) {
		/*
  	Gets all of the song time selectors.
  */
		var timeSelectors = ['.amplitude-duration-time[amplitude-main-duration-time="true"]', '.amplitude-duration-time[amplitude-playlist-main-duration-time="' + _config2.default.active_playlist + '"]', '.amplitude-duration-time[amplitude-song-index="' + _config2.default.active_index + '"]'];

		/*
  	Get all of the time selectors.
  */
		var durationTimeSelectors = document.querySelectorAll(timeSelectors.join());

		/*
  	Set the time selector's inner html to the duration time for the song. The duration
  	time is computed by joining minutes and seconds.
  */
		var durationText = '00:00';
		if (!isNaN(durationTime.minutes) && !isNaN(durationTime.seconds)) {
			durationText = durationTime.minutes + ':' + durationTime.seconds;
			if (!isNaN(durationTime.hours) && durationTime.hours > 0) {
				durationText = durationTime.hours + ':' + durationText;
			}
		}
		for (var i = 0; i < durationTimeSelectors.length; i++) {
			durationTimeSelectors[i].innerHTML = durationText;
		}
	}

	/**
  * Updates the elements that show how much time is remaining in the song.
  *
  * @access public
  * @param {object} currentTime 	- A json object containing the parts for the current time for the song.
  * @param {object} durationTime - A json object conaining the parts for the duration time for the song.
  */
	function syncCountDownTime(currentTime, songDuration) {
		/*
  	Initialize time remaining.
  */
		var timeRemaining = '00:00';

		/*
  	Ensure that all values are defined.
  */
		if (currentTime != undefined && songDuration != undefined) {
			/*
   	Initialize the total current seconds and total duration seconds
   */
			var totalCurrentSeconds = parseInt(currentTime.seconds) + parseInt(currentTime.minutes) * 60 + parseInt(currentTime.hours) * 60 * 60;
			var totalDurationSeconds = parseInt(songDuration.seconds) + parseInt(songDuration.minutes) * 60 + parseInt(songDuration.hours) * 60 * 60;

			/*
   	If the two variables are numbers we continue the computing.
   */
			if (!isNaN(totalCurrentSeconds) && !isNaN(totalDurationSeconds)) {
				/*
    	Find the total remaining seconds.
    */
				var timeRemainingTotalSeconds = totalDurationSeconds - totalCurrentSeconds;

				var remainingHours = Math.floor(timeRemainingTotalSeconds / 3600);
				var remainingMinutes = Math.floor((timeRemainingTotalSeconds - remainingHours * 3600) / 60);
				var remainingSeconds = timeRemainingTotalSeconds - remainingHours * 3600 - remainingMinutes * 60;

				timeRemaining = (remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes) + ':' + (remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds);

				if (remainingHours > 0) {
					timeRemaining = remainingHours + ':' + timeRemaining;
				}
			}
		}

		/*
  	Gets all of the song time selectors.
  */
		var timeSelectors = ['.amplitude-time-remaining[amplitude-main-time-remaining="true"]', '.amplitude-time-remaining[amplitude-playlist-main-time-remaining="' + _config2.default.active_playlist + '"]', '.amplitude-time-remaining[amplitude-song-index="' + _config2.default.active_index + '"]'];

		/*
  	Get all of the time selectors.
  */
		var timeRemainingSelectors = document.querySelectorAll(timeSelectors.join());

		/*
  	Set the time selector's inner html to the duration time for the song. The duration
  	time is computed by joining minutes and seconds.
  */
		for (var i = 0; i < timeRemainingSelectors.length; i++) {
			timeRemainingSelectors[i].innerHTML = timeRemaining;
		}
	}

	/*
 	Return the publically available functions.
 */
	return {
		syncCurrentHours: syncCurrentHours,
		syncCurrentMinutes: syncCurrentMinutes,
		syncCurrentSeconds: syncCurrentSeconds,
		syncCurrentTime: syncCurrentTime,
		resetCurrentHours: resetCurrentHours,
		resetCurrentMinutes: resetCurrentMinutes,
		resetCurrentSeconds: resetCurrentSeconds,
		resetCurrentTime: resetCurrentTime,
		syncSongPlayedProgressBar: syncSongPlayedProgressBar,
		setElementPlay: setElementPlay,
		setElementPause: setElementPause,
		syncDurationHours: syncDurationHours,
		syncDurationMinutes: syncDurationMinutes,
		syncDurationSeconds: syncDurationSeconds,
		syncDurationTime: syncDurationTime,
		syncCountDownTime: syncCountDownTime
	};
}(); /**
      * Imports the config module
      * @module config
      */
exports.default = AmplitudeVisualSyncHelpers;
module.exports = exports['default'];

/***/ })
/******/ ]);
});

/***/ }),
/* 33 */
/*!***********************************************!*\
  !*** ./app/javascript/partials ^\.\/.*\.pug$ ***!
  \***********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./playlist_entry.pug": 34
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 33;

/***/ }),
/* 34 */
/*!****************************************************!*\
  !*** ./app/javascript/partials/playlist_entry.pug ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var pug = __webpack_require__(/*! ../../../node_modules/pug-runtime/index.js */ 35);

function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (episode, id) {pug_html = pug_html + "\u003Cmixin episode id\u003E\u003C\u002Fmixin\u003E\u003Cdiv" + (pug.attr("id", id, true, true)+pug.attr("data-episode", episode.episode, true, true)+pug.attr("data-podcast", episode.podcast, true, true)+pug.attr("data-date", episode.date, true, true)+pug.attr("data-audio", episode.audio, true, true)) + "\u003E\u003Cdiv id=\"episode\"\u003E" + (pug.escape(null == (pug_interp = episode.episode) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv id=\"podcast\"\u003E" + (pug.escape(null == (pug_interp = episode.podcast) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv id=\"date\"\u003E" + (pug.escape(null == (pug_interp = episode.date) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"episode" in locals_for_with?locals_for_with.episode:typeof episode!=="undefined"?episode:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined));;return pug_html;};
module.exports = template;

/***/ }),
/* 35 */
/*!*******************************************!*\
  !*** ./node_modules/pug-runtime/index.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pug_has_own_property = Object.prototype.hasOwnProperty;

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = pug_merge;
function pug_merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = pug_merge(attrs, a[i]);
    }
    return attrs;
  }

  for (var key in b) {
    if (key === 'class') {
      var valA = a[key] || [];
      a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
    } else if (key === 'style') {
      var valA = pug_style(a[key]);
      valA = valA && valA[valA.length - 1] !== ';' ? valA + ';' : valA;
      var valB = pug_style(b[key]);
      valB = valB && valB[valB.length - 1] !== ';' ? valB + ';' : valB;
      a[key] = valA + valB;
    } else {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Process array, object, or string as a string of classes delimited by a space.
 *
 * If `val` is an array, all members of it and its subarrays are counted as
 * classes. If `escaping` is an array, then whether or not the item in `val` is
 * escaped depends on the corresponding item in `escaping`. If `escaping` is
 * not an array, no escaping is done.
 *
 * If `val` is an object, all the keys whose value is truthy are counted as
 * classes. No escaping is done.
 *
 * If `val` is a string, it is counted as a class. No escaping is done.
 *
 * @param {(Array.<string>|Object.<string, boolean>|string)} val
 * @param {?Array.<string>} escaping
 * @return {String}
 */
exports.classes = pug_classes;
function pug_classes_array(val, escaping) {
  var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
  for (var i = 0; i < val.length; i++) {
    className = pug_classes(val[i]);
    if (!className) continue;
    escapeEnabled && escaping[i] && (className = pug_escape(className));
    classString = classString + padding + className;
    padding = ' ';
  }
  return classString;
}
function pug_classes_object(val) {
  var classString = '', padding = '';
  for (var key in val) {
    if (key && val[key] && pug_has_own_property.call(val, key)) {
      classString = classString + padding + key;
      padding = ' ';
    }
  }
  return classString;
}
function pug_classes(val, escaping) {
  if (Array.isArray(val)) {
    return pug_classes_array(val, escaping);
  } else if (val && typeof val === 'object') {
    return pug_classes_object(val);
  } else {
    return val || '';
  }
}

/**
 * Convert object or string to a string of CSS styles delimited by a semicolon.
 *
 * @param {(Object.<string, string>|string)} val
 * @return {String}
 */

exports.style = pug_style;
function pug_style(val) {
  if (!val) return '';
  if (typeof val === 'object') {
    var out = '';
    for (var style in val) {
      /* istanbul ignore else */
      if (pug_has_own_property.call(val, style)) {
        out = out + style + ':' + val[style] + ';';
      }
    }
    return out;
  } else {
    return val + '';
  }
};

/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = pug_attr;
function pug_attr(key, val, escaped, terse) {
  if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
    return '';
  }
  if (val === true) {
    return ' ' + (terse ? key : key + '="' + key + '"');
  }
  if (typeof val.toJSON === 'function') {
    val = val.toJSON();
  }
  if (typeof val !== 'string') {
    val = JSON.stringify(val);
    if (!escaped && val.indexOf('"') !== -1) {
      return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
    }
  }
  if (escaped) val = pug_escape(val);
  return ' ' + key + '="' + val + '"';
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} terse whether to use HTML5 terse boolean attributes
 * @return {String}
 */
exports.attrs = pug_attrs;
function pug_attrs(obj, terse){
  var attrs = '';

  for (var key in obj) {
    if (pug_has_own_property.call(obj, key)) {
      var val = obj[key];

      if ('class' === key) {
        val = pug_classes(val);
        attrs = pug_attr(key, val, false, terse) + attrs;
        continue;
      }
      if ('style' === key) {
        val = pug_style(val);
      }
      attrs += pug_attr(key, val, false, terse);
    }
  }

  return attrs;
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var pug_match_html = /["&<>]/;
exports.escape = pug_escape;
function pug_escape(_html){
  var html = '' + _html;
  var regexResult = pug_match_html.exec(html);
  if (!regexResult) return _html;

  var result = '';
  var i, lastIndex, escape;
  for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
    switch (html.charCodeAt(i)) {
      case 34: escape = '&quot;'; break;
      case 38: escape = '&amp;'; break;
      case 60: escape = '&lt;'; break;
      case 62: escape = '&gt;'; break;
      default: continue;
    }
    if (lastIndex !== i) result += html.substring(lastIndex, i);
    lastIndex = i + 1;
    result += escape;
  }
  if (lastIndex !== i) return result + html.substring(lastIndex, i);
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the pug in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @param {String} str original source
 * @api private
 */

exports.rethrow = pug_rethrow;
function pug_rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || __webpack_require__(/*! fs */ 36).readFileSync(filename, 'utf8')
  } catch (ex) {
    pug_rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Pug') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};


/***/ }),
/* 36 */
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);
//# sourceMappingURL=application-8a8afb368f264170f1b5.js.map