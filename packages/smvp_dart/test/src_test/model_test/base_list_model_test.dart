import 'package:meta/meta.dart';
import 'package:smvp_dart/src/model/base_list_model.dart';
import 'package:smvp_dart/src/model/base_model.dart';
import 'package:smvp_dart/src/model/base_model_iterator.dart';
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
    List<T> newListModel = List.empty(growable: true);
    for (final T itemModel in listModel) {
      newListModel.add(itemModel.clone() as T);
    }
    return ListProduct<T>(listModel: newListModel);
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

final class ProductOrderByDescPriceIterator<T extends Product>
    extends BaseModelIterator<T> {
  ProductOrderByDescPriceIterator() : super(index: 0);

  @override
  T next() {
    T currentModel = listModel[0];
    if (listModel.length == 1) {
      index = 0;
      listModel.removeAt(index);
      return currentModel;
    }
    for (int i = 1; i < listModel.length; i++) {
      final itemModel = listModel[i];
      if (itemModel.price > currentModel.price) {
        currentModel = itemModel;
        index = i;
        continue;
      }
    }
    listModel.removeAt(index);
    return currentModel;
  }

  @override
  bool hasNext() {
    return listModel.isNotEmpty;
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
            test("toString()", () {
              final generatedListProduct = List<Product>.generate(1,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              expect(
                  "ListProduct(listModel: [\nProduct(id: id0, price: 100),\n])",
                  listProduct.toString());
            }),
            test("sortUsingIterator(BaseModelIterator<T> baseModelIterator)",
                () {
              final generatedListProduct = List<Product>.generate(10,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final listProduct = ListProduct(listModel: generatedListProduct);
              listProduct.sortUsingIterator(ProductOrderByDescPriceIterator());
              expect(10, listProduct.listModel.length);
              expect(
                  [109, 108, 107, 106, 105, 104, 103, 102, 101, 100],
                  equals([
                    listProduct.listModel[0].price,
                    listProduct.listModel[1].price,
                    listProduct.listModel[2].price,
                    listProduct.listModel[3].price,
                    listProduct.listModel[4].price,
                    listProduct.listModel[5].price,
                    listProduct.listModel[6].price,
                    listProduct.listModel[7].price,
                    listProduct.listModel[8].price,
                    listProduct.listModel[9].price
                  ]));
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
