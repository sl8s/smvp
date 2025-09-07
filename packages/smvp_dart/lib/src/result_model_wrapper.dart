import 'package:meta/meta.dart';
import 'package:smvp_dart/src/base_exception.dart';
import 'package:smvp_dart/src/model/base_model_wrapper.dart';
import 'package:smvp_dart/src/exception_adapter.dart';

@immutable
final class ResultModelWrapper<T extends BaseModelWrapper> {
  final T? data;
  final ExceptionAdapter exceptionAdapter;

  ResultModelWrapper.success(this.data)
      : exceptionAdapter = ExceptionAdapter(null);
  ResultModelWrapper.exception(BaseException exception)
      : data = null,
        exceptionAdapter = ExceptionAdapter(exception);
}
