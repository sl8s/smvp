import 'package:meta/meta.dart';
import 'package:smvp_dart/src/base_exception.dart';
import 'package:smvp_dart/src/model/base_list_model_wrapper.dart';
import 'package:smvp_dart/src/exception_adapter.dart';

@immutable
final class ResultListModelWrapper<T extends BaseListModelWrapper> {
  final T? data;
  final ExceptionAdapter exceptionAdapter;

  ResultListModelWrapper.success(this.data)
      : exceptionAdapter = ExceptionAdapter(null);
  ResultListModelWrapper.exception(BaseException exception)
      : data = null,
        exceptionAdapter = ExceptionAdapter(exception);
}
