export class WaitablePromise<TResponse> extends Promise<TResponse> {
  // eslint-disable-next-line functional/prefer-readonly-type
  public onWaitClosure!: OnWaitClosure<TResponse>;

  public static from<TResponse>(promise: Promise<TResponse>): WaitablePromise<TResponse> {
    return new WaitablePromise<TResponse>(resolve => {
      promise.then(response => resolve(response));
    });
  }

  public onWait(onWaitClosure: OnWaitClosure<TResponse>): Readonly<this> {
    // eslint-disable-next-line functional/immutable-data
    this.onWaitClosure = onWaitClosure;

    return this;
  }

  public wait(): Promise<TResponse> {
    return new Promise(resolve => {
      this.then((response: TResponse) => {
        this.onWaitClosure(response).then(() => {
          resolve(response);
        });
      });
    });
  }
}

export type OnWaitClosure<TResponse> = (result: TResponse) => Promise<void>;
