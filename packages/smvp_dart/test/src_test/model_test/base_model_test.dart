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
              expect(user.id == cloneUser.id, equals(true));
            }),
            test("toMap()", () {
              final user = User(id: "id1");
              expect(user.toMap(), equals({"id": "id1"}));
            }),
            test("toString()", () {
              final user = User(id: "id1");
              expect(user.toString(), equals("User(id: id1)"));
            })
          });
}
