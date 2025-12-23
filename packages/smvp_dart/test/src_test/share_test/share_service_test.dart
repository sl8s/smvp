import 'package:mocktail/mocktail.dart';
import 'package:smvp_dart/src/share/share_service.dart';
import 'package:test/test.dart';

abstract class Callback {
  void onCallback(String data);
}

final class MockCallback extends Mock implements Callback {}

void main() {
  group(
      "ShareService",
      () => {
            test("getValue<T>(String key, T defaultValue)", () {
              final shareService = ShareService.instance;
              expect("qwerty", shareService.getValue<String>("key", "qwerty"));
              shareService.update("key", "ytrewq");
              expect("ytrewq", shareService.getValue<String>("key", "qwerty"));
            }),
            test("update(String key, dynamic value)", () {
              final shareService = ShareService.instance;
              shareService.update("key", "ytrewq");
              expect("ytrewq", shareService.getValue<String>("key", "qwerty"));
            }),
            test("delete(String key)", () {
              final shareService = ShareService.instance;
              shareService.update("key", "ytrewq");
              shareService.delete("key");
              expect("qwerty", shareService.getValue<String>("key", "qwerty"));
            }),
            test(
                "addListener(String key, String listenerId, void Function(dynamic event) callback), "
                "notifyListener(String key, String listenerId, dynamic value)",
                () {
              final mockCallback = MockCallback();
              final shareService = ShareService.instance;
              shareService.addListener("key", "0", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("key", "1", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.notifyListener("key", "0", "hello");
              verify(() => mockCallback.onCallback("hello")).called(1);
            }),
            test(
                "addListener(String key, String listenerId, void Function(dynamic event) callback), "
                "notifyListeners(String key, dynamic value)", () {
              final mockCallback = MockCallback();
              final shareService = ShareService.instance;
              shareService.addListener("key", "2", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("key", "3", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.notifyListeners("key", "hello");
              verify(() => mockCallback.onCallback("hello")).called(2);
            }),
            test(
                "addListener(String key, String listenerId, void Function(dynamic event) callback), "
                "notifyListeners(String key, dynamic value), "
                "deleteAllListenersByKey(String key)", () {
              final mockCallback = MockCallback();
              final shareService = ShareService.instance;
              shareService.addListener("key", "4", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("key", "5", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.deleteAllListenersByKey("key");
              shareService.notifyListeners("key", "hello");
              verifyNever(() => mockCallback.onCallback("hello"));
            }),
            test(
                "addListener(String key, String listenerId, void Function(dynamic event) callback), "
                "notifyListeners(String key, dynamic value), "
                "deleteAllListenersByListKey(List<String> listKey)", () {
              final mockCallback = MockCallback();
              final shareService = ShareService.instance;
              shareService.addListener("key", "6", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("key", "7", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("keyTwo", "0", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("keyTwo", "1", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.deleteAllListenersByListKey(["key", "keyTwo"]);
              shareService.notifyListeners("key", "hello");
              shareService.notifyListeners("keyTwo", "hello");
              verifyNever(() => mockCallback.onCallback("hello"));
            }),
            test(
                "addListener(String key, String listenerId, void Function(dynamic event) callback), "
                "notifyListeners(String key, dynamic value), "
                "deleteListenerByListenerId(String key, String listenerId)", () {
              final mockCallback = MockCallback();
              final shareService = ShareService.instance;
              shareService.addListener("key", "8", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("key", "9", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("keyTwo", "2", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("keyTwo", "3", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.deleteListenerByListenerId("key", "8");
              shareService.notifyListeners("key", "hello");
              shareService.notifyListeners("keyTwo", "hello");
              verify(() => mockCallback.onCallback("hello")).called(3);
            }),
            test(
                "addListener(String key, String listenerId, void Function(dynamic event) callback), "
                "notifyListeners(String key, dynamic value), "
                "deleteListenersByListenerId(List<String> listKey, String listenerId)",
                () {
              final mockCallback = MockCallback();
              final shareService = ShareService.instance;
              shareService.addListener("key", "55", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("key", "56", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("keyTwo", "55", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.addListener("keyTwo", "56", (event) {
                mockCallback.onCallback(event as String);
              });
              shareService.deleteListenersByListenerId(["key", "keyTwo"], "55");
              shareService.notifyListeners("key", "hello");
              shareService.notifyListeners("keyTwo", "hello");
              verify(() => mockCallback.onCallback("hello")).called(2);
            }),
          });
}
