import 'package:meta/meta.dart';
import 'package:smvp_dart/src/base_exception.dart';
import 'package:smvp_dart/src/enum_guilty.dart';

@immutable
final class LocalException extends BaseException {
  final EnumGuilty guilty;
  final String message;

  LocalException(
      {required super.source,
      required super.key,
      required this.guilty,
      required this.message})
      : super(type: LocalException);

  @override
  String toString() {
    return "LocalException(key: $key, "
        "guilty: ${guilty.name}, "
        "message: $message)";
  }
}
