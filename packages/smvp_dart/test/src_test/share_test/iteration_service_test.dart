import 'package:smvp_dart/src/share/iteration_service.dart';
import 'package:test/test.dart';

void main() {
  group(
      "IterationService",
      () => {
            test("next()", () {
              final iterationService = IterationService.instance;
              expect(0, iterationService.next());
              expect(1, iterationService.next());
            }),
          });
}
