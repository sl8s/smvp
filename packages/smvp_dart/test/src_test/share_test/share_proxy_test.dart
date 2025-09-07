import 'package:mocktail/mocktail.dart';
import 'package:smvp_dart/src/share/share_proxy.dart';
import 'package:test/test.dart';

abstract class Callback {
  void onCallback(String data);
}

final class MockCallback extends Mock implements Callback {}

void main() {
  group(
      "ShareProxy",
      () => {
            test("getValue<T>(String key, T defaultValue)", () {
              final shareProxy = ShareProxy();
              expect("qwerty", shareProxy.getValue<String>("key", "qwerty"));
              shareProxy.update("key", "ytrewq");
              expect("ytrewq", shareProxy.getValue<String>("key", "qwerty"));
            }),
            test("update(String key, dynamic value)", () {
              final shareProxy = ShareProxy();
              shareProxy.update("key", "ytrewq");
              expect("ytrewq", shareProxy.getValue<String>("key", "qwerty"));
            }),
            test("delete(String key)", () {
              final shareProxy = ShareProxy();
              shareProxy.update("key", "ytrewq");
              shareProxy.delete("key");
              expect("qwerty", shareProxy.getValue<String>("key", "qwerty"));
            }),
            test(
                "addListener(String key, void Function(dynamic event) callback), "
                "notifyListener(String key, dynamic value)", () {
              final mockCallback = MockCallback();
              final shareProxy = ShareProxy();
              shareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              shareProxy.notifyListener("key", "hello");
              verify(() => mockCallback.onCallback("hello")).called(1);
            }),
            test(
                "addListener(String key, void Function(dynamic event) callback), "
                "notifyListeners(String key, dynamic value)", () {
              final mockCallback = MockCallback();
              final shareProxy = ShareProxy();
              final secondShareProxy = ShareProxy();
              shareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              secondShareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              shareProxy.notifyListeners("key", "hello");
              verify(() => mockCallback.onCallback("hello")).called(2);
            }),
            test(
                "addListener(String key, void Function(dynamic event) callback), "
                "notifyListeners(String key, dynamic value), "
                "deleteAllListenersByKey(String key)", () {
              final mockCallback = MockCallback();
              final shareProxy = ShareProxy();
              final secondShareProxy = ShareProxy();
              shareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              secondShareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              shareProxy.deleteAllListenersByKey("key");
              shareProxy.notifyListeners("key", "hello");
              verifyNever(() => mockCallback.onCallback("hello"));
            }),
            test(
                "addListener(String key, void Function(dynamic event) callback), "
                "notifyListeners(String key, dynamic value), "
                "deleteAllListenersByListKey(List<String> listKey)", () {
              final mockCallback = MockCallback();
              final shareProxy = ShareProxy();
              final secondShareProxy = ShareProxy();
              shareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              secondShareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              shareProxy.addListener("keyTwo", (event) {
                mockCallback.onCallback(event as String);
              });
              secondShareProxy.addListener("keyTwo", (event) {
                mockCallback.onCallback(event as String);
              });
              shareProxy.deleteAllListenersByListKey(["key", "keyTwo"]);
              shareProxy.notifyListeners("key", "hello");
              shareProxy.notifyListeners("keyTwo", "hello");
              verifyNever(() => mockCallback.onCallback("hello"));
            }),
            test(
                "addListener(String key, void Function(dynamic event) callback), "
                "notifyListeners(String key, dynamic value), "
                "deleteListenerByListenerId(String key)", () {
              final mockCallback = MockCallback();
              final shareProxy = ShareProxy();
              final secondShareProxy = ShareProxy();
              shareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              secondShareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              shareProxy.addListener("keyTwo", (event) {
                mockCallback.onCallback(event as String);
              });
              secondShareProxy.addListener("keyTwo", (event) {
                mockCallback.onCallback(event as String);
              });
              shareProxy.deleteListenerByListenerId("key");
              shareProxy.notifyListeners("key", "hello");
              shareProxy.notifyListeners("keyTwo", "hello");
              verify(() => mockCallback.onCallback("hello")).called(3);
            }),
            test(
                "addListener(String key, void Function(dynamic event) callback), "
                "notifyListeners(String key, dynamic value), "
                "deleteListenersByListenerId(List<String> listKey)", () {
              final mockCallback = MockCallback();
              final shareProxy = ShareProxy();
              final secondShareProxy = ShareProxy();
              shareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              secondShareProxy.addListener("key", (event) {
                mockCallback.onCallback(event as String);
              });
              shareProxy.addListener("keyTwo", (event) {
                mockCallback.onCallback(event as String);
              });
              secondShareProxy.addListener("keyTwo", (event) {
                mockCallback.onCallback(event as String);
              });
              shareProxy.deleteListenersByListenerId(["key", "keyTwo"]);
              shareProxy.notifyListeners("key", "hello");
              shareProxy.notifyListeners("keyTwo", "hello");
              verify(() => mockCallback.onCallback("hello")).called(2);
            }),
          });
}
