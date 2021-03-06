(function(e, a) { for(var i in a) e[i] = a[i]; }(this, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const request_1 = __webpack_require__(1);
	var K8s;
	(function (K8s) {
	    K8s.api = (conf) => {
	        return new request_1.Request(conf);
	    };
	    K8s.kubectl = __webpack_require__(7);
	})(K8s || (K8s = {}));
	module.exports = K8s;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	const request = __webpack_require__(2);
	const Rx = __webpack_require__(3);
	const _ = __webpack_require__(4);
	const Observable = Rx.Observable;
	const fs = __webpack_require__(5);
	const jsyaml = __webpack_require__(6);
	class Request {
	    constructor(conf) {
	        if (conf.kubeconfig) {
	            var kubeconfig = jsyaml.safeLoad(fs.readFileSync(conf.kubeconfig));
	            var context = this.readContext(kubeconfig);
	            var cluster = this.readCluster(kubeconfig, context);
	            var user = this.readUser(kubeconfig, context);
	        }
	        this.auth = conf.auth || {};
	        this.auth.caCert = this.auth.caCert || this.readCaCert(cluster);
	        this.auth.clientKey = this.auth.clientKey || this.readClientKey(user);
	        this.auth.clientCert = this.auth.clientCert || this.readClientCert(user);
	        this.auth.token = this.auth.token || this.readUserToken(user);
	        this.auth.username = this.auth.username || this.readUsername(user);
	        this.auth.password = this.auth.password || this.readPassword(user);
	        // only set to false if explictly false in the config
	        this.strictSSL = (conf.strictSSL !== false);
	        var endpoint = conf.endpoint || this.readEndpoint(cluster);
	        this.domain = `${endpoint}${conf.version}/`;
	    }
	    // Returns Context JSON from kubeconfig
	    readContext(kubeconfig) {
	        if (!kubeconfig)
	            return;
	        return kubeconfig.contexts.find(x => x.name === kubeconfig['current-context']);
	    }
	    // Returns Cluster JSON from context at kubeconfig
	    readCluster(kubeconfig, context) {
	        if (!kubeconfig || !context)
	            return;
	        return kubeconfig.clusters.find(x => x.name === context.context.cluster);
	    }
	    // Returns Cluster JSON from context at kubeconfig
	    readUser(kubeconfig, context) {
	        if (!kubeconfig)
	            return;
	        return kubeconfig.users.find(x => x.name === context.context.user);
	    }
	    // Returns CaCert from kubeconfig
	    readCaCert(cluster) {
	        if (!cluster)
	            return;
	        var certificate_authority = cluster.cluster['certificate-authority'];
	        if (certificate_authority) {
	            return fs.readFileSync(certificate_authority).toString();
	        }
	        var certificate_authority_data = cluster.cluster['certificate-authority-data'];
	        if (certificate_authority_data) {
	            return Buffer.from(certificate_authority_data, 'base64').toString("ascii");
	        }
	    }
	    // Returns CaCert from kubeconfig
	    readClientKey(user) {
	        if (!user)
	            return;
	        var client_key = user.user['client-key'];
	        if (client_key) {
	            return fs.readFileSync(client_key).toString();
	        }
	        var client_key_data = user.user['client-key-data'];
	        if (client_key_data) {
	            return Buffer.from(client_key_data, 'base64').toString("ascii");
	        }
	    }
	    // Returns CaCert from kubeconfig
	    readClientCert(user) {
	        if (!user)
	            return;
	        var client_certificate = user.user['client-certificate'];
	        if (client_certificate) {
	            return fs.readFileSync(client_certificate).toString();
	        }
	        var client_certificate_data = user.user['client-certificate-data'];
	        if (client_certificate_data) {
	            return Buffer.from(client_certificate_data, 'base64').toString("ascii");
	        }
	    }
	    // Returns User token from kubeconfig
	    readUserToken(user) {
	        if (!user)
	            return;
	        return user.user['token'];
	    }
	    // Returns User token from kubeconfig
	    readUsername(user) {
	        if (!user)
	            return;
	        return user.user['username'];
	    }
	    readPassword(user) {
	        if (!user)
	            return;
	        return user.user['password'];
	    }
	    readEndpoint(cluster) {
	        if (!cluster)
	            return;
	        return cluster.cluster['server'];
	    }
	    callbackFunction(primise, callback) {
	        if (_.isFunction(callback)) {
	            primise.then(data => {
	                callback(null, data);
	            }).catch(err => {
	                callback(err);
	            });
	        }
	    }
	    getRequestOptions(path, opts) {
	        const options = opts || {};
	        options.url = this.domain + path;
	        options.headers = {
	            'Content-Type': 'application/json'
	        };
	        options.strictSSL = this.strictSSL;
	        if (this.auth) {
	            if (this.auth.caCert) {
	                options.ca = this.auth.caCert;
	            }
	            if (this.auth.username && this.auth.password) {
	                const authstr = new Buffer(this.auth.username + ':' + this.auth.password).toString('base64');
	                options.headers.Authorization = `Basic ${authstr}`;
	            }
	            else if (this.auth.token) {
	                options.headers.Authorization = `Bearer ${this.auth.token}`;
	            }
	            else if (this.auth.clientCert && this.auth.clientKey) {
	                options.cert = this.auth.clientCert;
	                options.key = this.auth.clientKey;
	            }
	        }
	        return options;
	    }
	    get(url, done) {
	        return __awaiter(this, void 0, void 0, function* () {
	            const promise = new Promise((resolve, reject) => {
	                request.get(this.getRequestOptions(url), function (err, res, data) {
	                    if (err || res.statusCode < 200 || res.statusCode >= 300)
	                        return reject(err || data);
	                    resolve(JSON.parse(data));
	                });
	            });
	            this.callbackFunction(promise, done);
	            return promise;
	        });
	    }
	    log(url, done) {
	        return __awaiter(this, void 0, void 0, function* () {
	            const promise = new Promise((resolve, reject) => {
	                request.get(this.getRequestOptions(url), function (err, res, data) {
	                    if (err || res.statusCode < 200 || res.statusCode >= 300)
	                        return reject(err || data);
	                    resolve(data);
	                });
	            });
	            this.callbackFunction(promise, done);
	            return promise;
	        });
	    }
	    post(url, body, done) {
	        const promise = new Promise((resolve, reject) => {
	            request.post(this.getRequestOptions(url, { json: body }), function (err, res, data) {
	                if (err || res.statusCode < 200 || res.statusCode >= 300)
	                    return reject(err || data);
	                resolve(data);
	            });
	        });
	        this.callbackFunction(promise, done);
	        return promise;
	    }
	    put(url, body, done) {
	        const promise = new Promise((resolve, reject) => {
	            request.put(this.getRequestOptions(url, { json: body }), function (err, res, data) {
	                if (err || res.statusCode < 200 || res.statusCode >= 300)
	                    return reject(err || data);
	                resolve(data);
	            });
	        });
	        this.callbackFunction(promise, done);
	        return promise;
	    }
	    patch(url, body, _options, done) {
	        if (typeof (_options) === 'function') {
	            done = _options;
	            _options = undefined;
	        }
	        const promise = new Promise((resolve, reject) => {
	            const options = this.getRequestOptions(url, { json: body });
	            options.headers['Content-Type'] = 'application/json-patch+json';
	            if (_options && _options.headers) {
	                for (let key in _options.headers) {
	                    options.headers[key] = _options.headers[key];
	                }
	            }
	            request.patch(options, function (err, res, data) {
	                if (err || res.statusCode < 200 || res.statusCode >= 300)
	                    return reject(err || data);
	                resolve(data);
	            });
	        });
	        this.callbackFunction(promise, done);
	        return promise;
	    }
	    delete(url, json, done) {
	        if (_.isFunction(json)) {
	            done = json;
	            json = undefined;
	        }
	        const promise = new Promise((resolve, reject) => {
	            request.del(this.getRequestOptions(url, json), function (err, res, data) {
	                if (err || res.statusCode < 200 || res.statusCode >= 300)
	                    return reject(err || data);
	                resolve(data);
	            });
	        });
	        this.callbackFunction(promise, done);
	        return promise;
	    }
	    watch(url, message, exit, timeout) {
	        if (_.isNumber(message)) {
	            timeout = message;
	            message = undefined;
	        }
	        var res;
	        const source = Rx.Observable.create((observer) => {
	            var jsonStr = '';
	            res = request.get(this.getRequestOptions(url, { timeout: timeout }), function (e) { }).on('data', function (data) {
	                if (res.response.headers['content-type'] === 'text/plain') {
	                    observer.onNext(data.toString());
	                }
	                else {
	                    jsonStr += data.toString();
	                    if (!/\n$/.test(jsonStr))
	                        return;
	                    jsonStr = jsonStr.replace('\n$', '');
	                    try {
	                        jsonStr.split('\n').forEach(function (jsonStr) {
	                            if (!jsonStr)
	                                return;
	                            const json = JSON.parse(jsonStr);
	                            observer.onNext(json);
	                        });
	                        jsonStr = '';
	                    }
	                    catch (err) {
	                        observer.onError(err);
	                    }
	                }
	            }).on('error', function (err) {
	                observer.onError(err);
	            }).on('close', function () {
	                observer.onError();
	            });
	        });
	        if (_.isFunction(message)) {
	            source.subscribe(data => {
	                message(data);
	            }, err => {
	                if (_.isFunction(exit))
	                    exit(err);
	            });
	            return res;
	        }
	        return source;
	    }
	}
	exports.Request = Request;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("request");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = require("rx");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = require("underscore");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = require("fs");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = require("js-yaml");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	const spawn = __webpack_require__(8).spawn;
	const _ = __webpack_require__(4);
	class Kubectl {
	    constructor(type, conf) {
	        this.type = type;
	        this.binary = conf.binary || 'kubectl';
	        this.kubeconfig = conf.kubeconfig || '';
	        this.namespace = conf.namespace || '';
	        this.endpoint = conf.endpoint || '';
	    }
	    spawn(args, done) {
	        const ops = new Array();
	        if (this.kubeconfig) {
	            ops.push('--kubeconfig=' + this.kubeconfig);
	        }
	        else {
	            ops.push('-s');
	            ops.push(this.endpoint);
	        }
	        if (this.namespace) {
	            ops.push('--namespace=' + this.namespace);
	        }
	        const kube = spawn(this.binary, ops.concat(args)), stdout = [], stderr = [];
	        kube.stdout.on('data', function (data) {
	            stdout.push(data.toString());
	        });
	        kube.stderr.on('data', function (data) {
	            stderr.push(data.toString());
	        });
	        kube.on('close', function (code) {
	            if (!stderr.length)
	                return done(null, stdout.join(''));
	            done(stderr.join(''));
	        });
	    }
	    callbackFunction(primise, callback) {
	        if (_.isFunction(callback)) {
	            primise.then(data => {
	                callback(null, data);
	            }).catch(err => {
	                callback(err);
	            });
	        }
	    }
	    command(cmd, callback) {
	        if (_.isString(cmd))
	            cmd = cmd.split(' ');
	        const promise = new Promise((resolve, reject) => {
	            this.spawn(cmd, function (err, data) {
	                if (err)
	                    return reject(err || data);
	                resolve(cmd.join(' ').indexOf('--output=json') > -1 ? JSON.parse(data) : data);
	            });
	        });
	        this.callbackFunction(promise, callback);
	        return promise;
	    }
	    list(selector, flags, done) {
	        if (!this.type)
	            throw new Error('not a function');
	        if (typeof selector === 'object') {
	            var args = '--selector=';
	            for (var key in selector)
	                args += (key + '=' + selector[key]);
	            selector = args + '';
	        }
	        else {
	            done = selector;
	            selector = '--output=json';
	        }
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        const action = ['get', this.type, selector, '--output=json'].concat(flags);
	        return this.command(action, done);
	    }
	    get(name, flags, done) {
	        if (!this.type)
	            throw new Error('not a function');
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        const action = ['get', this.type, name, '--output=json'].concat(flags);
	        return this.command(action, done);
	    }
	    create(filepath, flags, done) {
	        if (!this.type)
	            throw new Error('not a function');
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        const action = ['create', '-f', filepath].concat(flags);
	        return this.command(action, done);
	    }
	    delete(id, flags, done) {
	        if (!this.type)
	            throw new Error('not a function');
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        const action = ['delete', this.type, id].concat(flags);
	        return this.command(action, done);
	    }
	    update(filepath, flags, done) {
	        if (!this.type)
	            throw new Error('not a function');
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        const action = ['update', '-f', filepath].concat(flags);
	        return this.command(action, done);
	    }
	    apply(name, json, flags, done) {
	        if (!this.type)
	            throw new Error('not a function');
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        const action = ['update', this.type, name, '--patch=' + JSON.stringify(json)].concat(flags);
	        return this.command(action, done);
	    }
	    rollingUpdateByFile(name, filepath, flags, done) {
	        if (this.type !== 'replicationcontrollers')
	            throw new Error('not a function');
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        const action = ['rolling-update', name, '-f', filepath, '--update-period=0s'].concat(flags);
	        return this.command(action, done);
	    }
	    rollingUpdate(name, image, flags, done) {
	        if (this.type !== 'replicationcontrollers')
	            throw new Error('not a function');
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        const action = ['rolling-update', name, '--image=' + image, '--update-period=0s'].concat(flags);
	        return this.command(action, done);
	    }
	    scale(name, replicas, flags, done) {
	        if (this.type !== 'replicationcontrollers' && this.type !== 'deployments')
	            throw new Error('not a function');
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        const action = ['scale', '--replicas=' + replicas, this.type, name].concat(flags);
	        return this.command(action, done);
	    }
	    logs(name, flags, done) {
	        if (this.type !== 'pods')
	            throw new Error('not a function');
	        var action = new Array('logs');
	        if (name.indexOf(' ') > -1) {
	            var names = name.split(/ /);
	            action.push(names[0]);
	            action.push(names[1]);
	        }
	        else {
	            action.push(name);
	        }
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        return this.command(action.concat(flags), done);
	    }
	    describe(name, flags, done) {
	        if (!this.type)
	            throw new Error('not a function');
	        var action = new Array('describe', this.type);
	        if (name === null) {
	            action.push(name);
	        }
	        if (_.isFunction(flags)) {
	            done = flags;
	            flags = null;
	        }
	        flags = flags || [];
	        return this.command(action.concat(flags), done);
	    }
	    portForward(name, portString, done) {
	        if (this.type !== 'pods')
	            throw new Error('not a function');
	        var action = new Array('port-forward', name, portString);
	        return this.command(action, done);
	    }
	    useContext(context, done) {
	        var action = new Array('config', 'use-context', context);
	        return this.command(action, done);
	    }
	    viewContext(done) {
	        var action = new Array('config', '--output=json', 'view');
	        this.command(action, done);
	    }
	}
	module.exports = (conf) => {
	    return {
	        // short names are just aliases to longer names
	        pod: new Kubectl('pods', conf),
	        po: new Kubectl('pods', conf),
	        replicationcontroller: new Kubectl('replicationcontrollers', conf),
	        rc: new Kubectl('replicationcontrollers', conf),
	        service: new Kubectl('services', conf),
	        svc: new Kubectl('services', conf),
	        node: new Kubectl('nodes', conf),
	        no: new Kubectl('nodes', conf),
	        namespace: new Kubectl('namespaces', conf),
	        ns: new Kubectl('namespaces', conf),
	        deployment: new Kubectl('deployments', conf),
	        daemonset: new Kubectl('daemonsets', conf),
	        ds: new Kubectl('daemonsets', conf),
	        secrets: new Kubectl('secrets', conf),
	        endpoint: new Kubectl('endpoints', conf),
	        ep: new Kubectl('endpoints', conf),
	        ingress: new Kubectl('ingress', conf),
	        ing: new Kubectl('ingress', conf),
	        job: new Kubectl('job', conf),
	        command: function () {
	            arguments[0] = arguments[0].split(' ');
	            return this.pod.command.apply(this.pod, arguments);
	        }
	    };
	};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = require("child_process");

/***/ })
/******/ ])));