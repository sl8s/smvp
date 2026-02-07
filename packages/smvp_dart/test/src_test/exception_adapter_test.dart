import 'package:smvp_dart/src/exception_adapter.dart';
import 'package:test/test.dart';

void main() {
  group(
      "ExceptionAdapter",
      () => {
            test("getKey()", () {
              final exceptionAdapter = ExceptionAdapter(null);
              expect(exceptionAdapter.getKey(), equals(""));
            }),
            test("hasException()", () {
              final exceptionAdapter = ExceptionAdapter(null);
              expect(exceptionAdapter.hasException(), equals(false));
            }),
          });
}
