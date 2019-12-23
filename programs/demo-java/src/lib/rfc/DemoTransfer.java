package lib.rfc;

import java.math.BigDecimal;

import org.json.JSONException;
import org.json.JSONObject;

import lib.rfc.client.IfFeedback;
import lib.rfc.client.RPCClient;
import lib.rfc.tx.RTransaction;

public class DemoTransfer {
    public static IfFeedback transferTo(RPCClient client, String toAddr, BigDecimal amount, BigDecimal fee) {
        IfFeedback fb = new IfFeedback();

        // Check arguments
        if (!DemoAddr.isValidAddress(toAddr)) {
            fb.ret = IfFeedback.WRONG_ADDRESS;
            fb.resp = "Wrong address";
            return fb;
        }

        if (!DemoAddr.isValidAmount(amount)) {
            fb.ret = IfFeedback.WRONG_AMOUNT;
            fb.resp = "Wrong amount";
            return fb;
        }

        if (!DemoAddr.isValidFee(fee)) {
            fb.ret = IfFeedback.WRONG_FEE;
            fb.resp = "Wrong fee";
            return fb;
        }

        RTransaction tx = new RTransaction();

        // get nonce
        fb = DemoStatus.getNonce(client, client.getAddress());
        if (fb.ret != 0) {
            return fb;
        }
        System.out.println(fb);
        System.out.println(fb.resp);

        int nonce = -1;
        try {
            JSONObject respObj = new JSONObject(fb.resp);
            nonce = respObj.getInt("nonce");
        } catch (JSONException e) {
            fb.ret = -1;
            return fb;
        }

        // nonce = 0;
        tx.setMethod("transferTo");
        tx.setNonce(nonce + 1);
        tx.setPublicKey(client.getSecret());

        JSONObject input = new JSONObject();
        try {
            input.put("to", toAddr);
        } catch (JSONException e) {
            System.out.println("JSON error input");
            fb.ret = -1;
            return fb;
        }

        tx.setInput(input);
        tx.setValue(amount);
        tx.setFee(fee);

        if (!tx.sign(client.getSecret())) {
            fb.ret = -1;
            return fb;
        }

        // send tx out
        fb = client.sendTransaction(tx);
        if (fb.ret != 0) {
            return fb;
        }

        // check receipt
        fb = DemoStatus.checkReceipt(client, tx.getHash());
        if (fb.ret == 0) {
            System.out.println("\nConfirmed tx: " + tx.getHash());
        }
        fb.resp = "OK";

        return fb;
    }
}