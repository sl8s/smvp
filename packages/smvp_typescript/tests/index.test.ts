import { describe, expect, test, vi } from "vitest";
import { BaseArrayModel, BaseArrayModelWrapper, BaseModel, BaseModelWrapper, BaseView, ExceptionAdapter, IterationService, ShareProxy, ShareService } from "..";

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
        expect(arrayProduct.arrayModel.length === cloneArrayProduct.arrayModel.length).toEqual(true);
        cloneArrayProduct.arrayModel.splice(0,1);
        expect(arrayProduct.arrayModel.length).toEqual(10);
        expect(cloneArrayProduct.arrayModel.length).toEqual(9);
    });
    test("toArrayMap()", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        const arrayMapFromArrayProduct = arrayProduct.toArrayMap();
        expect(arrayProduct.arrayModel.length === arrayMapFromArrayProduct.length).toEqual(true);
        expect(arrayMapFromArrayProduct.length).toEqual(10);
        expect(
            [
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
            ]).toEqual([100, 101, 102, 103, 104, 105, 106, 107, 108, 109]);
    });
    test("toString()", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 1 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(arrayProduct.toString()).toEqual("ArrayProduct(arrayModel: [\nProduct(id: id0, price: 100),\n])");
    });
    test("add(newModel: T)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(arrayProduct.arrayModel.length).toEqual(10);
        arrayProduct.add(new Product("id124", 5314));
        expect(arrayProduct.arrayModel.length).toEqual(11);
        expect(arrayProduct.arrayModel[10].id).toEqual("id124");
        expect(arrayProduct.arrayModel[10].price).toEqual(5314);
    });
    test("updateById(newModel: T)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(arrayProduct.arrayModel.length).toEqual(10);
        expect(arrayProduct.arrayModel[0].price).toEqual(100);
        arrayProduct.updateById(new Product("id0", 5314));
        expect(arrayProduct.arrayModel[0].price).toEqual(5314);
    });
    test("deleteById(id: string)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(arrayProduct.arrayModel.length).toEqual(10);
        arrayProduct.deleteById("id0");
        expect(arrayProduct.arrayModel.length).toEqual(9);
        expect(
            [
                arrayProduct.arrayModel[0].id,
                arrayProduct.arrayModel[0].price
            ]).toEqual(["id1", 101]);
    });
    test("addFromArray(newArrayModel: Array<T>)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(arrayProduct.arrayModel.length).toEqual(10);
        arrayProduct.addFromArray([
            new Product("id425", 93125),
            new Product("id643", 24112)
        ]);
        expect(arrayProduct.arrayModel.length).toEqual(12);
        expect(
            [
                arrayProduct.arrayModel[10].id, 
                arrayProduct.arrayModel[11].id, 
                arrayProduct.arrayModel[10].price,
                arrayProduct.arrayModel[11].price
            ]).toEqual(["id425", "id643", 93125, 24112]);
    });
    test("updateFromArrayById(newArrayModel: Array<T>)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(arrayProduct.arrayModel.length).toEqual(10);
        expect(
            [
                arrayProduct.arrayModel[0].price,
                arrayProduct.arrayModel[1].price
            ]).toEqual([100, 101]);
        arrayProduct.updateFromArrayById([
            new Product("id0", 93125),
            new Product("id1", 24112)
        ]);
        expect(
            [
                arrayProduct.arrayModel[0].price,
                arrayProduct.arrayModel[1].price
            ]).toEqual([93125, 24112]);
    });
    test("deleteFromArrayById(arrayId: Array<string>)", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        expect(arrayProduct.arrayModel.length).toEqual(10);
        arrayProduct.deleteFromArrayById(["id0","id1"]);
        expect(arrayProduct.arrayModel.length).toEqual(8);
        expect(
            [
                arrayProduct.arrayModel[0].id,
                arrayProduct.arrayModel[0].price,
                arrayProduct.arrayModel[1].id,
                arrayProduct.arrayModel[1].price,
            ]).toEqual(["id2", 102, "id3", 103]);
    });
});
  
describe("BaseArrayModelWrapper", () => {
    test("fromArrayMap()", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProductWrapper = new ArrayProductWrapper(generatedArrayProduct);
        const arrayProduct = arrayProductWrapper.fromArrayMap();
        expect(arrayProduct.arrayModel.length).toEqual(10);
        expect(arrayProduct.arrayModel[5].id).toEqual("id5");
    });
});

describe("BaseModel", () => {
    test("clone()", () => {
        const product = new Product("id1",100);
        const cloneProduct = product.clone();
        expect(product.id === cloneProduct.id).toEqual(true);
    });
    test("toMap()", () => {
        const product = new Product("id1",100);
        expect(product.toMap()).toEqual({"id": "id1", "price": 100});
    });
    test("toString()", () => {
        const product = new Product("id1",100);
        expect(product.toString()).toEqual("Product(id: id1, price: 100)");
    });
});

describe("BaseModelWrapper", () => {
    test("fromMap()", () => {
        const map: Record<string, any> = {"id": "id1", "price": 100};
        const productWrapper = new ProductWrapper(map);
        const product: Product = productWrapper.fromMap();
        expect(
            [
                product.id, 
                product.price
            ]).toEqual(["id1", 100]);
    });
});

describe("IterationService", () => {
    test("next()", () => {
        const iterationService = IterationService.instance;
        const id = iterationService.next();
        const idSecond = iterationService.next();
        expect(id !== idSecond).toEqual(true);
    });
});

describe("ShareProxy", () => {
    test("getValue<T>(key: string, defaultValue: T)", () => {
        const shareProxy = new ShareProxy();
        expect(shareProxy.getValue<string>("key", "qwerty")).toEqual("qwerty");
        shareProxy.update("key","ytrewq");
        expect(shareProxy.getValue<string>("key", "qwerty")).toEqual("ytrewq");
    });
    test("update(key: string, value: any)", () => {
        const shareProxy = new ShareProxy();
        shareProxy.update("key","ytrewq");
        expect(shareProxy.getValue<string>("key", "qwerty")).toEqual("ytrewq");
    });
    test("delete(key: string)", () => {
        const shareProxy = new ShareProxy();
        shareProxy.update("key","ytrewq");
        shareProxy.delete("key");
        expect(shareProxy.getValue<string>("key", "qwerty")).toEqual("qwerty");
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
        expect(shareService.getValue<string>("key", "qwerty")).toEqual("qwerty");
        shareService.update("key","ytrewq");
        expect(shareService.getValue<string>("key", "qwerty")).toEqual("ytrewq");
    });
    test("update(key: string, value: any)", () => {
        const shareService = ShareService.instance;
        shareService.update("key","ytrewq");
        expect(shareService.getValue<string>("key", "qwerty")).toEqual("ytrewq");
    });
    test("delete(key: string)", () => {
        const shareService = ShareService.instance;
        shareService.update("key","ytrewq");
        shareService.delete("key");
        expect(shareService.getValue<string>("key", "qwerty")).toEqual("qwerty");
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
        expect(mainView.getViewState()).toEqual(EnumMainView.success);
    });
});

describe("ExceptionAdapter", () => {
    test("getKey()", () => {
        const exceptionAdapter = new ExceptionAdapter(null);
        expect(exceptionAdapter.getKey()).toEqual("");
    });
    test("hasException()", () => {
        const exceptionAdapter = new ExceptionAdapter(null);
        expect(exceptionAdapter.hasException()).toEqual(false);
    });
});