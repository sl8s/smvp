import 'package:meta/meta.dart';
import 'package:smvp_dart/src/model/base_list_model.dart';
import 'package:smvp_dart/src/model/base_list_model_wrapper.dart';
import 'package:smvp_dart/src/model/base_model.dart';
import 'package:smvp_dart/src/model/base_model_wrapper.dart';
import 'package:test/test.dart';

@immutable
base class User extends BaseModel {
  const User({required super.id});

  @override
  User clone() {
    return User(id: id);
  }

  @override
  Map<String, dynamic> toMap() {
    return {"id": id};
  }

  @override
  String toString() {
    return "User(id: $id)";
  }
}

@immutable
base class ListUser<T extends User> extends BaseListModel<T> {
  const ListUser({required super.listModel});

  @override
  ListUser<T> clone() {
    final List<T> newListModel = List.empty(growable: true);
    for (final T itemModel in listModel) {
      newListModel.add(itemModel.clone() as T);
    }
    return ListUser<T>(listModel: newListModel);
  }

  @override
  List<Map<String, dynamic>> toListMap() {
    final List<Map<String, dynamic>> listMap = List.empty(growable: true);
    for (final T itemModel in listModel) {
      listMap.add(itemModel.toMap());
    }
    return listMap;
  }

  @override
  String toString() {
    String str = "\n";
    for (final T itemModel in listModel) {
      str += "$itemModel,\n";
    }
    return "ListUser(listModel: [$str])";
  }
}

@immutable
base class UserWrapper extends BaseModelWrapper {
  const UserWrapper({required super.map});

  @override
  User fromMap() {
    return User(id: map["id"]);
  }
}

@immutable
base class ListUserWrapper extends BaseListModelWrapper {
  const ListUserWrapper({required super.listMap});

  @override
  ListUser fromListMap() {
    final List<User> listModel = List.empty(growable: true);
    for (final Map<String, dynamic> itemMap in listMap) {
      final modelWrapper = UserWrapper(map: itemMap);
      listModel.add(modelWrapper.fromMap());
    }
    return ListUser(listModel: listModel);
  }
}

void main() {
  group(
      "BaseListModelWrapper",
      () => {
            test("fromListMap()", () {
              final generatedListMap = List<Map<String, dynamic>>.generate(
                  10, (int index) => {"id": "id$index"},
                  growable: false);
              final listUserWrapper =
                  ListUserWrapper(listMap: generatedListMap);
              final ListUser listUser = listUserWrapper.fromListMap();
              expect(10, listUser.listModel.length);
              expect("id5", listUser.listModel[5].id);
            })
          });
}
