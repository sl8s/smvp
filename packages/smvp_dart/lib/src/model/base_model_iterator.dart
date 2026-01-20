import 'package:meta/meta.dart';
import 'package:smvp_dart/src/model/base_model.dart';

abstract base class BaseModelIterator<T extends BaseModel> {
  @protected
  List<T> listModel;

  BaseModelIterator() : listModel = List.empty(growable: true);

  T next();

  bool hasNext();

  @nonVirtual
  void setListModel(List<T> listModel) {
    this.listModel = listModel;
  }
}
