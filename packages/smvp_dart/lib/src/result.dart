import 'package:meta/meta.dart';
import 'package:smvp_dart/src/base_exception.dart';
import 'package:smvp_dart/src/exception_adapter.dart';

@immutable
final class Result<T extends Object> {
  final T? data;
  final ExceptionAdapter exceptionAdapter;

  Result.success(this.data) : exceptionAdapter = ExceptionAdapter(null);
  Result.exception(BaseException exception)
      : data = null,
        exceptionAdapter = ExceptionAdapter(exception);
}
