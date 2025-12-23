import 'package:uuid/uuid.dart';

final class IterationService {
  static final IterationService instance = IterationService._();

  final List<String> _listUuid;

  IterationService._() : _listUuid = List<String>.empty(growable: true);

  String next() {
    final uuid = Uuid().v4();
    for (final itemUuid in _listUuid) {
      if (itemUuid == uuid) {
        return next();
      }
    }
    _listUuid.add(uuid);
    return uuid;
  }
}
