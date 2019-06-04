let prompt1 = require('prompts-ex');

async function main() {

  while (1) {
    const onCancel = (promptArg: any) => {
      console.log('exit rfccli');
      process.exit(1);
    }

    const response = await prompt1([{
      type: 'textex',
      name: 'cmd',
      message: '>'
    }], { onCancel });

    // on arrow key


    if (response.cmd) {
      process.stdout.write("response:" + response.cmd + "\n");
    }
  }
}

main();
