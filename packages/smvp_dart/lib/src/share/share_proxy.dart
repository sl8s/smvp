import 'package:meta/meta.dart';
import 'package:smvp_dart/src/share/iteration_service.dart';
import 'package:smvp_dart/src/share/share_service.dart';

@immutable
final class ShareProxy {
  final int _listenerId;
  final ShareService _shareService;

  ShareProxy()
      : _listenerId = IterationService.instance.next(),
        _shareService = ShareService.instance;

  T getValue<T>(String key, T defaultValue) {
    return _shareService.getValue<T>(key, defaultValue);
  }

  void update(String key, dynamic value) {
    _shareService.update(key, value);
  }

  void delete(String key) {
    _shareService.delete(key);
  }

  void addListener(String key, void Function(dynamic event) callback) {
    _shareService.addListener(key, _listenerId, callback);
  }

  void notifyListener(String key, dynamic value) {
    _shareService.notifyListener(key, _listenerId, value);
  }

  void notifyListeners(String key, dynamic value) {
    _shareService.notifyListeners(key, value);
  }

  void deleteAllListenersByKey(String key) {
    _shareService.deleteAllListenersByKey(key);
  }

  void deleteAllListenersByListKey(List<String> listKey) {
    _shareService.deleteAllListenersByListKey(listKey);
  }

  void deleteListenerByListenerId(String key) {
    _shareService.deleteListenerByListenerId(key, _listenerId);
  }

  void deleteListenersByListenerId(List<String> listKey) {
    _shareService.deleteListenersByListenerId(listKey, _listenerId);
  }
}
