/**
 * 
 * @param args 
 */
export async function testcmd(args: string[]): Promise<{ resp: string | null, ret: number }> {
    return new Promise<{ resp: string | null, ret: number }>((resolve) => {
        setTimeout(() => {
            resolve({ resp: 'hello', ret: 10 });
        }, 2000);
    });
}
