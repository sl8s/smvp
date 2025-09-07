import 'package:meta/meta.dart';
import 'package:smvp_dart/src/model/base_model.dart';
import 'package:smvp_dart/src/model/base_model_iterator.dart';

@immutable
abstract base class BaseListModel<T extends BaseModel> {
  final List<T> listModel;

  const BaseListModel({required this.listModel});

  BaseListModel<T> clone();

  @override
  String toString();

  @nonVirtual
  void sortUsingIterator(BaseModelIterator<T> baseModelIterator) {
    if (listModel.isEmpty) {
      return;
    }
    baseModelIterator.setListModel(listModel);
    listModel.clear();
    while (baseModelIterator.hasNext()) {
      listModel.add(baseModelIterator.next().clone() as T);
    }
  }

  @nonVirtual
  void add(T newModel) {
    listModel.add(newModel);
  }

  @nonVirtual
  void updateById(T newModel) {
    final int index =
        listModel.indexWhere((T itemModel) => itemModel.id == newModel.id);
    if (index == -1) {
      return;
    }
    listModel[index] = newModel;
  }

  @nonVirtual
  void deleteById(String id) {
    listModel.removeWhere((T itemModel) => itemModel.id == id);
  }

  @nonVirtual
  void addFromList(List<T> newListModel) {
    listModel.addAll(newListModel);
  }

  @nonVirtual
  void updateFromListById(List<T> newListModel) {
    for (final T newItemModel in newListModel) {
      final int index = listModel
          .indexWhere((T itemModel) => itemModel.id == newItemModel.id);
      if (index == -1) {
        continue;
      }
      listModel[index] = newItemModel;
    }
  }

  @nonVirtual
  void deleteFromListById(List<String> listId) {
    for (final String itemId in listId) {
      listModel.removeWhere((T itemModel) => itemModel.id == itemId);
    }
  }
}
