import 'package:meta/meta.dart';
import 'package:smvp_dart/src/exception_adapter.dart';

abstract base class BaseView<T extends Enum> {
  @protected
  ExceptionAdapter exceptionAdapter;

  BaseView() : exceptionAdapter = ExceptionAdapter(null);

  @protected
  T getViewState();
}
