import { vi, expect, test, describe } from "vitest"
import { BaseArrayModel, BaseArrayModelWrapper, BaseModel, BaseModelIterator, BaseModelWrapper, BaseView, ExceptionAdapter, IterationService, ShareProxy, ShareService } from "..";

class Product extends BaseModel {
    public readonly price: number;

    public constructor(id: string, price: number) {
        super(id);
        this.price = price;
    }

    public override clone(): Product {
        return new Product(this.id, this.price);
    }

    public override toMap(): Record<string, any> {
        return {"id": this.id, "price": this.price };
    }

    public override toString(): string {
        return "Product(id: " + this.id + ", " + 
            "price: " + this.price + ")";
    }
}

class ArrayProduct<T extends Product> extends BaseArrayModel<T> {
    public constructor(arrayModel: Array<T>) {
        super(arrayModel);
    }

    public override clone(): ArrayProduct<T> {
        const newArrayModel = new Array<T>();
        for(const itemModel of this.arrayModel) {
            newArrayModel.push(itemModel.clone() as T);
        }
        return new ArrayProduct<T>(newArrayModel);
    }

    public override toArrayMap(): Array<Record<string, any>> {
        const arrayMap = Array<Record<string,any>>();
        for(const itemModel of this.arrayModel) {
            arrayMap.push(itemModel.toMap());
        }
        return arrayMap; 
    }

    public override toString(): string {
        let str = "\n";
        for(const itemModel of this.arrayModel) {
            str += itemModel.toString() + ",\n";
        }
        return "ArrayProduct(arrayModel: [" + str + "])";
    }
}

class ProductWrapper extends BaseModelWrapper {
    public constructor(map: Record<string,any>) {
        super(map);
    }

    public override fromMap(): Product {
        return new Product(
            this.map["id"],
            this.map["price"]);
    }
}

class ArrayProductWrapper extends BaseArrayModelWrapper {
    public constructor(arrayMap: Array<Record<string,any>>) {
        super(arrayMap);
    }

    public override fromArrayMap(): ArrayProduct<Product> {
        const arrayModel = new Array<Product>();
        for(const itemMap of this.arrayMap) {
            const modelWrapper = new ProductWrapper(itemMap);
            arrayModel.push(modelWrapper.fromMap());
        }
        return new ArrayProduct(arrayModel);
    }
}

class ProductOrderByDescPriceIterator<T extends Product> extends BaseModelIterator<T> {
    public constructor() {
        super(0);
    }

    public override next(): T {
        let currentModel: T = this.arrayModel[0];
        if (this.arrayModel.length === 1) {
            this.index = 0;
            this.arrayModel.splice(this.index,1);
            return currentModel;
        }
        for (let i = 1; i < this.arrayModel.length; i++) {
            const itemModel = this.arrayModel[i];
            if(itemModel.price > currentModel.price) {
                currentModel = itemModel;
                this.index = i;
                continue;
            }
        }
        this.arrayModel.splice(this.index,1);
        return currentModel;
    }

    public override hasNext(): boolean {
        return this.arrayModel.length > 0;
    }
}

interface Callback {
    onCallback(data: string): void;
}
  
class MockCallback implements Callback {
    onCallback = vi.fn<(data: string) => void>();
}

enum EnumMainView {
    exception,
    success
}

class MainView extends BaseView<EnumMainView> {
    public constructor() {
        super();
    }

    public override getViewState(): EnumMainView {
        if(this.exceptionAdapter.hasException()) {
            return EnumMainView.exception;
        }
        return EnumMainView.success;
    }

    public override dispose(): void {}
}

describe("BaseArrayModel", () => {
    test("clone()", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        const cloneArrayProduct = arrayProduct.clone();
        expect(true).toEqual(arrayProduct.arrayModel.length === cloneArrayProduct.arrayModel.length);
        cloneArrayProduct.arrayModel.splice(0,1);
        expect(10).toEqual(arrayProduct.arrayModel.length);
        expect(9).toEqual(cloneArrayProduct.arrayModel.length);
    });
    test("toArrayMap()", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        const arrayMapFromArrayProduct = arrayProduct.toArrayMap();
        expect(true).toEqual(arrayProduct.arrayModel.length === arrayMapFromArrayProduct.length);
        expect(10).toEqual(arrayMapFromArrayProduct.length);
        expect(
            [100, 101, 102, 103, 104, 105, 106, 107, 108, 109])
            .toEqual([ 
                arrayMapFromArrayProduct[0]["price"],
                arrayMapFromArrayProduct[1]["price"],
                arrayMapFromArrayProduct[2]["price"],
                arrayMapFromArrayProduct[3]["price"],
                arrayMapFromArrayProduct[4]["price"],
                arrayMapFromArrayProduct[5]["price"],
                arrayMapFromArrayProduct[6]["price"],
                arrayMapFromArrayProduct[7]["price"],
                arrayMapFromArrayProduct[8]["price"],
                arrayMapFromArrayProduct[9]["price"],
            ]);
    });
    test("toString()", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 1 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(
            "ArrayProduct(arrayModel: [\nProduct(id: id0, price: 100),\n])")
            .toEqual(arrayProduct.toString());
    });
    test("sortUsingIterator(baseModelIterator: BaseModelIterator<T>)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        arrayProduct.sortUsingIterator(new ProductOrderByDescPriceIterator());
        expect(10).toEqual(arrayProduct.arrayModel.length);
        expect(
            [109, 108, 107, 106, 105, 104, 103, 102, 101, 100])
            .toEqual([ 
                arrayProduct.arrayModel[0].price,
                arrayProduct.arrayModel[1].price,
                arrayProduct.arrayModel[2].price,
                arrayProduct.arrayModel[3].price,
                arrayProduct.arrayModel[4].price,
                arrayProduct.arrayModel[5].price,
                arrayProduct.arrayModel[6].price,
                arrayProduct.arrayModel[7].price,
                arrayProduct.arrayModel[8].price,
                arrayProduct.arrayModel[9].price
            ]);
    });
    test("add(newModel: T)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(10).toEqual(arrayProduct.arrayModel.length);
        arrayProduct.add(new Product("id124", 5314));
        expect(11).toEqual(arrayProduct.arrayModel.length);
        expect("id124").toEqual(arrayProduct.arrayModel[10].id);
        expect(5314).toEqual(arrayProduct.arrayModel[10].price);
    });
    test("updateById(newModel: T)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(10).toEqual(arrayProduct.arrayModel.length);
        expect(100).toEqual(arrayProduct.arrayModel[0].price);
        arrayProduct.updateById(new Product("id0", 5314));
        expect(5314).toEqual(arrayProduct.arrayModel[0].price);
    });
    test("deleteById(id: string)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(10).toEqual(arrayProduct.arrayModel.length);
        arrayProduct.deleteById("id0");
        expect(9).toEqual(arrayProduct.arrayModel.length);
        expect(
            ["id1", 101])
            .toEqual([
                arrayProduct.arrayModel[0].id, 
                arrayProduct.arrayModel[0].price
            ]);
    });
    test("addFromArray(newArrayModel: Array<T>)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(10).toEqual(arrayProduct.arrayModel.length);
        arrayProduct.addFromArray([
            new Product("id425", 93125),
            new Product("id643", 24112)
        ]);
        expect(12).toEqual(arrayProduct.arrayModel.length);
        expect(
            ["id425", "id643", 93125, 24112])
            .toEqual([
                arrayProduct.arrayModel[10].id, 
                arrayProduct.arrayModel[11].id, 
                arrayProduct.arrayModel[10].price,
                arrayProduct.arrayModel[11].price
            ]);
    });
    test("updateFromArrayById(newArrayModel: Array<T>)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(10).toEqual(arrayProduct.arrayModel.length);
        expect(
            [100, 101])
            .toEqual([
                arrayProduct.arrayModel[0].price,
                arrayProduct.arrayModel[1].price
            ]);
        arrayProduct.updateFromArrayById([
            new Product("id0", 93125),
            new Product("id1", 24112)
        ]);
        expect(
            [93125, 24112])
            .toEqual([
                arrayProduct.arrayModel[0].price,
                arrayProduct.arrayModel[1].price
            ]);
    });
    test("deleteFromArrayById(arrayId: Array<string>)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(10).toEqual(arrayProduct.arrayModel.length);
        arrayProduct.deleteFromArrayById(["id0","id1"]);
        expect(8).toEqual(arrayProduct.arrayModel.length);
        expect(
            ["id2", 102, "id3", 103])
            .toEqual([
                arrayProduct.arrayModel[0].id,
                arrayProduct.arrayModel[0].price,
                arrayProduct.arrayModel[1].id,
                arrayProduct.arrayModel[1].price,
            ]);
    });
});
  
describe("BaseArrayModelWrapper", () => {
    test("fromArrayMap()", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProductWrapper = new ArrayProductWrapper(generatedArrayProduct);
        const arrayProduct = arrayProductWrapper.fromArrayMap();
        expect(10).toEqual(arrayProduct.arrayModel.length);
        expect("id5").toEqual(arrayProduct.arrayModel[5].id);
    });
});

describe("BaseModelIterator", () => {
    test("next(), hasNext(), setArrayModel(arrayModel: Array<T>)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const productOrderByDescPriceIterator = new ProductOrderByDescPriceIterator();
        productOrderByDescPriceIterator.setArrayModel(generatedArrayProduct);
        const arrayProduct = new Array<Product>();
        while (productOrderByDescPriceIterator.hasNext()) {
            arrayProduct.push(productOrderByDescPriceIterator.next().clone());
        }
        expect(10).toEqual(arrayProduct.length);
        expect(
            [109, 108, 107, 106, 105, 104, 103, 102, 101, 100])
            .toEqual([
                arrayProduct[0].price,
                arrayProduct[1].price,
                arrayProduct[2].price,
                arrayProduct[3].price,
                arrayProduct[4].price,
                arrayProduct[5].price,
                arrayProduct[6].price,
                arrayProduct[7].price,
                arrayProduct[8].price,
                arrayProduct[9].price
            ]);
    });
});

describe("BaseModel", () => {
    test("clone()", () => {
        const product = new Product("id1",100);
        const cloneProduct = product.clone();
        expect(true).toEqual(product.id === cloneProduct.id);
    });
    test("toMap()", () => {
        const product = new Product("id1",100);
        expect({"id": "id1", "price": 100}).toEqual(product.toMap());
    });
    test("toString()", () => {
        const product = new Product("id1",100);
        expect("Product(id: id1, price: 100)").toEqual(product.toString());
    });
});

describe("BaseModelWrapper", () => {
    test("fromMap()", () => {
        const map: Record<string, any> = {"id": "id1", "price": 100};
        const productWrapper = new ProductWrapper(map);
        const product: Product = productWrapper.fromMap();
        expect(
            ["id1", 100])
            .toEqual([
                product.id, 
                product.price]);
    });
});

describe("IterationService", () => {
    test("next()", () => {
        const iterationService = IterationService.instance;
        const id = iterationService.next();
        const idSecond = iterationService.next();
        expect(true).toEqual(id !== idSecond);
    });
});

describe("ShareProxy", () => {
    test("getValue<T>(key: string, defaultValue: T)", () => {
        const shareProxy = new ShareProxy();
        expect("qwerty").toEqual(shareProxy.getValue<string>("key", "qwerty"));
        shareProxy.update("key","ytrewq");
        expect("ytrewq").toEqual(shareProxy.getValue<string>("key", "qwerty"));
    });
    test("update(key: string, value: any)", () => {
        const shareProxy = new ShareProxy();
        shareProxy.update("key","ytrewq");
        expect("ytrewq").toEqual(shareProxy.getValue<string>("key", "qwerty"));
    });
    test("delete(key: string)", () => {
        const shareProxy = new ShareProxy();
        shareProxy.update("key","ytrewq");
        shareProxy.delete("key");
        expect("qwerty").toEqual(shareProxy.getValue<string>("key", "qwerty"));
    });
    test("addListener(key: string, callback: (event: any) => void), notifyListener(key: string, value: any)", () => {
        const mockCallback = new MockCallback();
        const shareProxy = new ShareProxy();
        shareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareProxy.notifyListener("key", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(1,"hello");
    });
    test("addListener(key: string, callback: (event: any) => void), notifyListeners(key: string, value: any)", () => {
        const mockCallback = new MockCallback();
        const shareProxy = new ShareProxy();
        const secondShareProxy = new ShareProxy();
        shareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        secondShareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareProxy.notifyListeners("key", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(1,"hello");
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(2,"hello");
    });
    test("addListener(key: string, callback: (event: any) => void), notifyListeners(key: string, value: any), deleteAllListenersByKey(key: string)", () => {
        const mockCallback = new MockCallback();
        const shareProxy = new ShareProxy();
        const secondShareProxy = new ShareProxy();
        shareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        secondShareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareProxy.deleteAllListenersByKey("key");
        shareProxy.notifyListeners("key", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(0);
    });
    test("addListener(key: string, callback: (event: any) => void), notifyListeners(key: string, value: any), deleteAllListenersByArrayKey(arrayKey: Array<string>)", () => {
        const mockCallback = new MockCallback();
        const shareProxy = new ShareProxy();
        const secondShareProxy = new ShareProxy();
        shareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        secondShareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareProxy.addListener("keyTwo", (event: string) => {
            mockCallback.onCallback(event);
        });
        secondShareProxy.addListener("keyTwo", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareProxy.deleteAllListenersByArrayKey(["key", "keyTwo"]);
        shareProxy.notifyListeners("key", "hello");
        shareProxy.notifyListeners("keyTwo", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(0);
    });
    test("addListener(key: string, callback: (event: any) => void), notifyListeners(key: string, value: any), deleteListenerByListenerId(key: string)", () => {
        const mockCallback = new MockCallback();
        const shareProxy = new ShareProxy();
        const secondShareProxy = new ShareProxy();
        shareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        secondShareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareProxy.addListener("keyTwo", (event: string) => {
            mockCallback.onCallback(event);
        });
        secondShareProxy.addListener("keyTwo", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareProxy.deleteListenerByListenerId("key");
        shareProxy.notifyListeners("key", "hello");
        shareProxy.notifyListeners("keyTwo", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(3);
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(1,"hello");
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(2,"hello");
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(3,"hello");
    });
    test("addListener(key: string, callback: (event: any) => void), notifyListeners(key: string, value: any), deleteListenersByListenerId(arrayKey: Array<string>)", () => {
        const mockCallback = new MockCallback();
        const shareProxy = new ShareProxy();
        const secondShareProxy = new ShareProxy();
        shareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        secondShareProxy.addListener("key", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareProxy.addListener("keyTwo", (event: string) => {
            mockCallback.onCallback(event);
        });
        secondShareProxy.addListener("keyTwo", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareProxy.deleteListenersByListenerId(["key","keyTwo"]);
        shareProxy.notifyListeners("key", "hello");
        shareProxy.notifyListeners("keyTwo", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(1,"hello");
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(2,"hello");
    });
});

describe("ShareService", () => {
    test("getValue<T>(key: string, defaultValue: T)", () => {
        const shareService = ShareService.instance;
        expect("qwerty").toEqual(shareService.getValue<string>("key", "qwerty"));
        shareService.update("key","ytrewq");
        expect("ytrewq").toEqual(shareService.getValue<string>("key", "qwerty"));
    });
    test("update(key: string, value: any)", () => {
        const shareService = ShareService.instance;
        shareService.update("key","ytrewq");
        expect("ytrewq").toEqual(shareService.getValue<string>("key", "qwerty"));
    });
    test("delete(key: string)", () => {
        const shareService = ShareService.instance;
        shareService.update("key","ytrewq");
        shareService.delete("key");
        expect("qwerty").toEqual(shareService.getValue<string>("key", "qwerty"));
    });
    test("addListener(key: string, listenerId: string, callback: (event: any) => void), notifyListener(key: string, listenerId: string, value: any)", () => {
        const mockCallback = new MockCallback();
        const shareService = ShareService.instance;
        shareService.addListener("key", "0", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("key", "1", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.notifyListener("key", "0", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(1,"hello");
    });
    test("addListener(key: string, listenerId: string, callback: (event: any) => void), notifyListeners(key: string, value: any)", () => {
        const mockCallback = new MockCallback();
        const shareService = ShareService.instance;
        shareService.addListener("key", "2", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("key", "3", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.notifyListeners("key", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(1,"hello");
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(2,"hello");
    });
    test("addListener(key: string, listenerId: string, callback: (event: any) => void), notifyListeners(key: string, value: any), deleteAllListenersByKey(key: string)", () => {
        const mockCallback = new MockCallback();
        const shareService = ShareService.instance;
        shareService.addListener("key", "4", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("key", "5", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.deleteAllListenersByKey("key");
        shareService.notifyListeners("key", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(0);
    });
    test("addListener(key: string, listenerId: string, callback: (event: any) => void), notifyListeners(key: string, value: any), deleteAllListenersByArrayKey(arrayKey: Array<string>)", () => {
        const mockCallback = new MockCallback();
        const shareService = ShareService.instance;
        shareService.addListener("key", "6", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("key", "7", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("keyTwo", "0", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("keyTwo", "1", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.deleteAllListenersByArrayKey(["key", "keyTwo"]);
        shareService.notifyListeners("key", "hello");
        shareService.notifyListeners("keyTwo", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(0);
    });
    test("addListener(key: string, listenerId: string, callback: (event: any) => void), notifyListeners(key: string, value: any), deleteListenerByListenerId(key: string, listenerId: string)", () => {
        const mockCallback = new MockCallback();
        const shareService = ShareService.instance;
        shareService.addListener("key", "8", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("key", "9", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("keyTwo", "2", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("keyTwo", "3", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.deleteListenerByListenerId("key", "8");
        shareService.notifyListeners("key", "hello");
        shareService.notifyListeners("keyTwo", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(3);
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(1,"hello");
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(2,"hello");
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(3,"hello");
    });
    test("addListener(key: string, listenerId: string, callback: (event: any) => void), notifyListeners(key: string, value: any), deleteListenersByListenerId(arrayKey: Array<string>, listenerId: string)", () => {
        const mockCallback = new MockCallback();
        const shareService = ShareService.instance;
        shareService.addListener("key", "55", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("key", "56", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("keyTwo", "55", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.addListener("keyTwo", "56", (event: string) => {
            mockCallback.onCallback(event);
        });
        shareService.deleteListenersByListenerId(["key","keyTwo"],"55");
        shareService.notifyListeners("key", "hello");
        shareService.notifyListeners("keyTwo", "hello");
        expect(mockCallback.onCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(1,"hello");
        expect(mockCallback.onCallback).toHaveBeenNthCalledWith(2,"hello");
    });
});

describe("BaseView", () => {
    test("getViewState()", () => {
        const mainView = new MainView();
        expect(EnumMainView.success).toEqual(mainView.getViewState());
    });
});

describe("ExceptionAdapter", () => {
    test("getKey()", () => {
        const exceptionAdapter = new ExceptionAdapter(null);
        expect("").toEqual(exceptionAdapter.getKey());
    });
    test("hasException()", () => {
        const exceptionAdapter = new ExceptionAdapter(null);
        expect(false).toEqual(exceptionAdapter.hasException());
    });
});