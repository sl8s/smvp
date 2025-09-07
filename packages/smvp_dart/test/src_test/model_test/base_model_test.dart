import 'package:meta/meta.dart';
import 'package:smvp_dart/src/model/base_model.dart';
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

void main() {
  group(
      "BaseModel",
      () => {
            test("clone()", () {
              final user = User(id: "id1");
              final cloneUser = user.clone();
              expect(true, user.id == cloneUser.id);
            }),
            test("toMap()", () {
              final user = User(id: "id1");
              expect({"id": "id1"}, user.toMap());
            }),
            test("toString()", () {
              final user = User(id: "id1");
              expect("User(id: id1)", user.toString());
            })
          });
}
