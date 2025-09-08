import 'dart:convert';
import 'package:smvp_dart/smvp.dart';
import 'package:http/http.dart' as http;
import 'package:meta/meta.dart';

@immutable
base class Jsonip extends BaseModel {
  final String ip;

  const Jsonip({required this.ip}) : super(id: ip);

  @override
  Jsonip clone() => Jsonip(ip: ip);

  @override
  Map<String, dynamic> toMap() {
    return {"ip": ip};
  }

  @override
  String toString() {
    return "Jsonip(id: $id, "
        "ip: $ip)";
  }
}

@immutable
base class ListJsonip<T extends Jsonip> extends BaseListModel<T> {
  const ListJsonip({required super.listModel});

  @override
  ListJsonip<T> clone() {
    final List<T> newListModel = List.empty(growable: true);
    for (final T itemModel in listModel) {
      newListModel.add(itemModel.clone() as T);
    }
    return ListJsonip<T>(listModel: newListModel);
  }

  @override
  List<Map<String, dynamic>> toListMap() {
    final List<Map<String, dynamic>> listMap = List.empty(growable: true);
    for (final T itemModel in listModel) {
      listMap.add(itemModel.toMap());
    }
    return listMap;
  }

  @override
  String toString() {
    String str = "\n";
    for (final T itemModel in listModel) {
      str += "$itemModel,\n";
    }
    return "ListJsonip(listModel: [$str])";
  }
}

@immutable
base class JsonipWrapper extends BaseModelWrapper {
  const JsonipWrapper({required super.map});

  @override
  Jsonip fromMap() {
    return Jsonip(ip: map["ip"]);
  }
}

@immutable
base class ListJsonipWrapper extends BaseListModelWrapper {
  const ListJsonipWrapper({required super.listMap});

  @override
  ListJsonip fromListMap() {
    final List<Jsonip> listModel = List.empty(growable: true);
    for (final Map<String, dynamic> itemMap in listMap) {
      final modelWrapper = JsonipWrapper(map: itemMap);
      listModel.add(modelWrapper.fromMap());
    }
    return ListJsonip(listModel: listModel);
  }
}

abstract class BaseHttpClientService {
  const BaseHttpClientService();

  http.Client? getHttpClient();
}

final class DefaultHttpClientService extends BaseHttpClientService {
  static final DefaultHttpClientService instance = DefaultHttpClientService._();
  http.Client? _httpClient;

  DefaultHttpClientService._();

  @override
  http.Client? getHttpClient() {
    if (_httpClient != null) {
      return _httpClient;
    }
    _httpClient = http.Client();
    return _httpClient;
  }
}

@immutable
base class JsonipWrapperRepository<T extends JsonipWrapper,
    Y extends ListJsonipWrapper> extends BaseModelWrapperRepository {
  @protected
  final BaseHttpClientService baseHttpClientService;

  const JsonipWrapperRepository({required this.baseHttpClientService});

  @override
  void dispose() {}

  Future<ResultModelWrapper<T>> getJsonipFromHttpClientService() async {
    try {
      final response = await baseHttpClientService
          .getHttpClient()
          ?.get(Uri.parse("https://jsonip.com"));
      if (response?.statusCode != 200) {
        throw NetworkException.fromSourceAndKeyAndStatusCode(
            source: this,
            key: response?.statusCode.toString() ?? "",
            statusCode: response?.statusCode ?? 0);
      }
      final Map<String, dynamic> responseMap = jsonDecode(response?.body ?? "");
      final String ip = getSafeValue<String>(responseMap, "ip", "");
      final Map<String, dynamic> map = {"ip": ip};
      return ResultModelWrapper.success(JsonipWrapper(map: map) as T);
    } on NetworkException catch (e) {
      return ResultModelWrapper.exception(e);
    } catch (e) {
      return ResultModelWrapper.exception(LocalException(
          source: this,
          key: "unknown",
          guilty: EnumGuilty.device,
          message: e.toString()));
    }
  }
}

enum EnumMainView { isLoading, exception, success }

final class MainView extends BaseView<EnumMainView> {
  // Final variables
  final _jsonipWrapperRepository = JsonipWrapperRepository(
      baseHttpClientService: DefaultHttpClientService.instance);
  final _shareProxy = ShareProxy();

  // Not final variables
  bool _isLoading = true;
  Jsonip _jsonip = Jsonip(ip: "");

  @override
  EnumMainView getViewState() {
    if (_isLoading) {
      return EnumMainView.isLoading;
    }
    if (exceptionAdapter.hasException()) {
      return EnumMainView.exception;
    }
    return EnumMainView.success;
  }

  @override
  void dispose() {
    _jsonipWrapperRepository.dispose();
    _shareProxy.deleteListenersByListenerId([]);
  }

  Future<void> init() async {
    final resultJsonip =
        await _jsonipWrapperRepository.getJsonipFromHttpClientService();
    final hasException = resultJsonip.exceptionAdapter.hasException();
    if (hasException) {
      _a0QQInitQQHasException(resultJsonip.exceptionAdapter);
      return;
    }
    _isLoading = false;
    _jsonip = resultJsonip.data!.fromMap();
    _build();
  }

  void _build() {
    switch (getViewState()) {
      case EnumMainView.isLoading:
        debugPrint("Build: IsLoading");
        break;
      case EnumMainView.exception:
        debugPrint("Build: Exception(${exceptionAdapter.getKey()})");
        break;
      case EnumMainView.success:
        debugPrint("Build: Success($_jsonip)");
        break;
    }
  }

  void _a0QQInitQQHasException(ExceptionAdapter exceptionAdapter) {
    debugPrintMethod("_a0QQInitQQHasException");
    _isLoading = false;
    this.exceptionAdapter = exceptionAdapter;
    _build();
  }
}

Future<void> main() async {
  final mainView = MainView();
  await mainView.init();
  mainView.dispose();
}
// Build: Success(Jsonip(id: {your_ip}, ip: {your_ip}))

// OR

// ===start_to_trace_exception===
//
// Source: JsonipWrapperRepository<JsonipWrapper, ListJsonipWrapper>
// Type: {type}
// toString(): {toString()}
//
// ===end_to_trace_exception===
//
// [Method] _a0QQInitQQHasException
// Build: Exception({exceptionAdapter.getKey()})
