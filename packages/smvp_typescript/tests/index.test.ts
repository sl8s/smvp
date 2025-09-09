import { expect, test, describe } from "vitest"
import { BaseArrayModel, BaseModel, BaseModelIterator } from "..";

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

class ProductOrderByDescPriceIterator<T extends Product> extends BaseModelIterator<T> {
    public constructor() {
        super(0);
    }

    public override next(): T {
        let currentModel: T = this.arrayModel[0];
        if (this.arrayModel.length == 1) {
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

  describe("BaseListModel", () => {
    test("clone()", () => {
        const generatedArrayProduct: Array<Product> = Array.from(
            { length: 10 },
            (_, index: number) => new Product("id"+index, (100 + index)));
        const arrayProduct = new ArrayProduct(generatedArrayProduct);
        const cloneArrayProduct = arrayProduct.clone();
        expect(true).toEqual(arrayProduct.arrayModel.length == cloneArrayProduct.arrayModel.length);
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
        expect(true).toEqual(arrayProduct.arrayModel.length == arrayMapFromArrayProduct.length);
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