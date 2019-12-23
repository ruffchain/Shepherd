package lib.rfc;

import org.json.JSONException;
import org.json.JSONObject;

import lib.rfc.client.IfArgs;
import lib.rfc.client.IfFeedback;
import lib.rfc.client.RPCClient;

public class DemoStatus {
    public interface Function<T> {
        public IfFeedback apply(T t);
    }

    public static IfFeedback getNonce(RPCClient client, String addr) {
        IfFeedback fb = new IfFeedback();

        if (!DemoAddr.isValidAddress(addr)) {
            fb.ret = IfFeedback.WRONG_ADDRESS;
            fb.resp = "Wrong address";
            return fb;
        }

        JSONObject funcArgs = new JSONObject();

        try {
            funcArgs.put("address", addr);

        } catch (JSONException e) {
            fb.ret = IfFeedback.WRONG_JSON;
            return fb;
        }

        fb = client.callAsync("getNonce", funcArgs);

        if (fb.ret != IfFeedback.OK) {
            return fb;
        }

        try {
            JSONObject mJson = new JSONObject(fb.resp);
            // System.out.println(mJson);
            // System.out.println(mJson.get("err"));
            int err = mJson.getInt("err");

            if (err != 0) {
                throw new JSONException("");
            }

            return fb;

        } catch (JSONException e) {
            fb.ret = IfFeedback.WRONG_RPC_RETURN;
            return fb;
        }
    }

    public static IfFeedback getBalance(RPCClient client, String addr) {
        IfFeedback fb = new IfFeedback();

        if (!DemoAddr.isValidAddress(addr)) {
            fb.ret = IfFeedback.WRONG_ADDRESS;
            fb.resp = "Wrong address";
            return fb;
        }

        IfArgs funcArgs = new IfArgs();

        funcArgs.method = "getBalance";

        funcArgs.params = new JSONObject();
        try {
            funcArgs.params.put("address", addr);
        } catch (JSONException e) {
            fb.ret = IfFeedback.WRONG_JSON;
            return fb;
        }

        fb = client.callAsync("view", funcArgs.toJSON());

        if (fb.ret != IfFeedback.OK) {
            return fb;
        }
        fb = DemoStatus.parseGetBalance(fb.resp);
        return fb;
    }

    // return latest block
    public static IfFeedback getBlock(RPCClient client) {
        IfFeedback fb = new IfFeedback();
        JSONObject funcArgs = new JSONObject();
        try {
            funcArgs.put("which", "latest");

        } catch (JSONException e) {
            fb.ret = IfFeedback.WRONG_JSON;
            return fb;
        }
        return DemoStatus.getBlockCommon(client, funcArgs);

    }

    public static IfFeedback getBlock(RPCClient client, int height) {
        IfFeedback fb = new IfFeedback();
        JSONObject funcArgs = new JSONObject();
        try {
            funcArgs.put("which", height);
        } catch (JSONException e) {
            fb.ret = IfFeedback.WRONG_JSON;
            return fb;
        }
        return DemoStatus.getBlockCommon(client, funcArgs);
    }

    public static IfFeedback getBlock(RPCClient client, String hash) {
        IfFeedback fb = new IfFeedback();
        JSONObject funcArgs = new JSONObject();
        try {
            funcArgs.put("which", hash);

        } catch (JSONException e) {
            fb.ret = IfFeedback.WRONG_JSON;
            return fb;
        }
        return DemoStatus.getBlockCommon(client, funcArgs);
    }

    private static IfFeedback getBlockCommon(RPCClient client, JSONObject funcArgs) {
        IfFeedback fb = new IfFeedback();
        try {
            funcArgs.put("transaction", true);
            funcArgs.put("eventLog", true);
            funcArgs.put("receipts", true);
        } catch (JSONException e) {
            fb.ret = IfFeedback.WRONG_JSON;
            return fb;
        }

        fb = client.callAsync("getBlock", funcArgs);

        if (fb.ret != IfFeedback.OK) {
            return fb;
        }

        try {
            JSONObject mJson = new JSONObject(fb.resp);
            // System.out.println(mJson);
            // System.out.println(mJson.get("err"));
            int err = mJson.getInt("err");

            if (err != 0) {
                throw new JSONException("");
            }

            // JSONObject oBlock = mJson.getJSONObject("block");
            // int number = oBlock.getInt("number");
            // fb.resp = number + "";

            return fb;

        } catch (JSONException e) {
            fb.ret = IfFeedback.WRONG_RPC_RETURN;
            return fb;
        }
    }

    // get transaction
    public static IfFeedback getTransaction(RPCClient client, String hash) {
        IfFeedback fb = new IfFeedback();
        JSONObject funcArgs = new JSONObject();

        try {
            funcArgs.put("tx", hash);
        } catch (JSONException e) {
            fb.ret = IfFeedback.WRONG_JSON;
            return fb;
        }

        fb = client.callAsync("getTransactionReceipt", funcArgs);
        if (fb.ret != IfFeedback.OK) {
            return fb;
        }

        return fb;
    }

    public static IfFeedback checkReceipt(RPCClient client, String hash) {
        IfFeedback fb = new IfFeedback();
        System.out.println("\nCheck receipt for: " + hash);

        for (int i = 0; i < 3; i++) {
            try {
                Thread.sleep(10000);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            fb = getTransaction(client, hash);

            if (fb.ret == 0) {
                // System.out.println(fb.resp);
                // check if returnCode == 0, then break
                try {
                    JSONObject resp = new JSONObject(fb.resp);
                    int err = resp.getInt("err");
                    if (err != 0) {
                        fb.ret = err;
                        break;
                    }
                    JSONObject receipt = resp.getJSONObject("receipt");
                    int returnCode = receipt.getInt("returnCode");
                    if (returnCode == 0) {
                        fb.ret = 0;
                        break;
                    } else {
                        fb.ret = returnCode;
                        break;
                    }

                } catch (JSONException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    fb.ret = -1;
                    continue;
                }
            }
        }

        return fb;
    }

    private static IfFeedback parseGetBalance(String resp) {
        IfFeedback fb = new IfFeedback();
        try {
            JSONObject mJson = new JSONObject(resp);
            // System.out.println(mJson);
            // System.out.println(mJson.get("err"));
            int err = mJson.getInt("err");

            if (err != 0) {
                fb.ret = IfFeedback.WRONG_RPC_RETURN;
                return fb;
            }
            // System.out.println(mJson.get("value"));

            String strNum = mJson.getString("value");
            strNum = strNum.replace("n", "");
            fb.resp = strNum;
        } catch (JSONException e) {
            fb.ret = IfFeedback.WRONG_JSON;
            return fb;
        }
        return fb;
    }

}