import 'package:meta/meta.dart';
import 'package:smvp_dart/src/model/base_list_model.dart';

@immutable
abstract base class BaseListModelWrapper {
  @protected
  final List<Map<String, dynamic>> listMap;

  const BaseListModelWrapper({required this.listMap});

  BaseListModel fromListMap();
}
