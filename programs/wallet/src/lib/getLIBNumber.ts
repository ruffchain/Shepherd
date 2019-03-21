// Added 2019-3-18
import { IfResult, IfContext } from './common';


const FUNC_NAME = 'getLastIrreversibleBlockNumber';

export async function getLastIrreversibleBlockNumber(ctx: IfContext, args: string[]): Promise<IfResult> {
  return new Promise<IfResult>(async (resolve) => {

    // check args

    let cr = await ctx.client.callAsync(FUNC_NAME, {});
    if (ctx.sysinfo.verbose) {
      console.log(cr);
    }

    resolve(cr);
  });
}
export function prnGetLastIrreversibleBlockNumber(ctx: IfContext, obj: IfResult) {
  if (ctx.sysinfo.verbose) {
    console.log(obj);
  }

  console.log('');

  if (!obj.resp) {
    console.log('Wrong result: ');
    return;
  }
  let objJson: any;
  try {
    objJson = JSON.parse(obj.resp);
    console.log(objJson)
    // objJson.forEach((element: string) => {
    //   console.log(element.replace(/<=/g, ''));
    // });
  } catch (e) {
    console.log(e);
  }
}
