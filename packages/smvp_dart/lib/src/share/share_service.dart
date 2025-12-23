import 'package:meta/meta.dart';
import 'package:smvp_dart/src/enum_guilty.dart';
import 'package:smvp_dart/src/local_exception.dart';

@immutable
final class ShareService {
  static final ShareService instance = ShareService._();

  final Map<String, dynamic> _cache;
  final Map<String, Map<String, void Function(dynamic event)>> _listenersByKey;

  ShareService._()
      : _cache = {},
        _listenersByKey = {};

  T getValue<T>(String key, T defaultValue) {
    if (!_cache.containsKey(key)) {
      return defaultValue;
    }
    return _cache[key];
  }

  void update(String key, dynamic value) {
    _cache[key] = value;
  }

  void delete(String key) {
    _cache.remove(key);
  }

  void addListener(
      String key, String listenerId, void Function(dynamic event) callback) {
    if (!_listenersByKey.containsKey(key)) {
      _listenersByKey[key] = <String, void Function(dynamic event)>{};
      _listenersByKey[key]?[listenerId] = callback;
      return;
    }
    if ((_listenersByKey[key] ?? {}).containsKey(listenerId)) {
      throw LocalException(
          source: this,
          key: "$key--$listenerId",
          guilty: EnumGuilty.developer,
          message:
              "Under such a key and listenerId there already exists a listener: $key--$listenerId");
    }
    _listenersByKey[key]?[listenerId] = callback;
  }

  void notifyListener(String key, String listenerId, dynamic value) {
    if (!_listenersByKey.containsKey(key)) {
      return;
    }
    if (!(_listenersByKey[key] ?? {}).containsKey(listenerId)) {
      return;
    }
    (_listenersByKey[key]?[listenerId] ?? (dynamic event) => {})(value);
  }

  void notifyListeners(String key, dynamic value) {
    if (!_listenersByKey.containsKey(key)) {
      return;
    }
    for (final MapEntry<String, void Function(dynamic event)> entry
        in _listenersByKey[key]?.entries ?? []) {
      entry.value(value);
    }
  }

  void deleteAllListenersByKey(String key) {
    _listenersByKey.remove(key);
  }

  void deleteAllListenersByListKey(List<String> listKey) {
    for (final String itemKey in listKey) {
      _listenersByKey.remove(itemKey);
    }
  }

  void deleteListenerByListenerId(String key, String listenerId) {
    _listenersByKey[key]?.remove(listenerId);
  }

  void deleteListenersByListenerId(List<String> listKey, String listenerId) {
    for (final String itemKey in listKey) {
      _listenersByKey[itemKey]?.remove(listenerId);
    }
  }
}
