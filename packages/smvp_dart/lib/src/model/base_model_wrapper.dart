import 'package:meta/meta.dart';
import 'package:smvp_dart/src/model/base_model.dart';

@immutable
abstract base class BaseModelWrapper {
  @protected
  final Map<String, dynamic> map;

  const BaseModelWrapper({required this.map});

  BaseModel fromMap();
}
