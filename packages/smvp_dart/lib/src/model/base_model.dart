import 'package:meta/meta.dart';

@immutable
abstract base class BaseModel {
  final String id;

  const BaseModel({required this.id});

  BaseModel clone();

  Map<String, dynamic> toMap();

  @override
  String toString();
}
