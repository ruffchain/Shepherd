package app;

import java.math.BigDecimal;

import lib.rfc.DemoAddr;
import lib.rfc.DemoStatus;
import lib.rfc.DemoTransfer;
import lib.rfc.client.IfFeedback;
import lib.rfc.client.IfSysinfo;
import lib.rfc.client.RPCClient;

public class App {
    public static void main(String[] args) throws Exception {
        System.out.println("Hello Java");

        IfSysinfo info = new IfSysinfo();
        info.secret = "6f1df947d7942faf4110595f3aad1f2670e11b81ac9c1d8ee98806d81ec5f591";
        info.address = "154bdF5WH3FXGo4v24F4dYwXnR8br8rc2r";
        info.host = "161.189.65.155";
        // info.host = "127.0.0.1";
        info.port = 18089;

        System.out.println("\nCreate client");
        RPCClient client = new RPCClient(info);

        // Test address, key creation, address validation
        testDemoAddr();

        // Test
        testDemoStatus(client);

        // Test a transferTo transaction, de-serialize provided
        testDemoTransfer(client);

        System.out.println("\n-- End --");
    }

    private static void testDemoAddr() {
        System.out.println("\n==================================");
        System.out.println("Address creation, key generation");
        System.out.println("===================================");

        String secret = DemoAddr.createKey();
        if (secret == null) {
            System.err.println("create secret failed");
            System.exit(-1);
        }

        System.out.print("Secret:  ");
        System.out.println(secret);

        System.out.print("public key:  ");

        String strPubKey = DemoAddr.publicKeyFromSecretKey(secret);
        System.out.println(strPubKey);

        System.out.print("address:  ");
        System.out.println(DemoAddr.addressFromSecretKey(secret));

    }

    private static void testDemoStatus(RPCClient client) {
        System.out.println("\n==================================");
        System.out.println("Get status from chain");
        System.out.println("===================================");
        System.out.println("\nGet balance is: ");
        IfFeedback fb2 = DemoStatus.getBalance(client, "154bdF5WH3FXGo4v24F4dYwXnR8br8rc2r");
        System.out.println(fb2);

        System.out.println("\nGet latest block:");
        fb2 = DemoStatus.getBlock(client);
        System.out.println(fb2.resp);

        System.out.println("\nfind the height from block.number");

        System.out.println("\nGet block 1498:");
        fb2 = DemoStatus.getBlock(client, 1498);

        System.out.println(fb2.resp);

        System.out.println("\nGet transaction info:");
        fb2 = DemoStatus.getTransaction(client, "76f18f540323e7cf78619cfb41bb38687d06a12dec0b034fa0742ced93217e5f");
        // System.out.println(fb2);
        System.out.println("response:" + fb2.resp);

        System.out.println(
                "\nGet transaction info:" + "98bc05c0c81f24f925c9ad13662baf0f6d8a0283c069811f2dca2668701a5a06");
        fb2 = DemoStatus.getTransaction(client, "98bc05c0c81f24f925c9ad13662baf0f6d8a0283c069811f2dca2668701a5a06");
        System.out.println(fb2);

        System.out.println("\nGet nonce:");
        fb2 = DemoStatus.getNonce(client, "154bdF5WH3FXGo4v24F4dYwXnR8br8rc2r");

        System.out.println(fb2);
        System.out.println(fb2.resp);

    }

    private static void testDemoTransfer(RPCClient client) {
        System.out.println("\n==================================");
        System.out.println("transferTo ");
        System.out.println("===================================");

        BigDecimal amount = new BigDecimal("10.2323");
        BigDecimal fee = new BigDecimal("0.1");
        String strTo = "154bdF5WH3FXGo4v24F4dYwXnR8br8rc2r";

        IfFeedback fb = DemoTransfer.transferTo(client, strTo, amount, fee);

        System.out.println(fb);
        if (fb.ret != 0) {
            System.exit(-1);
        }
    }
}