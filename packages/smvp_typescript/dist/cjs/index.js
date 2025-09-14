"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = exports.ResultModelWrapper = exports.ResultArrayModelWrapper = exports.NetworkException = exports.LocalException = exports.ExceptionAdapter = exports.EnumGuilty = exports.BaseException = exports.BaseView = exports.ShareService = exports.ShareProxy = exports.IterationService = exports.BaseModel = exports.BaseModelWrapper = exports.BaseModelWrapperRepository = exports.BaseModelIterator = exports.BaseArrayModel = exports.BaseArrayModelWrapper = void 0;
exports.debugPrint = debugPrint;
exports.debugPrintException = debugPrintException;
exports.debugPrintMethod = debugPrintMethod;
class BaseArrayModelWrapper {
    arrayMap;
    constructor(arrayMap) {
        this.arrayMap = arrayMap;
    }
}
exports.BaseArrayModelWrapper = BaseArrayModelWrapper;
class BaseArrayModel {
    arrayModel;
    constructor(arrayModel) {
        this.arrayModel = arrayModel;
    }
    sortUsingIterator(baseModelIterator) {
        if (this.arrayModel.length <= 0) {
            return;
        }
        baseModelIterator.setArrayModel(this.arrayModel.map((itemModel) => itemModel.clone()));
        this.arrayModel.splice(0, this.arrayModel.length);
        while (baseModelIterator.hasNext()) {
            this.arrayModel.push(baseModelIterator.next().clone());
        }
    }
    add(newModel) {
        this.arrayModel.push(newModel);
    }
    updateById(newModel) {
        const index = this.arrayModel.findIndex((itemModel) => itemModel.id == newModel.id);
        if (index == -1) {
            return;
        }
        this.arrayModel.splice(index, 1, newModel);
    }
    deleteById(id) {
        const index = this.arrayModel.findIndex((itemModel) => itemModel.id == id);
        if (index == -1) {
            return;
        }
        this.arrayModel.splice(index, 1);
    }
    addFromArray(newArrayModel) {
        this.arrayModel.push(...newArrayModel);
    }
    updateFromArrayById(newArrayModel) {
        for (const newItemModel of newArrayModel) {
            const index = this.arrayModel.findIndex((itemModel) => itemModel.id == newItemModel.id);
            if (index == -1) {
                continue;
            }
            this.arrayModel.splice(index, 1, newItemModel);
        }
    }
    deleteFromArrayById(arrayId) {
        for (const itemId of arrayId) {
            const index = this.arrayModel.findIndex((itemModel) => itemModel.id == itemId);
            if (index == -1) {
                continue;
            }
            this.arrayModel.splice(index, 1);
        }
    }
}
exports.BaseArrayModel = BaseArrayModel;
class BaseModelIterator {
    arrayModel;
    index;
    constructor(index) {
        this.arrayModel = new Array();
        this.index = index;
    }
    setArrayModel(arrayModel) {
        this.arrayModel = arrayModel;
    }
}
exports.BaseModelIterator = BaseModelIterator;
class BaseModelWrapperRepository {
    constructor() {
    }
    getSafeValue(map, key, defaultValue) {
        if (!map.has(key)) {
            return defaultValue;
        }
        return map.get(key);
    }
}
exports.BaseModelWrapperRepository = BaseModelWrapperRepository;
class BaseModelWrapper {
    map;
    constructor(map) {
        this.map = map;
    }
}
exports.BaseModelWrapper = BaseModelWrapper;
class BaseModel {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.BaseModel = BaseModel;
class IterationService {
    static instance = new IterationService();
    number;
    constructor() {
        this.number = -1;
    }
    next() {
        this.number++;
        return this.number;
    }
}
exports.IterationService = IterationService;
class ShareProxy {
    listenerId;
    shareService;
    constructor() {
        this.listenerId = IterationService.instance.next();
        this.shareService = ShareService.instance;
    }
    getValue(key, defaultValue) {
        return this.shareService.getValue(key, defaultValue);
    }
    update(key, value) {
        this.shareService.update(key, value);
    }
    delete(key) {
        this.shareService.delete(key);
    }
    addListener(key, callback) {
        this.shareService.addListener(key, this.listenerId, callback);
    }
    notifyListener(key, value) {
        this.shareService.notifyListener(key, this.listenerId, value);
    }
    notifyListeners(key, value) {
        this.shareService.notifyListeners(key, value);
    }
    deleteAllListenersByKey(key) {
        this.shareService.deleteAllListenersByKey(key);
    }
    deleteAllListenersByArrayKey(arrayKey) {
        this.shareService.deleteAllListenersByArrayKey(arrayKey);
    }
    deleteListenerByListenerId(key) {
        this.shareService.deleteListenerByListenerId(key, this.listenerId);
    }
    deleteListenersByListenerId(arrayKey) {
        this.shareService.deleteListenersByListenerId(arrayKey, this.listenerId);
    }
}
exports.ShareProxy = ShareProxy;
class ShareService {
    static instance = new ShareService();
    cache;
    listenersByKey;
    constructor() {
        this.cache = {};
        this.listenersByKey = {};
    }
    getValue(key, defaultValue) {
        if (!(key in this.cache)) {
            return defaultValue;
        }
        return this.cache[key];
    }
    update(key, value) {
        this.cache[key] = value;
    }
    delete(key) {
        delete this.cache[key];
    }
    addListener(key, listenerId, callback) {
        if (!(key in this.listenersByKey)) {
            this.listenersByKey[key] = {};
            this.listenersByKey[key][listenerId] = callback;
            return;
        }
        if (listenerId in this.listenersByKey[key]) {
            throw new LocalException("ShareService", key + "--" + listenerId, EnumGuilty.developer, "Under such a key and number there already exists a listener: " + key + "--" + listenerId);
        }
        this.listenersByKey[key][listenerId] = callback;
    }
    notifyListener(key, listenerId, value) {
        if (!(key in this.listenersByKey)) {
            return;
        }
        if (!(listenerId in this.listenersByKey[key])) {
            return;
        }
        this.listenersByKey[key][listenerId](value);
    }
    notifyListeners(key, value) {
        if (!(key in this.listenersByKey)) {
            return;
        }
        for (const callback of Object.values(this.listenersByKey[key] ?? {})) {
            callback(value);
        }
    }
    deleteAllListenersByKey(key) {
        delete this.listenersByKey[key];
    }
    deleteAllListenersByArrayKey(arrayKey) {
        for (const itemKey of arrayKey) {
            delete this.listenersByKey[itemKey];
        }
    }
    deleteListenerByListenerId(key, listenerId) {
        delete this.listenersByKey[key][listenerId];
    }
    deleteListenersByListenerId(arrayKey, listenerId) {
        for (const itemKey of arrayKey) {
            delete this.listenersByKey[itemKey][listenerId];
        }
    }
}
exports.ShareService = ShareService;
class BaseView {
    exceptionAdapter;
    constructor() {
        this.exceptionAdapter = new ExceptionAdapter(null);
    }
}
exports.BaseView = BaseView;
class BaseException extends Error {
    key;
    source;
    type;
    constructor(source, type, key) {
        super();
        this.source = source;
        this.type = type;
        this.key = key;
        this.name = this.constructor.name;
    }
    initException() {
        this.message = this.toString();
        this.debugPrintException();
    }
    debugPrintException() {
        debugPrintException("\n===start_to_trace_exception===\n");
        debugPrintException("Source: " + this.source);
        debugPrintException("Type: " + this.type);
        debugPrintException("toString(): " + this.toString());
        debugPrintException("\n===end_to_trace_exception===\n");
    }
}
exports.BaseException = BaseException;
var EnumGuilty;
(function (EnumGuilty) {
    EnumGuilty["developer"] = "developer";
    EnumGuilty["device"] = "device";
    EnumGuilty["user"] = "user";
})(EnumGuilty || (exports.EnumGuilty = EnumGuilty = {}));
class ExceptionAdapter {
    exception;
    constructor(exception) {
        this.exception = exception;
    }
    getKey() {
        return this.exception?.key ?? "";
    }
    hasException() {
        return this.exception != null;
    }
}
exports.ExceptionAdapter = ExceptionAdapter;
class LocalException extends BaseException {
    guilty;
    extraMessage;
    constructor(source, key, guilty, extraMessage) {
        super(source, "LocalException", key);
        this.guilty = guilty;
        this.extraMessage = extraMessage;
        this.initException();
    }
    toString() {
        return "LocalException(key: " + this.key + ", " +
            "guilty: " + this.guilty + ", " +
            "extraMessage: " + this.extraMessage + ")";
    }
}
exports.LocalException = LocalException;
class NetworkException extends BaseException {
    statusCode;
    nameStatusCode;
    descriptionStatusCode;
    constructor(source, key, statusCode, nameStatusCode, descriptionStatusCode) {
        super(source, "NetworkException", key);
        this.statusCode = statusCode;
        this.nameStatusCode = nameStatusCode;
        this.descriptionStatusCode = descriptionStatusCode;
        this.initException();
    }
    static fromSourceAndKeyAndStatusCode(source, key, statusCode) {
        switch (statusCode) {
            case 201:
                return new NetworkException(source, key, 201, "201 Created", "The request has been fulfilled and resulted in a new resource being created.");
            case 202:
                return new NetworkException(source, key, 202, "202 Accepted", "The request has been accepted for processing, but the processing has not been completed.");
            case 203:
                return new NetworkException(source, key, 203, "203 Non-Authoritative Information", "The returned metaInformation in the entity-header is not the definitive set as available from the origin server, but is gathered from a local or a third-party copy.");
            case 204:
                return new NetworkException(source, key, 204, "204 No Content", "The server has fulfilled the request but does not need to return an entity-body, and might want to return updated metaInformation.");
            case 205:
                return new NetworkException(source, key, 205, "205 Reset Content", "The server has fulfilled the request and the user agent SHOULD reset the document view which caused the request to be sent.");
            case 206:
                return new NetworkException(source, key, 206, "206 Partial Content", "The server has fulfilled the partial GET request for the resource.");
            case 300:
                return new NetworkException(source, key, 300, "300 Multiple Choices", "User (or user agent) can select a preferred representation and redirect its request to that location.");
            case 301:
                return new NetworkException(source, key, 301, "301 Moved Permanently", "The requested resource has been assigned a new permanent URI and any future references to this resource SHOULD use one of the returned URIs.");
            case 302:
                return new NetworkException(source, key, 302, "302 Found", "The requested resource resides temporarily under a different URI.");
            case 303:
                return new NetworkException(source, key, 303, "303 See Other", "The response to the request can be found under a different URI and SHOULD be retrieved using a GET method on that resource.");
            case 304:
                return new NetworkException(source, key, 304, "304 Not Modified", "If the client has performed a conditional GET request and access is allowed, but the document has not been modified, the server SHOULD respond with this status code.");
            case 305:
                return new NetworkException(source, key, 305, "305 Use Proxy", "The requested resource MUST be accessed through the proxy given by the Location field.");
            case 307:
                return new NetworkException(source, key, 307, "307 Temporary Redirect", "The requested resource resides temporarily under a different URI.");
            case 400:
                return new NetworkException(source, key, 400, "400 Bad Request", "The request could not be understood by the server due to malformed syntax.");
            case 401:
                return new NetworkException(source, key, 401, "401 Unauthorized", "The request requires user authentication.");
            case 403:
                return new NetworkException(source, key, 403, "403 Forbidden", "The server understood the request, but is refusing to fulfill it.");
            case 404:
                return new NetworkException(source, key, 404, "404 Not Found", "The server has not found anything matching the Request-URI.");
            case 405:
                return new NetworkException(source, key, 405, "405 Method Not Allowed", "The method specified in the Request-Line is not allowed for the resource identified by the Request-URI.");
            case 406:
                return new NetworkException(source, key, 406, "406 Not Acceptable", "The resource identified by the request is only capable of generating response entities which have content characteristics not acceptable according to the accept headers sent in the request.");
            case 407:
                return new NetworkException(source, key, 407, "407 Proxy Authentication Required", "This code is similar to 401 (Unauthorized), but indicates that the client must first authenticate itself with the proxy.");
            case 408:
                return new NetworkException(source, key, 408, "408 Request Timeout", "The client did not produce a request within the time that the server was prepared to wait.");
            case 409:
                return new NetworkException(source, key, 409, "409 Conflict", "The request could not be completed due to a conflict with the current state of the resource.");
            case 410:
                return new NetworkException(source, key, 410, "410 Gone", "The requested resource is no longer available at the server and no forwarding address is known.");
            case 411:
                return new NetworkException(source, key, 411, "411 Length Required", "The server refuses to accept the request without a defined Content-Length.");
            case 412:
                return new NetworkException(source, key, 412, "412 Precondition Failed", "The precondition given in one or more of the request-header fields evaluated to false when it was tested on the server.");
            case 413:
                return new NetworkException(source, key, 413, "413 Request Entity Too Large", "The server is refusing to process a request because the request entity is larger than the server is willing or able to process.");
            case 414:
                return new NetworkException(source, key, 414, "414 Request-URI Too Long", "The server is refusing to service the request because the Request-URI is longer than the server is willing to interpret.");
            case 415:
                return new NetworkException(source, key, 415, "415 Unsupported Media Type", "The server is refusing to service the request because the entity of the request is in a format not supported by the requested resource for the requested method.");
            case 416:
                return new NetworkException(source, key, 416, "416 Requested Range Not Satisfiable", "A server SHOULD return a response with this status code if a request included a Range request-header field (section 14.35), and none of the range-specifier values in this field overlap the current extent of the selected resource, and the request did not include an If-Range request-header field.");
            case 417:
                return new NetworkException(source, key, 417, "417 Expectation Failed", "The expectation given in an Expect request-header field (see section 14.20) could not be met by this server.");
            case 500:
                return new NetworkException(source, key, 500, "500 Internal Server Error", "The server encountered an unexpected condition which prevented it from fulfilling the request.");
            case 501:
                return new NetworkException(source, key, 501, "501 Not Implemented", "The server does not support the functionality interface_function_view_model to fulfill the request.");
            case 502:
                return new NetworkException(source, key, 502, "502 Bad Gateway", "The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.");
            case 503:
                return new NetworkException(source, key, 503, "503 Service Unavailable", "The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.");
            case 504:
                return new NetworkException(source, key, 504, "504 Gateway Timeout", "The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI.");
            case 505:
                return new NetworkException(source, key, 505, "505 HTTP Version Not Supported", "The server does not support, or refuses to support, the HTTP protocol version that was used in the request message.");
            default:
                return new NetworkException(source, key, 0, "unknown", "unknown");
        }
    }
    toString() {
        return "NetworkException(key: " + this.key + ", " +
            "statusCode: " + this.statusCode + ", " +
            "nameStatusCode: " + this.nameStatusCode + ", " +
            "descriptionStatusCode: " + this.descriptionStatusCode + ")";
    }
}
exports.NetworkException = NetworkException;
class ResultArrayModelWrapper {
    data;
    exceptionAdapter;
    constructor(data, exceptionAdapter) {
        this.data = data;
        this.exceptionAdapter = exceptionAdapter;
    }
    static success(data) {
        return new ResultArrayModelWrapper(data, new ExceptionAdapter(null));
    }
    static exception(exception) {
        return new ResultArrayModelWrapper(null, new ExceptionAdapter(exception));
    }
}
exports.ResultArrayModelWrapper = ResultArrayModelWrapper;
class ResultModelWrapper {
    data;
    exceptionAdapter;
    constructor(data, exceptionAdapter) {
        this.data = data;
        this.exceptionAdapter = exceptionAdapter;
    }
    static success(data) {
        return new ResultModelWrapper(data, new ExceptionAdapter(null));
    }
    static exception(exception) {
        return new ResultModelWrapper(null, new ExceptionAdapter(exception));
    }
}
exports.ResultModelWrapper = ResultModelWrapper;
class Result {
    data;
    exceptionAdapter;
    constructor(data, exceptionAdapter) {
        this.data = data;
        this.exceptionAdapter = exceptionAdapter;
    }
    static success(data) {
        return new Result(data, new ExceptionAdapter(null));
    }
    static exception(exception) {
        return new Result(null, new ExceptionAdapter(exception));
    }
}
exports.Result = Result;
function debugPrint(text) {
    console.log(text);
}
function debugPrintException(text) {
    debugPrint("\x1B[31m" + text + "\x1b[0m");
}
function debugPrintMethod(methodName) {
    debugPrint("\x1B[36m[Method] " + methodName + "\x1b[0m");
}
