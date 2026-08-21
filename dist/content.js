"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports, module) {
      (function(global, factory) {
        if (typeof define === "function" && define.amd) {
          define("webextension-polyfill", ["module"], factory);
        } else if (typeof exports !== "undefined") {
          factory(module);
        } else {
          var mod = {
            exports: {}
          };
          factory(mod);
          global.browser = mod.exports;
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(module2) {
        "use strict";
        if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
            const apiMetadata = {
              "alarms": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "clearAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "bookmarks": {
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getChildren": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getRecent": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getSubTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTree": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "browserAction": {
                "disable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "enable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "getBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "openPopup": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "browsingData": {
                "remove": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "removeCache": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCookies": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeDownloads": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFormData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeHistory": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeLocalStorage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePasswords": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePluginData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "settings": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "commands": {
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "contextMenus": {
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "cookies": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAllCookieStores": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "devtools": {
                "inspectedWindow": {
                  "eval": {
                    "minArgs": 1,
                    "maxArgs": 2,
                    "singleCallbackArg": false
                  }
                },
                "panels": {
                  "create": {
                    "minArgs": 3,
                    "maxArgs": 3,
                    "singleCallbackArg": true
                  },
                  "elements": {
                    "createSidebarPane": {
                      "minArgs": 1,
                      "maxArgs": 1
                    }
                  }
                }
              },
              "downloads": {
                "cancel": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "download": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "erase": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFileIcon": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "open": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "pause": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFile": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "resume": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "extension": {
                "isAllowedFileSchemeAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "isAllowedIncognitoAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "history": {
                "addUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "deleteRange": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getVisits": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "i18n": {
                "detectLanguage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAcceptLanguages": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "identity": {
                "launchWebAuthFlow": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "idle": {
                "queryState": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "management": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getSelf": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setEnabled": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "uninstallSelf": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "notifications": {
                "clear": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPermissionLevel": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "pageAction": {
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "hide": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "permissions": {
                "contains": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "request": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "runtime": {
                "getBackgroundPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPlatformInfo": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "openOptionsPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "requestUpdateCheck": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "sendMessage": {
                  "minArgs": 1,
                  "maxArgs": 3
                },
                "sendNativeMessage": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "setUninstallURL": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "sessions": {
                "getDevices": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getRecentlyClosed": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "restore": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "storage": {
                "local": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                },
                "managed": {
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  }
                },
                "sync": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              },
              "tabs": {
                "captureVisibleTab": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "detectLanguage": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "discard": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "duplicate": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "executeScript": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getZoom": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getZoomSettings": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goBack": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goForward": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "highlight": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "insertCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "query": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "reload": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "sendMessage": {
                  "minArgs": 2,
                  "maxArgs": 3
                },
                "setZoom": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "setZoomSettings": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "update": {
                  "minArgs": 1,
                  "maxArgs": 2
                }
              },
              "topSites": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "webNavigation": {
                "getAllFrames": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFrame": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "webRequest": {
                "handlerBehaviorChanged": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "windows": {
                "create": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getLastFocused": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              }
            };
            if (Object.keys(apiMetadata).length === 0) {
              throw new Error("api-metadata.json has not been included in browser-polyfill");
            }
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
                super(items);
                this.createItem = createItem;
              }
              get(key) {
                if (!this.has(key)) {
                  this.set(key, this.createItem(key));
                }
                return super.get(key);
              }
            }
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
            const makeCallback = (promise, metadata) => {
              return (...callbackArgs) => {
                if (extensionAPIs.runtime.lastError) {
                  promise.reject(new Error(extensionAPIs.runtime.lastError.message));
                } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                  promise.resolve(callbackArgs[0]);
                } else {
                  promise.resolve(callbackArgs);
                }
              };
            };
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
            const wrapAsyncFunction = (name, metadata) => {
              return function asyncFunctionWrapper(target, ...args) {
                if (args.length < metadata.minArgs) {
                  throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                }
                if (args.length > metadata.maxArgs) {
                  throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                }
                return new Promise((resolve, reject) => {
                  if (metadata.fallbackToNoCallback) {
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
                      metadata.fallbackToNoCallback = false;
                      metadata.noCallback = true;
                      resolve();
                    }
                  } else if (metadata.noCallback) {
                    target[name](...args);
                    resolve();
                  } else {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  }
                });
              };
            };
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache) {
                    return cache[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache) {
                    cache[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener(target, listener) {
                return target.hasListener(wrapperMap.get(listener));
              },
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            });
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(req, {}, {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                });
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
                    didCallSendResponse = true;
                    resolve(response);
                  };
                });
                let result;
                try {
                  result = listener(message, sender, wrappedSendResponse);
                } catch (err) {
                  result = Promise.reject(err);
                }
                const isResultThenable = result !== true && isThenable(result);
                if (result !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                reject(new Error(reply.message));
              } else {
                resolve(reply);
              }
            };
            const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb);
                apiNamespaceObj.sendMessage(...args);
              });
            };
            const staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            };
            const settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            };
            return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    }
  });

  // src/content.ts
  var import_webextension_polyfill2 = __toESM(require_browser_polyfill());

  // src/adapters/bloodOnTheTracks.ts
  function extractChapterNumber(url) {
    const match = url.match(/chapter-(\d+)(?:[/?#]|$)/i);
    return match ? parseInt(match[1], 10) : null;
  }
  var bloodOnTheTracksAdapter = {
    name: "blood-on-the-tracks",
    matches(_doc, url) {
      return /(^|\.)blood-on-the-tracks\.com$/i.test(new URL(url).hostname);
    },
    parse(doc, url) {
      const title = doc.querySelector("h1")?.textContent?.trim() || doc.title.trim();
      const images = Array.from(doc.querySelectorAll("img")).map((img) => img.src).filter((src) => /blogger(usercontent)?\.(com|googleusercontent\.com)/i.test(src));
      if (images.length < 3) return null;
      const currentChapterNum = extractChapterNumber(url);
      const nav = Array.from(doc.querySelectorAll("a[href]"));
      let prevChapterUrl = null;
      let nextChapterUrl = null;
      for (const a of nav) {
        const text = (a.textContent || "").trim();
        if (!/^previous/i.test(text) && !/^next/i.test(text)) continue;
        const candidateNum = extractChapterNumber(a.href);
        if (currentChapterNum !== null && candidateNum !== null) {
          if (candidateNum < currentChapterNum) prevChapterUrl = a.href;
          else if (candidateNum > currentChapterNum) nextChapterUrl = a.href;
        } else {
          if (/^previous/i.test(text)) prevChapterUrl = a.href;
          if (/^next/i.test(text)) nextChapterUrl = a.href;
        }
      }
      return {
        title,
        chapterKey: url.split("#")[0].split("?")[0],
        images,
        prevChapterUrl,
        nextChapterUrl
      };
    }
  };

  // src/adapters/generic.ts
  var MIN_WIDTH = 250;
  var MIN_HEIGHT = 250;
  var MIN_IMAGES = 3;
  var NEXT_WORDS = /(next|próxim|proxim|seguinte|forward)/i;
  var PREV_WORDS = /(prev|anterior|back|voltar)/i;
  function isLikelyPageImage(img) {
    const w = img.naturalWidth || img.width || parseInt(img.getAttribute("width") || "0", 10);
    const h = img.naturalHeight || img.height || parseInt(img.getAttribute("height") || "0", 10);
    if (w && h) {
      if (w < MIN_WIDTH || h < MIN_HEIGHT) return false;
      const ratio = w / h;
      if (ratio > 4 || ratio < 0.15) return false;
    }
    const src = (img.currentSrc || img.src || "").toLowerCase();
    if (!src || src.startsWith("data:")) return false;
    return true;
  }
  function findImageCluster(doc) {
    const allImages = Array.from(doc.querySelectorAll("img"));
    const candidates = allImages.filter(isLikelyPageImage);
    if (candidates.length < MIN_IMAGES) return [];
    const countByAncestor = /* @__PURE__ */ new Map();
    for (const img of candidates) {
      let node = img.parentElement;
      let steps = 0;
      while (node && steps < 6) {
        countByAncestor.set(node, (countByAncestor.get(node) || 0) + 1);
        node = node.parentElement;
        steps++;
      }
    }
    let bestAncestor = null;
    let bestCount = 0;
    for (const [el, count] of countByAncestor) {
      if (count > bestCount) {
        bestCount = count;
        bestAncestor = el;
      }
    }
    if (!bestAncestor || bestCount < MIN_IMAGES) return candidates;
    const inCluster = candidates.filter((img) => bestAncestor.contains(img));
    return inCluster.length >= MIN_IMAGES ? inCluster : candidates;
  }
  function findChapterLink(doc, wordPattern) {
    const anchors = Array.from(doc.querySelectorAll("a[href]"));
    for (const a of anchors) {
      const text = `${a.textContent || ""} ${a.getAttribute("rel") || ""} ${a.getAttribute("aria-label") || ""}`;
      if (wordPattern.test(text)) {
        return a.href;
      }
    }
    return null;
  }
  function guessTitle(doc) {
    const h1 = doc.querySelector("h1");
    if (h1?.textContent?.trim()) return h1.textContent.trim();
    if (doc.title) return doc.title.trim();
    return "Manga Chapter";
  }
  var genericAdapter = {
    name: "generic",
    matches() {
      return true;
    },
    parse(doc, url) {
      const cluster = findImageCluster(doc);
      if (cluster.length < MIN_IMAGES) return null;
      const images = cluster.map((img) => img.currentSrc || img.src).filter((src, idx, arr) => src && arr.indexOf(src) === idx);
      if (images.length < MIN_IMAGES) return null;
      return {
        title: guessTitle(doc),
        chapterKey: url.split("#")[0].split("?")[0],
        images,
        prevChapterUrl: findChapterLink(doc, PREV_WORDS),
        nextChapterUrl: findChapterLink(doc, NEXT_WORDS)
      };
    }
  };

  // src/adapters/index.ts
  var adapters = [bloodOnTheTracksAdapter, genericAdapter];
  function parseChapter(doc, url) {
    for (const adapter of adapters) {
      if (!adapter.matches(doc, url)) continue;
      const result = adapter.parse(doc, url);
      if (result) return result;
    }
    return null;
  }

  // src/storage.ts
  var import_webextension_polyfill = __toESM(require_browser_polyfill());
  var SETTINGS_KEY = "manga-reader:settings";
  var PROGRESS_PREFIX = "manga-reader:progress:";
  var DEFAULT_SETTINGS = {
    mode: "single",
    zoom: 1,
    rtl: false,
    darkMode: true,
    fitWidth: true,
    hudHidden: false
  };
  async function getSettings() {
    const stored = await import_webextension_polyfill.default.storage.local.get(SETTINGS_KEY);
    const value = stored[SETTINGS_KEY];
    return { ...DEFAULT_SETTINGS, ...value || {} };
  }
  async function saveSettings(settings) {
    await import_webextension_polyfill.default.storage.local.set({ [SETTINGS_KEY]: settings });
  }
  async function getProgress(chapterKey) {
    const key = PROGRESS_PREFIX + chapterKey;
    const stored = await import_webextension_polyfill.default.storage.local.get(key);
    return stored[key] || null;
  }
  async function saveProgress(chapterKey, page) {
    const key = PROGRESS_PREFIX + chapterKey;
    await import_webextension_polyfill.default.storage.local.set({
      [key]: { page, updatedAt: Date.now() }
    });
  }

  // src/reader.ts
  var HOST_ID = "manga-reader-host-a1b2c3";
  var PRELOAD_AHEAD = 3;
  var EYE_OPEN_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC4ElEQVR4nO2Y32vPURjHX7NNC/ObFil3wxab/AGU4sLPC7mYH1vNDbnyIxeSwtWE/Cr5UdsKJYrSyG9S3Ci0UrJyqRjhAttMz3q+9ez0Mc9Z332/Ls6rTn06n/N+zvP5nuc85zlfSCQSiUQiwWxgE3ASuAu8A7qBXm3y/Ba4AxwHGoBZxXZ6JrAXeAn0D7O9APYAVYV0vAa4pL9sf57aL6ANmDOSjk8DzgJ9GQ78AG4B+4AVwFxgElAKlOmzfPgqYL+G0s8MO/KjnAYm59v5tcDHjAklfJqAymHYnAA0A50Zdj8AK/PheJluunCC+8DSfEwAlADLgccZ8xzRVRwWlbrU1qBkk0ZGhhJgC/AlmLMDGBNrbDzwNDB0s0DZYgZwO5j7ETDOa2C05nJr4IxzKUt1v0hGeQN81ybPrcAaYJQzdM8HPkiSKPd8wLlAKJnFwxLgtSNlvgIWO0PqQKCVDDUkDYGgxen8dqAnIu/3qMbDsUC7/m8DJb4/B0vmCZvGYIJPmuvrgbHa6rWvOxi72RlONqTFxvSsgRfNoC49fP5FtR5iOd09YMoQ46fqGHsAVjvmEZvvjU722CAWAL/NANmIHq4ZzTOgwqGRMc+N7qpzrnVGI9VArX15xbx84DRYZcoKKQHm4afG1FJ9EenZHnaXbd7NbUBZhYVOY83BYROLaHJ6seVhUVAADnz4LtP5MMKBFqMTG7HYeQ9H6Owq7JCOJ6YjpkxoNbqN8f6zwejbI3RNRicfM3BS5uJYsoSXE8bQtnj/2Wr0cpOLKetz++ebdBwEvuqpF8Nu48AF4hFNTi+2Yjikzsf6PIi64HCR+t7LxOBQq6NI2MuIhJSXU0bXSRFZHZQGOyOzT79eM4tKe+DQdWB+xjg57W8EY9v4D6jIuLnl6qkObV0Z70XjKT0KglSMR51/tfTqXVc0/x01GlK2LLeZqi2yZioa5VotLtNW670OJhKJRCKRSFA4/gDT2VWv7Gda2QAAAABJRU5ErkJggg==";
  var EYE_CLOSED_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC0klEQVR4nO2ZW4hOURTHf8a4DeJzSXKfUHhAPIjyrlwyHjEpHniapIxiJE0zoiZyad48KAopl8i9GB7cby/kgXEZxpMazAwZrVqnVrvzfX37zDnnQ+dXu9mds/d/rb3P3vtbew1kZGRk/A+MBaqBJuAy8Ar4AnQBnVqXZ5eAfcBqYEypnRYHaoEnwG+gx7NIn4fAFmBUmo5PBY7p7PbEVDqBo8CUJB3PAc3AzzwOXAPqgJXADGAk0B8YoDMsz6qAncDNPBPQBRwChsXt/DLgQ4jB28BaYHAEzaHAOuBuiO47YEkcjvcF9oSs8RZgMfGxQL+gu0fEdllU0QrgoiP6EVhOcqwC2hybZ4FBvkLS4XqIkOyDpBkBXHBsX/EdxBlHoL43nzICZUCj48NJH4GvpuNWSsc248c3n47rgQfAJkrPRuCp/s3IyMjISI864AdwhNLRrKG6hODetJmocBrpM91EwRJEenPa/IzvJn3qjf1TUQRWGIH3Gl6nxRCd9cC+XKi86aeO24g0LRqN3Vb1JRLVRkg29BySZ55u3MDumt6I9QHuO7MhOaCkGO/cve+pD5GRLEKHc7GQ0HYc8TMReOHY6tBrpjcy6u0FElaSNZgbo/Pz82Q9gmN8h++XaHJEXupJ0GqedevG9r5wGyo089BtdN8CS9Wm9UF8KprPpuNVc5mXz/zcEX6j6cHhnhd3uaraCZHyDJigbXJqO3j3yWcANSq+Fyh33smMHw5ZXrJezwGbgYXAJJ1hSXpNBhbpQCXj8D1kmRwEBjq2ytWHVvUpNmblSTFGLb+A2aSIzRndAU6EnFaFirQ9rn2DZzfScr7K2ciStEWXixx5DcB5oN20a9fl1aD9g7BkprOB5V3iPDYG9xdot8u0k3o+Dph2j0iBFnMq5GIYQE61pN0tUmA0sKGIf0YUOwChUjVF+6+h1gxA6v8clcBrLVLPyMggfv4AoXhKfSx0ZrcAAAAASUVORK5CYII=";
  async function openReader(chapter, options = {}) {
    const existing = document.getElementById(HOST_ID);
    if (existing) existing.remove();
    const host = document.createElement("div");
    host.id = HOST_ID;
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });
    const settings = await getSettings();
    const savedProgress = await getProgress(chapter.chapterKey);
    let currentPage = clamp(savedProgress?.page ?? 0, 0, chapter.images.length - 1);
    shadow.innerHTML = buildTemplate();
    const styleEl = document.createElement("style");
    styleEl.textContent = CSS;
    shadow.prepend(styleEl);
    const els = {
      root: shadow.querySelector(".mr-root"),
      title: shadow.querySelector(".mr-title"),
      pageInfo: shadow.querySelector(".mr-page-info"),
      stage: shadow.querySelector(".mr-stage"),
      slider: shadow.querySelector(".mr-slider"),
      prevPageBtn: shadow.querySelector(".mr-prev-page"),
      nextPageBtn: shadow.querySelector(".mr-next-page"),
      prevChapterBtn: shadow.querySelector(".mr-prev-chapter"),
      nextChapterBtn: shadow.querySelector(".mr-next-chapter"),
      modeBtn: shadow.querySelector(".mr-mode"),
      rtlBtn: shadow.querySelector(".mr-rtl"),
      darkBtn: shadow.querySelector(".mr-dark"),
      fitBtn: shadow.querySelector(".mr-fit"),
      zoomOutBtn: shadow.querySelector(".mr-zoom-out"),
      zoomInBtn: shadow.querySelector(".mr-zoom-in"),
      zoomLabel: shadow.querySelector(".mr-zoom-label"),
      fullscreenBtn: shadow.querySelector(".mr-fullscreen"),
      closeBtn: shadow.querySelector(".mr-close"),
      leftClickZone: shadow.querySelector(".mr-click-left"),
      rightClickZone: shadow.querySelector(".mr-click-right"),
      hudToggleBtn: shadow.querySelector(".mr-hud-toggle"),
      hudIcon: shadow.querySelector(".mr-hud-icon")
    };
    els.title.textContent = chapter.title;
    els.slider.max = String(chapter.images.length - 1);
    els.prevChapterBtn.disabled = !chapter.prevChapterUrl;
    els.nextChapterBtn.disabled = !chapter.nextChapterUrl;
    applySettingsToDom();
    const preloaded = /* @__PURE__ */ new Set();
    function preloadAround(page) {
      for (let i = page; i <= page + PRELOAD_AHEAD; i++) {
        if (i < 0 || i >= chapter.images.length || preloaded.has(i)) continue;
        preloaded.add(i);
        const img = new Image();
        img.src = chapter.images[i];
      }
    }
    function applySettingsToDom() {
      els.root.classList.toggle("mr-dark-theme", settings.darkMode);
      els.root.classList.toggle("mr-light-theme", !settings.darkMode);
      els.root.classList.toggle("mr-continuous", settings.mode === "continuous");
      els.root.classList.toggle("mr-fit-width", settings.fitWidth);
      els.root.style.setProperty("--mr-zoom", String(settings.zoom));
      els.modeBtn.textContent = settings.mode === "single" ? "\u{1F4D6} P\xE1gina \xFAnica" : "\u{1F4DC} Cont\xEDnuo";
      els.rtlBtn.textContent = settings.rtl ? "\u25C0 RTL" : "\u25B6 LTR";
      els.rtlBtn.classList.toggle("mr-active", settings.rtl);
      els.darkBtn.textContent = settings.darkMode ? "\u{1F319}" : "\u2600\uFE0F";
      els.fitBtn.classList.toggle("mr-active", settings.fitWidth);
      els.zoomLabel.textContent = `${Math.round(settings.zoom * 100)}%`;
      els.root.classList.toggle("mr-hud-hidden", settings.hudHidden);
      els.hudIcon.src = settings.hudHidden ? EYE_CLOSED_ICON : EYE_OPEN_ICON;
      els.hudToggleBtn.title = settings.hudHidden ? "Mostrar controles (H)" : "Ocultar controles (H)";
    }
    function persistSettings() {
      saveSettings(settings).catch(() => void 0);
    }
    function renderSinglePage() {
      els.stage.innerHTML = "";
      const img = document.createElement("img");
      img.className = "mr-page-img";
      img.src = chapter.images[currentPage];
      img.alt = `P\xE1gina ${currentPage + 1}`;
      els.stage.appendChild(img);
      els.pageInfo.textContent = `${currentPage + 1} / ${chapter.images.length}`;
      els.slider.value = String(currentPage);
      preloadAround(currentPage);
      saveProgress(chapter.chapterKey, currentPage).catch(() => void 0);
    }
    function renderContinuous() {
      els.stage.innerHTML = "";
      chapter.images.forEach((src, idx) => {
        const img = document.createElement("img");
        img.className = "mr-page-img mr-continuous-img";
        img.loading = idx < PRELOAD_AHEAD + 1 ? "eager" : "lazy";
        img.src = src;
        img.dataset.pageIndex = String(idx);
        els.stage.appendChild(img);
      });
      els.pageInfo.textContent = `${currentPage + 1} / ${chapter.images.length}`;
      els.slider.value = String(currentPage);
      preloadAround(currentPage);
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          const idx = Number(visible.target.dataset.pageIndex);
          if (!Number.isNaN(idx) && idx !== currentPage) {
            currentPage = idx;
            els.pageInfo.textContent = `${currentPage + 1} / ${chapter.images.length}`;
            els.slider.value = String(currentPage);
            preloadAround(currentPage);
            saveProgress(chapter.chapterKey, currentPage).catch(() => void 0);
          }
        },
        { root: els.stage, threshold: [0.5] }
      );
      shadow.querySelectorAll(".mr-continuous-img").forEach((el) => observer.observe(el));
      requestAnimationFrame(() => {
        const target = shadow.querySelector(`[data-page-index="${currentPage}"]`);
        target?.scrollIntoView({ block: "start" });
      });
    }
    function render() {
      if (settings.mode === "single") renderSinglePage();
      else renderContinuous();
    }
    function goToPage(page) {
      currentPage = clamp(page, 0, chapter.images.length - 1);
      render();
    }
    function nextPage() {
      if (currentPage < chapter.images.length - 1) {
        goToPage(currentPage + 1);
      } else if (chapter.nextChapterUrl) {
        navigateToChapter(chapter.nextChapterUrl);
      }
    }
    function prevPage() {
      if (currentPage > 0) {
        goToPage(currentPage - 1);
      } else if (chapter.prevChapterUrl) {
        navigateToChapter(chapter.prevChapterUrl, true);
      }
    }
    function navigateToChapter(url, _fromStart = false) {
      if (options.onNavigate) options.onNavigate(url);
      else window.location.href = url;
    }
    function closeReader() {
      document.removeEventListener("keydown", onKeyDown);
      host.remove();
    }
    function onKeyDown(e) {
      if (e.key === "Escape") return closeReader();
      if (e.key === "f" || e.key === "F") return toggleFullscreen();
      if (e.key === "h" || e.key === "H") return toggleHud();
      if (settings.mode !== "single") return;
      const goForward = settings.rtl ? "ArrowLeft" : "ArrowRight";
      const goBack = settings.rtl ? "ArrowRight" : "ArrowLeft";
      if (e.key === goForward || e.key === " ") {
        e.preventDefault();
        nextPage();
      } else if (e.key === goBack) {
        e.preventDefault();
        prevPage();
      }
    }
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        host.requestFullscreen?.().catch(() => void 0);
      } else {
        document.exitFullscreen?.().catch(() => void 0);
      }
    }
    els.closeBtn.addEventListener("click", closeReader);
    els.nextPageBtn.addEventListener("click", nextPage);
    els.prevPageBtn.addEventListener("click", prevPage);
    els.leftClickZone.addEventListener("click", () => settings.rtl ? nextPage() : prevPage());
    els.rightClickZone.addEventListener("click", () => settings.rtl ? prevPage() : nextPage());
    els.slider.addEventListener("input", () => goToPage(Number(els.slider.value)));
    els.prevChapterBtn.addEventListener("click", () => chapter.prevChapterUrl && navigateToChapter(chapter.prevChapterUrl, true));
    els.nextChapterBtn.addEventListener("click", () => chapter.nextChapterUrl && navigateToChapter(chapter.nextChapterUrl));
    els.modeBtn.addEventListener("click", () => {
      settings.mode = settings.mode === "single" ? "continuous" : "single";
      applySettingsToDom();
      persistSettings();
      render();
    });
    els.rtlBtn.addEventListener("click", () => {
      settings.rtl = !settings.rtl;
      applySettingsToDom();
      persistSettings();
    });
    els.darkBtn.addEventListener("click", () => {
      settings.darkMode = !settings.darkMode;
      applySettingsToDom();
      persistSettings();
    });
    els.fitBtn.addEventListener("click", () => {
      settings.fitWidth = !settings.fitWidth;
      applySettingsToDom();
      persistSettings();
    });
    els.zoomInBtn.addEventListener("click", () => setZoom(settings.zoom + 0.1));
    els.zoomOutBtn.addEventListener("click", () => setZoom(settings.zoom - 0.1));
    function setZoom(z) {
      settings.zoom = clamp(Math.round(z * 100) / 100, 0.5, 2.5);
      applySettingsToDom();
      persistSettings();
    }
    els.fullscreenBtn.addEventListener("click", toggleFullscreen);
    els.hudToggleBtn.addEventListener("click", toggleHud);
    document.addEventListener("keydown", onKeyDown);
    function toggleHud() {
      settings.hudHidden = !settings.hudHidden;
      applySettingsToDom();
      persistSettings();
    }
    render();
  }
  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }
  function buildTemplate() {
    return `
    <div class="mr-root">
      <button class="mr-hud-toggle" title="Ocultar/mostrar controles (H)">
        <img class="mr-hud-icon" alt="Alternar controles" />
      </button>

      <header class="mr-topbar">
        <div class="mr-title-block">
          <div class="mr-title"></div>
          <div class="mr-page-info"></div>
        </div>
        <div class="mr-topbar-controls">
          <button class="mr-btn mr-mode" title="Alternar modo de leitura"></button>
          <button class="mr-btn mr-rtl" title="Alternar dire\xE7\xE3o de leitura"></button>
          <button class="mr-btn mr-fit" title="Ajustar \xE0 largura">\u2194 Largura</button>
          <button class="mr-btn mr-zoom-out" title="Diminuir zoom">\u2212</button>
          <div class="mr-zoom-label">100%</div>
          <button class="mr-btn mr-zoom-in" title="Aumentar zoom">+</button>
          <button class="mr-btn mr-dark" title="Alternar tema"></button>
          <button class="mr-btn mr-fullscreen" title="Tela cheia (F)">\u26F6</button>
          <button class="mr-btn mr-close" title="Fechar (Esc)">\u2715</button>
        </div>
      </header>

      <div class="mr-stage-wrap">
        <div class="mr-click-left" title="P\xE1gina anterior"></div>
        <div class="mr-stage"></div>
        <div class="mr-click-right" title="Pr\xF3xima p\xE1gina"></div>
      </div>

      <footer class="mr-bottombar">
        <button class="mr-btn mr-prev-chapter">\u2190 Cap\xEDtulo anterior</button>
        <button class="mr-btn mr-prev-page">\u2039</button>
        <input type="range" class="mr-slider" min="0" value="0" step="1" />
        <button class="mr-btn mr-next-page">\u203A</button>
        <button class="mr-btn mr-next-chapter">Pr\xF3ximo cap\xEDtulo \u2192</button>
      </footer>
    </div>
  `;
  }
  var CSS = `
:host { all: initial; }
* { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
.mr-root {
  position: fixed; inset: 0; z-index: 2147483647;
  display: flex; flex-direction: column;
  --mr-zoom: 1;
}
.mr-dark-theme { background: #0e0e12; color: #f0f0f0; }
.mr-light-theme { background: #f5f5f7; color: #1a1a1a; }

.mr-topbar, .mr-bottombar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; flex-wrap: wrap;
}
.mr-dark-theme .mr-topbar, .mr-dark-theme .mr-bottombar { background: #17171d; border-color: #2a2a33; }
.mr-light-theme .mr-topbar, .mr-light-theme .mr-bottombar { background: #ffffff; border-color: #e2e2e6; }
.mr-topbar { border-bottom: 1px solid; justify-content: space-between; }
.mr-bottombar { border-top: 1px solid; }

.mr-title-block { display: flex; flex-direction: column; min-width: 0; }
.mr-title { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 40vw; }
.mr-page-info { font-size: 12px; opacity: 0.7; }

.mr-topbar-controls { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }

.mr-btn {
  border: 1px solid transparent; border-radius: 6px; padding: 6px 10px;
  font-size: 13px; cursor: pointer; background: rgba(127,127,127,0.15); color: inherit;
}
.mr-btn:hover { background: rgba(127,127,127,0.3); }
.mr-btn:disabled { opacity: 0.35; cursor: default; }
.mr-btn.mr-active { background: #4f7cff; color: white; }
.mr-zoom-label { font-size: 12px; min-width: 40px; text-align: center; opacity: 0.8; }

.mr-stage-wrap { position: relative; flex: 1; display: flex; overflow: hidden; }
.mr-stage { flex: 1; overflow: auto; display: flex; flex-direction: column; align-items: center; scroll-behavior: smooth; }
.mr-continuous .mr-stage { gap: 4px; }

.mr-page-img {
  max-width: calc(100% * var(--mr-zoom));
  height: auto;
  display: block;
  margin: 0 auto;
  user-select: none;
}
.mr-root:not(.mr-fit-width) .mr-page-img { max-width: none; width: calc(60% * var(--mr-zoom)); }
.mr-root:not(.mr-continuous) .mr-stage { justify-content: center; }
.mr-root:not(.mr-continuous) .mr-page-img { margin: auto; }

.mr-click-left, .mr-click-right {
  position: absolute; top: 0; bottom: 0; width: 12%; z-index: 2; cursor: pointer;
}
.mr-click-left { left: 0; } .mr-click-right { right: 0; }
.mr-continuous .mr-click-left, .mr-continuous .mr-click-right { display: none; }

.mr-slider { flex: 1; min-width: 80px; }

.mr-hud-toggle {
  position: absolute; top: 12px; right: 14px; z-index: 10;
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid rgba(127,127,127,0.35);
  background: rgba(30,30,36,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; padding: 0;
}
.mr-light-theme .mr-hud-toggle { background: rgba(255,255,255,0.75); }
.mr-hud-toggle:hover { background: rgba(79,124,255,0.85); }
.mr-hud-icon { width: 18px; height: 18px; display: block; pointer-events: none; }
.mr-dark-theme .mr-hud-icon { filter: invert(1); }

.mr-hud-hidden .mr-topbar,
.mr-hud-hidden .mr-bottombar { display: none; }
`;

  // src/content.ts
  async function handleActivate() {
    const chapter = parseChapter(document, window.location.href);
    if (!chapter) {
      alert(
        "Manga Reader: n\xE3o consegui identificar as p\xE1ginas do mang\xE1 nesta p\xE1gina.\nTente abrir diretamente a p\xE1gina do cap\xEDtulo (n\xE3o a p\xE1gina inicial do site)."
      );
      return;
    }
    await openReader(chapter, {
      onNavigate: (url) => {
        import_webextension_polyfill2.default.runtime.sendMessage({ type: "NAVIGATE_CHAPTER", url }).catch(() => {
          window.location.href = url;
        });
      }
    });
  }
  import_webextension_polyfill2.default.runtime.onMessage.addListener((message) => {
    const msg = message;
    if (msg?.type === "ACTIVATE_READER") {
      handleActivate();
    }
  });
})();
//# sourceMappingURL=content.js.map
