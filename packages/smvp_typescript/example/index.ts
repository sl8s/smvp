import { LocalException, EnumGuilty, BaseModel, BaseArrayModel, BaseModelWrapper, BaseArrayModelWrapper, ResultModelWrapper, NetworkException, debugPrint, ExceptionAdapter, BaseModelWrapperRepository, BaseView, ShareProxy, debugPrintMethod } from "smvp_typescript";

class Jsonip extends BaseModel {
    public readonly ip: string;

    public constructor(ip: string) {
        super(ip);
        this.ip = ip;
    }

    public override clone(): Jsonip {
        return new Jsonip(this.ip);
    }

    public override toMap(): Record<string, any> {
        return {"ip": this.ip };
    }

    public override toString(): string {
        return "Jsonip(id: " + this.id + ", " + 
            "ip: " + this.ip + ")";
    }
}

class ArrayJsonip<T extends Jsonip> extends BaseArrayModel<T> {
    public constructor(arrayModel: Array<T>) {
        super(arrayModel);
    }

    public override clone(): ArrayJsonip<T> {
        const newArrayModel = new Array<T>();
        for(const itemModel of this.arrayModel) {
            newArrayModel.push(itemModel.clone() as T);
        }
        return new ArrayJsonip<T>(newArrayModel);
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
        return "ArrayJsonip(arrayModel: [" + str + "])";
    }
}

class JsonipWrapper extends BaseModelWrapper {
    public constructor(map: Record<string,any>) {
        super(map);
    }

    public override fromMap(): Jsonip {
        return new Jsonip(this.map["ip"]);
    }
}

class ArrayJsonipWrapper extends BaseArrayModelWrapper {
    public constructor(arrayMap: Array<Array<any>>) {
        super(arrayMap);
    }

    public override fromArrayMap(): ArrayJsonip<Jsonip> {
        const arrayModel = new Array<Jsonip>();
        for(const itemMap of this.arrayMap) {
            const modelWrapper = new JsonipWrapper(itemMap);
            arrayModel.push(modelWrapper.fromMap());
        }
        return new ArrayJsonip(arrayModel);
    }
}

abstract class BaseHttpClientService {
    protected constructor() {
    }

    public abstract getHttpClient(): any;
}

class DefaultHttpClientService extends BaseHttpClientService {
    public static readonly instance = new DefaultHttpClientService();

    private constructor() {
        super();
    }

    public getHttpClient(): any {
        throw new Error("Method not implemented.");
    }
}

class JsonipWrapperRepository<T extends JsonipWrapper, Y extends ArrayJsonipWrapper> extends BaseModelWrapperRepository {
    protected readonly baseHttpClientService: BaseHttpClientService;

    public constructor(baseHttpClientService: BaseHttpClientService) {
        super();
        this.baseHttpClientService = baseHttpClientService;
    }

    public override dispose(): void {
    }

    public async getJsonipFromHttpClientService(): Promise<ResultModelWrapper<T>> {
        try {
            const response = await fetch("https://jsonip.com", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(response.status != 200) {
                throw NetworkException.fromSourceAndKeyAndStatusCode(
                    "JsonipWrapperRepository",
                    response.status.toString(),
                    response.status);
            }
            const responseJson = await response.json();
            const responseMap = new Map(Object.entries(responseJson));
            const ip = this.getSafeValue<string>(responseMap, "ip", "");
            const map = {"ip": ip};
            return ResultModelWrapper.success(new JsonipWrapper(map) as T);
        } catch(exception: any) {
            if(exception instanceof NetworkException) {
                return ResultModelWrapper.exception(exception);
            }
            return ResultModelWrapper.exception(new LocalException(
                "JsonipWrapperRepository",
                "unknown",
                EnumGuilty.device,
                exception.toString()));
        }
    }
}

enum EnumMainView {
    isLoading = "isLoading",
    exception = "exception",
    success = "success",
}

class MainView extends BaseView<EnumMainView> {
    // Final variables
    private readonly jsonipWrapperRepository = new JsonipWrapperRepository(DefaultHttpClientService.instance);
    private readonly shareProxy = new ShareProxy();

    // Not final variables
    private isLoading: boolean = true;
    private jsonip: Jsonip = new Jsonip("");

    public constructor() {
        super();
    }

    public override getViewState(): EnumMainView {
       if(this.isLoading) {
         return EnumMainView.isLoading;
       }
       if(this.exceptionAdapter.hasException()) {
         return EnumMainView.exception;
       }
       return EnumMainView.success;
    }

    public override dispose(): void {
        this.jsonipWrapperRepository.dispose();
        this.shareProxy.deleteListenersByListenerId([]);
    }

    public async init(): Promise<void> {
        const resultJsonip = await this.jsonipWrapperRepository.getJsonipFromHttpClientService();
        const hasException = resultJsonip.exceptionAdapter.hasException();
        if(hasException) {
            this.a0QQInitQQHasException(resultJsonip.exceptionAdapter);
            return;
        }
        this.isLoading = false;
        this.jsonip = resultJsonip.data!.fromMap();
        this.build();
    }

    private build(): void {
        switch(this.getViewState()) {
            case EnumMainView.isLoading:
                debugPrint("Build: IsLoading");
                break;
            case EnumMainView.exception:
                debugPrint("Build: Exception(" + this.exceptionAdapter.getKey() + ")");
                break;
            case EnumMainView.success:
                debugPrint("Build: Success(" + this.jsonip + ")");
                break;
        }
    }

    private a0QQInitQQHasException(exceptionAdapter: ExceptionAdapter) {
        debugPrintMethod("a0QQInitQQHasException");
        this.isLoading = false;
        this.exceptionAdapter = exceptionAdapter;
        this.build();
    }
}

async function main(): Promise<void> {
    const mainView = new MainView();
    await mainView.init();
    mainView.dispose();
}
main();
// Build: Success(Jsonip(id: {your_ip}, ip: {your_ip}))

// OR

// ===start_to_trace_exception===
//
// Source: JsonipWrapperRepository
// Type: {type}
// toString(): {toString()}
//
// ===end_to_trace_exception===
//
// [Method] a0QQInitQQHasException
// Build: Exception({exceptionAdapter.getKey()})