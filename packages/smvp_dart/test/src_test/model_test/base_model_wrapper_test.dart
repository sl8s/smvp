import 'package:meta/meta.dart';
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
base class UserWrapper extends BaseModelWrapper {
  const UserWrapper({required super.map});

  @override
  User fromMap() {
    return User(id: map["id"]);
  }
}

void main() {
  group(
      "BaseModelWrapper",
      () => {
            test("fromMap()", () {
              final Map<String, dynamic> map = {"id": "id1"};
              final userWrapper = UserWrapper(map: map);
              expect("id1", userWrapper.fromMap().id);
            })
          });
}
