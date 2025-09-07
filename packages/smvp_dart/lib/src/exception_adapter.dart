import 'package:meta/meta.dart';
import 'package:smvp_dart/src/base_exception.dart';

@immutable
final class ExceptionAdapter {
  final BaseException? _exception;

  const ExceptionAdapter(this._exception);

  String getKey() {
    return _exception?.key ?? "";
  }

  bool hasException() {
    return _exception != null;
  }
}
