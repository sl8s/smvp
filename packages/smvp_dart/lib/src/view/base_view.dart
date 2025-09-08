import 'package:meta/meta.dart';
import 'package:smvp_dart/src/exception_adapter.dart';
import 'package:smvp_dart/src/idispose.dart';

abstract base class BaseView<T extends Enum> implements IDispose {
  @protected
  ExceptionAdapter exceptionAdapter;

  BaseView() : exceptionAdapter = ExceptionAdapter(null);

  T getViewState();
}
