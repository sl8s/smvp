import { v4 as uuidv4 } from "uuid";

export abstract class BaseArrayModelWrapper {
    protected readonly arrayMap: Array<Record<string,any>>;
    
    protected constructor(arrayMap: Array<Record<string,any>>) {
        this.arrayMap = arrayMap;
    }

    public abstract fromArrayMap(): BaseArrayModel<BaseModel>;
}

export abstract class BaseArrayModel<T extends BaseModel> {
    public readonly arrayModel: Array<T>;

    protected constructor(arrayModel: Array<T>) {
        this.arrayModel = arrayModel;
    }

    public abstract clone(): BaseArrayModel<T>;

    public abstract toArrayMap(): Array<Record<string,any>>;

    public abstract toString(): string;

    public add(newModel: T): void {
        this.arrayModel.push(newModel);
    }

    public updateById(newModel: T): void {
        const index: number = this.arrayModel.findIndex((itemModel) => itemModel.id === newModel.id);
        if(index === -1) {
            return;
        }
        this.arrayModel.splice(index,1,newModel);
    }

    public deleteById(id: string): void {
        const index: number = this.arrayModel.findIndex((itemModel) => itemModel.id === id);
        if(index === -1) {
            return;
        }
        this.arrayModel.splice(index,1);
    }

    public addFromArray(newArrayModel: Array<T>): void {
        this.arrayModel.push(...newArrayModel);
    }

    public updateFromArrayById(newArrayModel: Array<T>): void {
        for(const newItemModel of newArrayModel) {
            const index: number = this.arrayModel.findIndex((itemModel) => itemModel.id === newItemModel.id);
            if(index === -1) {
                continue;
            }
            this.arrayModel.splice(index,1,newItemModel);
        }
    }

    public deleteFromArrayById(arrayId: Array<string>): void {
        for(const itemId of arrayId) {
            const index = this.arrayModel.findIndex((itemModel) => itemModel.id === itemId);
            if(index === -1) {
                continue;
            }
            this.arrayModel.splice(index,1);
        }
    }
}

export abstract class BaseModelWrapperRepository implements IDispose {
    protected constructor() {
    }
    
    public abstract dispose(): void;

    protected getSafeValue<T>(map: Map<string,any> | Record<string,any>, key: string, defaultValue: T): T {
        if (map instanceof Map) {
            return map.has(key) ? map.get(key) : defaultValue;
        }
        return map[key] ?? defaultValue;
    }
}

export abstract class BaseModelWrapper {
    protected readonly map: Record<string,any>;

    protected constructor(map: Record<string,any>) {
        this.map = map;
    }
    
    public abstract fromMap(): BaseModel;
}

export abstract class BaseModel {
    public readonly id: string;
    
    protected constructor(id: string) {
        this.id = id;
    }

    public abstract clone(): BaseModel;

    public abstract toMap(): Record<string,any>;

    public abstract toString(): string;
}

export class IterationService {
    public static readonly instance = new IterationService();

    private readonly arrayUuid: Array<string>;

    private constructor() {
        this.arrayUuid = new Array<string>();
    }

    public next(): string {
        const uuid = uuidv4();
        for(const itemUuid of this.arrayUuid) {
            if(itemUuid === uuid) {
                return this.next();
            }
        }
        this.arrayUuid.push(uuid);
        return uuid;
    }
}

export class ShareProxy {
    private readonly listenerId: string;
    private readonly shareService: ShareService;

    public constructor() {
        this.listenerId = IterationService.instance.next();
        this.shareService = ShareService.instance;
    }

    public getValue<T>(key: string, defaultValue: T): T {
        return this.shareService.getValue<T>(key,defaultValue);
    }

    public update(key: string, value: any): void {
        this.shareService.update(key,value);
    }

    public delete(key: string): void {
        this.shareService.delete(key);
    }

    public addListener(key: string, callback: (event: any) => void): void {
        this.shareService.addListener(key, this.listenerId, callback);
    }

    public notifyListener(key: string, value: any): void {
        this.shareService.notifyListener(key, this.listenerId, value);
    }

    public notifyListeners(key: string, value: any): void {
        this.shareService.notifyListeners(key, value);
    }

    public deleteAllListenersByKey(key: string): void {
        this.shareService.deleteAllListenersByKey(key);
    }

    public deleteAllListenersByArrayKey(arrayKey: Array<string>): void {
        this.shareService.deleteAllListenersByArrayKey(arrayKey);
    }

    public deleteListenerByListenerId(key: string): void {
        this.shareService.deleteListenerByListenerId(key, this.listenerId);
    }

    public deleteListenersByListenerId(arrayKey: Array<string>): void {
        this.shareService.deleteListenersByListenerId(arrayKey, this.listenerId);
    }
}

export class ShareService {
    public static readonly instance = new ShareService();
    
    private readonly cache: Record<string,any>;
    private readonly listenersByKey: Record<string, Record<string, (event: any) => void>>;

    private constructor() {
        this.cache = {};
        this.listenersByKey = {};
    }

    public getValue<T>(key: string, defaultValue: T): T {
        if(!(key in this.cache)) {
            return defaultValue;
        }
        return this.cache[key];
    }

    public update(key: string, value: any): void {
        this.cache[key] = value;
    }

    public delete(key: string): void {
        delete this.cache[key];
    }

    public addListener(key: string, listenerId: string, callback: (event: any) => void): void {
        if(!(key in this.listenersByKey)) {
            this.listenersByKey[key] = {};
            this.listenersByKey[key][listenerId] = callback;
            return;
        }
        if(listenerId in this.listenersByKey[key]) {
            throw new LocalException(
                "ShareService",
                 key + "--" + listenerId,
                EnumGuilty.developer,
                "Under such a key and listenerId there already exists a listener: " + key + "--" + listenerId);
        }
        this.listenersByKey[key][listenerId] = callback;
    }

    public notifyListener(key: string, listenerId: string, value: any): void {
        if(!(key in this.listenersByKey)) {
            return;
        }
        if(!(listenerId in this.listenersByKey[key])) {
            return;
        }
        this.listenersByKey[key][listenerId](value);
    }

    public notifyListeners(key: string, value: any): void {
        if(!(key in this.listenersByKey)) {
            return;
        }
        for(const callback of Object.values(this.listenersByKey[key] ?? {})) {
            callback(value);
        }
    }

    public deleteAllListenersByKey(key: string): void {
        delete this.listenersByKey[key];
    }

    public deleteAllListenersByArrayKey(arrayKey: Array<string>): void {
        for(const itemKey of arrayKey) {
            delete this.listenersByKey[itemKey];
        }
    }

    public deleteListenerByListenerId(key: string, listenerId: string): void {
        delete this.listenersByKey[key][listenerId];
    }

    public deleteListenersByListenerId(arrayKey: Array<string>, listenerId: string): void {
        for(const itemKey of arrayKey) {
            delete this.listenersByKey[itemKey][listenerId];
        }
    }
}

export abstract class BaseView<T extends string | number> implements IDispose {
    protected exceptionAdapter: ExceptionAdapter;

    protected constructor() {
        this.exceptionAdapter = new ExceptionAdapter(null);
    }

    public abstract getViewState(): T;

    public abstract dispose(): void;
}

export abstract class BaseException extends Error {
    public readonly key: string;
    private readonly source: string;
    private readonly type: string;

    protected constructor(source: string, type: string, key: string) {
        super();
        this.source = source;
        this.type = type;
        this.key = key;
        this.name = this.constructor.name;
    }

    public abstract toString(): string;
       
    protected initException(): void {
        this.message = this.toString();
        this.debugPrintException();
    }

    private debugPrintException(): void {
        debugPrintException("\n===start_to_trace_exception===\n");
        debugPrintException("Source: " + this.source);
        debugPrintException("Type: " + this.type);
        debugPrintException("toString(): " + this.toString());
        debugPrintException("\n===end_to_trace_exception===\n");
    }
}

export enum EnumGuilty {
    developer = "developer",
    device = "device",
    user = "user"
}

export class ExceptionAdapter {
    private readonly exception: BaseException | null;

    public constructor(exception: BaseException | null) {
        this.exception = exception;
    }

    public getKey(): string {
        return this.exception?.key ?? "";
    }

    public hasException(): boolean {
        return this.exception != null;
    }
}

export interface IDispose {
    dispose(): void;
}

export class LocalException extends BaseException {
    public readonly guilty: EnumGuilty;
    public readonly extraMessage: string;
    
    public constructor(source: string, key: string, guilty: EnumGuilty, extraMessage: string) {
        super(source,"LocalException",key);
        this.guilty = guilty;
        this.extraMessage = extraMessage;
        this.initException();
    }

    public override toString(): string {
        return "LocalException(key: " + this.key + ", " + 
            "guilty: " + this.guilty + ", " + 
            "extraMessage: " + this.extraMessage + ")";
    }
}

export class NetworkException extends BaseException {
    public readonly statusCode: number;
    public readonly nameStatusCode: string;
    public readonly descriptionStatusCode: string;

    public constructor(source: string, key: string, statusCode: number, nameStatusCode: string, descriptionStatusCode: string) {
        super(source,"NetworkException",key);
        this.statusCode = statusCode;
        this.nameStatusCode = nameStatusCode;
        this.descriptionStatusCode = descriptionStatusCode;
        this.initException();
    }

    public static fromSourceAndKeyAndStatusCode(source: string, key: string, statusCode: number): NetworkException {
        switch(statusCode) {
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
                return new NetworkException(source, key, 405, "405 Method Not Allowed","The method specified in the Request-Line is not allowed for the resource identified by the Request-URI.");
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

    public override toString(): string {
        return "NetworkException(key: " + this.key + ", " +
            "statusCode: " + this.statusCode + ", " +
            "nameStatusCode: " + this.nameStatusCode + ", " +
            "descriptionStatusCode: " + this.descriptionStatusCode + ")";
    }
}

export class ResultArrayModelWrapper<T extends BaseArrayModelWrapper> {
    public readonly data: T | null;
    public readonly exceptionAdapter: ExceptionAdapter;

    private constructor(data: T | null, exceptionAdapter: ExceptionAdapter) {
        this.data = data;
        this.exceptionAdapter = exceptionAdapter;
    }

    public static success<Y extends BaseArrayModelWrapper>(data: Y): ResultArrayModelWrapper<Y> {
        return new ResultArrayModelWrapper<Y>(data, new ExceptionAdapter(null));
    }

    public static exception<Y extends BaseArrayModelWrapper>(exception: BaseException): ResultArrayModelWrapper<Y> {
        return new ResultArrayModelWrapper<Y>(null, new ExceptionAdapter(exception));
    }
}

export class ResultModelWrapper<T extends BaseModelWrapper> {
    public readonly data: T | null;
    public readonly exceptionAdapter: ExceptionAdapter;

    private constructor(data: T | null, exceptionAdapter: ExceptionAdapter) {
        this.data = data;
        this.exceptionAdapter = exceptionAdapter;
    }

    public static success<Y extends BaseModelWrapper>(data: Y): ResultModelWrapper<Y> {
        return new ResultModelWrapper<Y>(data, new ExceptionAdapter(null));
    }

    public static exception<Y extends BaseModelWrapper>(exception: BaseException): ResultModelWrapper<Y> {
        return new ResultModelWrapper<Y>(null, new ExceptionAdapter(exception));
    }
}

export class Result {
    public readonly exceptionAdapter: ExceptionAdapter;

    private constructor(exceptionAdapter: ExceptionAdapter) {
        this.exceptionAdapter = exceptionAdapter;
    }

    public static success(): Result {
        return new Result(new ExceptionAdapter(null));
    }

    public static exception(exception: BaseException): Result {
        return new Result(new ExceptionAdapter(exception));
    }
}

export function debugPrint(text: string): void {
    console.log(text);
}

export function debugPrintException(text: string): void {
    debugPrint("\x1B[31m" + text +"\x1b[0m");
}

export function debugPrintMethod(methodName: string): void {
    debugPrint("\x1B[36m[Method] " + methodName +"\x1b[0m");
}
