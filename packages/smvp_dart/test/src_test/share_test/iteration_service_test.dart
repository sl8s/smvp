import 'package:smvp_dart/src/share/iteration_service.dart';
import 'package:test/test.dart';

void main() {
  group(
      "IterationService",
      () => {
            test("next()", () {
              final iterationService = IterationService.instance;
              final id = iterationService.next();
              final idSecond = iterationService.next();
              expect(true, id != idSecond);
            }),
          });
}
