import 'package:meta/meta.dart';
import 'package:smvp_dart/src/idispose.dart';

@immutable
abstract base class BaseModelWrapperRepository implements IDispose {
  const BaseModelWrapperRepository();

  @protected
  @nonVirtual
  T getSafeValue<T>(Map<String, dynamic> map, String key, T defaultValue) {
    if (!map.containsKey(key)) {
      return defaultValue;
    }
    return map[key];
  }
}
