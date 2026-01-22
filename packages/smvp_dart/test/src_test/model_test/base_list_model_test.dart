import 'package:meta/meta.dart';
import 'package:smvp_dart/src/model/base_list_model.dart';
import 'package:smvp_dart/src/model/base_model.dart';
import 'package:test/test.dart';

@immutable
base class Product extends BaseModel {
  final int price;

  const Product({required super.id, required this.price});

  @override
  Product clone() {
    return Product(id: id, price: price);
  }

  @override
  Map<String, dynamic> toMap() {
    return {"id": id, "price": price};
  }

  @override
  String toString() {
    return "Product(id: $id, "
        "price: $price)";
  }
}

@immutable
base class ListProduct<T extends Product> extends BaseListModel<T> {
  const ListProduct({required super.listModel});

  @override
  ListProduct<T> clone() {
    final List<T> newListModel = List.empty(growable: true);
    for (final T itemModel in listModel) {
      newListModel.add(itemModel.clone() as T);
    }
    return ListProduct<T>(listModel: newListModel);
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
    return "ListProduct(listModel: [$str])";
  }
}

void main() {
  group(
      "BaseListModel",
      () => {
            test("clone()", () {
              final generatedListProduct = List<Product>.generate(10,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              final cloneListProduct = listProduct.clone();
              expect(
                  true,
                  listProduct.listModel.length ==
                      cloneListProduct.listModel.length);
              cloneListProduct.listModel.removeAt(0);
              expect(10, listProduct.listModel.length);
              expect(9, cloneListProduct.listModel.length);
            }),
            test("toListMap()", () {
              final generatedListProduct = List<Product>.generate(10,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              final listMapFromListProduct = listProduct.toListMap();
              expect(
                  true,
                  listProduct.listModel.length ==
                      listMapFromListProduct.length);
              expect(10, listMapFromListProduct.length);
              expect(
                  [100, 101, 102, 103, 104, 105, 106, 107, 108, 109],
                  equals([
                    listMapFromListProduct[0]["price"],
                    listMapFromListProduct[1]["price"],
                    listMapFromListProduct[2]["price"],
                    listMapFromListProduct[3]["price"],
                    listMapFromListProduct[4]["price"],
                    listMapFromListProduct[5]["price"],
                    listMapFromListProduct[6]["price"],
                    listMapFromListProduct[7]["price"],
                    listMapFromListProduct[8]["price"],
                    listMapFromListProduct[9]["price"],
                  ]));
            }),
            test("toString()", () {
              final generatedListProduct = List<Product>.generate(1,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              expect(
                  "ListProduct(listModel: [\nProduct(id: id0, price: 100),\n])",
                  listProduct.toString());
            }),
            test("add(T newModel)", () {
              final generatedListProduct = List<Product>.generate(10,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              expect(10, listProduct.listModel.length);
              listProduct.add(Product(id: "id124", price: 5314));
              expect(11, listProduct.listModel.length);
              expect("id124", listProduct.listModel[10].id);
              expect(5314, listProduct.listModel[10].price);
            }),
            test("updateById(T newModel)", () {
              final generatedListProduct = List<Product>.generate(10,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              expect(10, listProduct.listModel.length);
              expect(100, listProduct.listModel[0].price);
              listProduct.updateById(Product(id: "id0", price: 5314));
              expect(5314, listProduct.listModel[0].price);
            }),
            test("deleteById(String id)", () {
              final generatedListProduct = List<Product>.generate(10,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              expect(10, listProduct.listModel.length);
              listProduct.deleteById("id0");
              expect(9, listProduct.listModel.length);
              expect(
                  ["id1", 101],
                  equals([
                    listProduct.listModel[0].id,
                    listProduct.listModel[0].price
                  ]));
            }),
            test("addFromList(List<T> newListModel)", () {
              final generatedListProduct = List<Product>.generate(10,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              expect(10, listProduct.listModel.length);
              listProduct.addFromList([
                Product(id: "id425", price: 93125),
                Product(id: "id643", price: 24112)
              ]);
              expect(12, listProduct.listModel.length);
              expect(
                  ["id425", "id643", 93125, 24112],
                  equals([
                    listProduct.listModel[10].id,
                    listProduct.listModel[11].id,
                    listProduct.listModel[10].price,
                    listProduct.listModel[11].price
                  ]));
            }),
            test("updateFromListById(List<T> newListModel)", () {
              final generatedListProduct = List<Product>.generate(10,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              expect(10, listProduct.listModel.length);
              expect(
                  [100, 101],
                  equals([
                    listProduct.listModel[0].price,
                    listProduct.listModel[1].price
                  ]));
              listProduct.updateFromListById([
                Product(id: "id0", price: 93125),
                Product(id: "id1", price: 24112)
              ]);
              expect(
                  [93125, 24112],
                  equals([
                    listProduct.listModel[0].price,
                    listProduct.listModel[1].price
                  ]));
            }),
            test("deleteFromListById(List<String> listId)", () {
              final generatedListProduct = List<Product>.generate(10,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              expect(10, listProduct.listModel.length);
              listProduct.deleteFromListById(["id0", "id1"]);
              expect(8, listProduct.listModel.length);
              expect(
                  ["id2", 102, "id3", 103],
                  equals([
                    listProduct.listModel[0].id,
                    listProduct.listModel[0].price,
                    listProduct.listModel[1].id,
                    listProduct.listModel[1].price
                  ]));
            }),
          });
}
