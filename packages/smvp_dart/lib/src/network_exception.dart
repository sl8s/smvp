import "package:meta/meta.dart";
import "package:smvp_dart/src/base_exception.dart";

@immutable
final class NetworkException extends BaseException {
  final int statusCode;
  final String nameStatusCode;
  final String descriptionStatusCode;

  NetworkException(
      {required super.source,
      required super.key,
      required this.statusCode,
      required this.nameStatusCode,
      required this.descriptionStatusCode})
      : super(type: NetworkException);

  factory NetworkException.fromSourceAndKeyAndStatusCode(
      {required Object source, required String key, required int statusCode}) {
    switch (statusCode) {
      case 201:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 201,
            nameStatusCode: "201 Created",
            descriptionStatusCode:
                "The request has been fulfilled and resulted in a new resource being created.");
      case 202:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 202,
            nameStatusCode: "202 Accepted",
            descriptionStatusCode:
                "The request has been accepted for processing, but the processing has not been completed.");
      case 203:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 203,
            nameStatusCode: "203 Non-Authoritative Information",
            descriptionStatusCode:
                "The returned metaInformation in the entity-header is not the definitive set as available from the origin server, but is gathered from a local or a third-party copy.");
      case 204:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 204,
            nameStatusCode: "204 No Content",
            descriptionStatusCode:
                "The server has fulfilled the request but does not need to return an entity-body, and might want to return updated metaInformation.");
      case 205:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 205,
            nameStatusCode: "205 Reset Content",
            descriptionStatusCode:
                "The server has fulfilled the request and the user agent SHOULD reset the document view which caused the request to be sent.");
      case 206:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 206,
            nameStatusCode: "206 Partial Content",
            descriptionStatusCode:
                "The server has fulfilled the partial GET request for the resource.");
      case 300:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 300,
            nameStatusCode: "300 Multiple Choices",
            descriptionStatusCode:
                "User (or user agent) can select a preferred representation and redirect its request to that location.");
      case 301:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 301,
            nameStatusCode: "301 Moved Permanently",
            descriptionStatusCode:
                "The requested resource has been assigned a new permanent URI and any future references to this resource SHOULD use one of the returned URIs.");
      case 302:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 302,
            nameStatusCode: "302 Found",
            descriptionStatusCode:
                "The requested resource resides temporarily under a different URI.");
      case 303:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 303,
            nameStatusCode: "303 See Other",
            descriptionStatusCode:
                "The response to the request can be found under a different URI and SHOULD be retrieved using a GET method on that resource.");
      case 304:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 304,
            nameStatusCode: "304 Not Modified",
            descriptionStatusCode:
                "If the client has performed a conditional GET request and access is allowed, but the document has not been modified, the server SHOULD respond with this status code.");
      case 305:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 305,
            nameStatusCode: "305 Use Proxy",
            descriptionStatusCode:
                "The requested resource MUST be accessed through the proxy given by the Location field.");
      case 307:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 307,
            nameStatusCode: "307 Temporary Redirect",
            descriptionStatusCode:
                "The requested resource resides temporarily under a different URI.");
      case 400:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 400,
            nameStatusCode: "400 Bad Request",
            descriptionStatusCode:
                "The request could not be understood by the server due to malformed syntax.");
      case 401:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 401,
            nameStatusCode: "401 Unauthorized",
            descriptionStatusCode: "The request requires user authentication.");
      case 403:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 403,
            nameStatusCode: "403 Forbidden",
            descriptionStatusCode:
                "The server understood the request, but is refusing to fulfill it.");
      case 404:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 404,
            nameStatusCode: "404 Not Found",
            descriptionStatusCode:
                "The server has not found anything matching the Request-URI.");
      case 405:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 405,
            nameStatusCode: "405 Method Not Allowed",
            descriptionStatusCode:
                "The method specified in the Request-Line is not allowed for the resource identified by the Request-URI.");
      case 406:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 406,
            nameStatusCode: "406 Not Acceptable",
            descriptionStatusCode:
                "The resource identified by the request is only capable of generating response entities which have content characteristics not acceptable according to the accept headers sent in the request.");
      case 407:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 407,
            nameStatusCode: "407 Proxy Authentication Required",
            descriptionStatusCode:
                "This code is similar to 401 (Unauthorized), but indicates that the client must first authenticate itself with the proxy.");
      case 408:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 408,
            nameStatusCode: "408 Request Timeout",
            descriptionStatusCode:
                "The client did not produce a request within the time that the server was prepared to wait.");
      case 409:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 409,
            nameStatusCode: "409 Conflict",
            descriptionStatusCode:
                "The request could not be completed due to a conflict with the current state of the resource.");
      case 410:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 410,
            nameStatusCode: "410 Gone",
            descriptionStatusCode:
                "The requested resource is no longer available at the server and no forwarding address is known.");
      case 411:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 411,
            nameStatusCode: "411 Length Required",
            descriptionStatusCode:
                "The server refuses to accept the request without a defined Content- Length.");
      case 412:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 412,
            nameStatusCode: "412 Precondition Failed",
            descriptionStatusCode:
                "The precondition given in one or more of the request-header fields evaluated to false when it was tested on the server.");
      case 413:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 413,
            nameStatusCode: "413 Request Entity Too Large",
            descriptionStatusCode:
                "The server is refusing to process a request because the request entity is larger than the server is willing or able to process.");
      case 414:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 414,
            nameStatusCode: "414 Request-URI Too Long",
            descriptionStatusCode:
                "The server is refusing to service the request because the Request-URI is longer than the server is willing to interpret.");
      case 415:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 415,
            nameStatusCode: "415 Unsupported Media Type",
            descriptionStatusCode:
                "The server is refusing to service the request because the entity of the request is in a format not supported by the requested resource for the requested method.");
      case 416:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 416,
            nameStatusCode: "416 Requested Range Not Satisfiable",
            descriptionStatusCode:
                "A server SHOULD return a response with this status code if a request included a Range request-header field (section 14.35), and none of the range-specifier values in this field overlap the current extent of the selected resource, and the request did not include an If-Range request-header field.");
      case 417:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 417,
            nameStatusCode: "417 Expectation Failed",
            descriptionStatusCode:
                "The expectation given in an Expect request-header field (see section 14.20) could not be met by this server.");
      case 500:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 500,
            nameStatusCode: "500 Internal Server Error",
            descriptionStatusCode:
                "The server encountered an unexpected condition which prevented it from fulfilling the request.");
      case 501:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 501,
            nameStatusCode: "501 Not Implemented",
            descriptionStatusCode:
                "The server does not support the functionality interface_function_view_model to fulfill the request.");
      case 502:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 502,
            nameStatusCode: "502 Bad Gateway",
            descriptionStatusCode:
                "The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.");
      case 503:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 503,
            nameStatusCode: "503 Service Unavailable",
            descriptionStatusCode:
                "The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.");
      case 504:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 504,
            nameStatusCode: "504 Gateway Timeout",
            descriptionStatusCode:
                "The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI.");
      case 505:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 505,
            nameStatusCode: "505 HTTP Version Not Supported",
            descriptionStatusCode:
                "The server does not support, or refuses to support, the HTTP protocol version that was used in the request message.");
      default:
        return NetworkException(
            source: source,
            key: key,
            statusCode: 0,
            nameStatusCode: "unknown",
            descriptionStatusCode: "unknown");
    }
  }

  @override
  String toString() {
    return "NetworkException(key: $key, "
        "statusCode: $statusCode, "
        "nameStatusCode: $nameStatusCode, "
        "descriptionStatusCode: $descriptionStatusCode)";
  }
}
