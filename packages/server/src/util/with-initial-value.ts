import { $$asyncIterator } from "iterall";

export type GetterFn = (
  rootValue?: any,
  args?: any,
  context?: any,
  info?: any
) => Promise<any> | any;

export type ResolverFn = (
  rootValue?: any,
  args?: any,
  context?: any,
  info?: any
) => AsyncIterator<any>;

export const withInitialValue = (
  asyncIteratorFn: ResolverFn,
  initialValueGetter: GetterFn
): ResolverFn => {
  return (
    rootValue: any,
    args: any,
    context: any,
    info: any
  ): AsyncIterator<any> => {
    const asyncIterator = asyncIteratorFn(rootValue, args, context, info);
    const initialValueOrPromise = initialValueGetter(
      rootValue,
      args,
      context,
      info
    );

    let getNextPromise = (): any =>
      Promise.resolve(initialValueOrPromise).then(value => {
        getNextPromise = asyncIterator.next;
        return {
          done: false,
          value
        };
      });

    return {
      next() {
        return getNextPromise();
      },
      return() {
        return asyncIterator.return!();
      },
      throw(error) {
        return asyncIterator.throw!(error);
      },
      [$$asyncIterator]() {
        return this;
      }
    };
  };
};
