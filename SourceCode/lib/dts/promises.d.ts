declare namespace streampPromises {

    function finished(
        stream: NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream,
        options?: stream.internal.FinishedOptions,
    ): Promise<void>;
    function pipeline<A extends  stream.internal.PipelineSource<any>, B extends stream.internal.PipelineDestination<A, any>>(
        source: A,
        destination: B,
        options?: stream.internal.PipelineOptions,
    ): stream.internal.PipelinePromise<B>;
    function pipeline<
        A extends stream.internal.PipelineSource<any>,
        T1 extends stream.internal.PipelineTransform<A, any>,
        B extends stream.internal.PipelineDestination<T1, any>,
    >(
        source: A,
        transform1: T1,
        destination: B,
        options?: stream.internal.PipelineOptions,
    ): stream.internal.PipelinePromise<B>;
    function pipeline<
        A extends stream.internal.PipelineSource<any>,
        T1 extends stream.internal.PipelineTransform<A, any>,
        T2 extends stream.internal.PipelineTransform<T1, any>,
        B extends stream.internal.PipelineDestination<T2, any>,
    >(
        source: A,
        transform1: T1,
        transform2: T2,
        destination: B,
        options?: stream.internal.PipelineOptions,
    ): stream.internal.PipelinePromise<B>;
    function pipeline<
        A extends stream.internal.PipelineSource<any>,
        T1 extends stream.internal.PipelineTransform<A, any>,
        T2 extends stream.internal.PipelineTransform<T1, any>,
        T3 extends stream.internal.PipelineTransform<T2, any>,
        B extends stream.internal.PipelineDestination<T3, any>,
    >(
        source: A,
        transform1: T1,
        transform2: T2,
        transform3: T3,
        destination: B,
        options?: stream.internal.PipelineOptions,
    ): stream.internal.PipelinePromise<B>;
    function pipeline<
        A extends stream.internal.PipelineSource<any>,
        T1 extends stream.internal.PipelineTransform<A, any>,
        T2 extends stream.internal.PipelineTransform<T1, any>,
        T3 extends stream.internal.PipelineTransform<T2, any>,
        T4 extends stream.internal.PipelineTransform<T3, any>,
        B extends stream.internal.PipelineDestination<T4, any>,
    >(
        source: A,
        transform1: T1,
        transform2: T2,
        transform3: T3,
        transform4: T4,
        destination: B,
        options?: stream.internal.PipelineOptions,
    ): stream.internal.PipelinePromise<B>;
    function pipeline(
        streams: ReadonlyArray<NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream>,
        options?: stream.internal.PipelineOptions,
    ): Promise<void>;
    function pipeline(
        stream1: NodeJS.ReadableStream,
        stream2: NodeJS.ReadWriteStream | NodeJS.WritableStream,
        ...streams: Array<NodeJS.ReadWriteStream | NodeJS.WritableStream | stream.internal.PipelineOptions>
    ): Promise<void>;
}