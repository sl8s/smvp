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

final class ProductByPriceIterator<T extends Product>
    extends BaseModelIterator<T> {
  ProductByPriceIterator() : super();

  @override
  T next() {
    T currentModel = listModel[0];
    if (listModel.length == 1) {
      listModel.removeAt(0);
      return currentModel;
    }
    int index = 0;
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
      "BaseModelIterator",
      () => {
            test("next(), hasNext(), setListModel(List<T> listModel)", () {
              final generatedListProduct = List<Product>.generate(10,
                  (int index) => Product(id: "id$index", price: (100 + index)),
                  growable: true);
              final productByPriceIterator = ProductByPriceIterator<Product>();
              productByPriceIterator.setListModel(generatedListProduct);
              final listProduct = List<Product>.empty(growable: true);
              while (productByPriceIterator.hasNext()) {
                listProduct.add(productByPriceIterator.next().clone());
              }
              expect(10, listProduct.length);
              expect(
                  [109, 108, 107, 106, 105, 104, 103, 102, 101, 100],
                  equals([
                    listProduct[0].price,
                    listProduct[1].price,
                    listProduct[2].price,
                    listProduct[3].price,
                    listProduct[4].price,
                    listProduct[5].price,
                    listProduct[6].price,
                    listProduct[7].price,
                    listProduct[8].price,
                    listProduct[9].price
                  ]));
            }),
          });
}
