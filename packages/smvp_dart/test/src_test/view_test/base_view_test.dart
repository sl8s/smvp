import 'package:smvp_dart/src/view/base_view.dart';
import 'package:test/test.dart';

enum EnumMainView { exception, success }

final class MainView extends BaseView<EnumMainView> {
  @override
  EnumMainView getViewState() {
    if (exceptionAdapter.hasException()) {
      return EnumMainView.exception;
    }
    return EnumMainView.success;
  }

  @override
  void dispose() {}
}

void main() {
  group(
      "BaseView",
      () => {
            test("getViewState()", () {
              final mainView = MainView();
              expect(EnumMainView.success, mainView.getViewState());
            }),
          });
}
