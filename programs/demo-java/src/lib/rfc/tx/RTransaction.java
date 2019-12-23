package lib.rfc.tx;

import java.math.BigDecimal;
import java.util.Arrays;

import org.json.JSONException;
import org.json.JSONObject;

import lib.rfc.DemoAddr;

/**
 * Simplified ValueTransaction
 */
public class RTransaction {
    public String m_hash;
    public String m_publicKey;
    public String m_secret;
    public byte[] m_signature;
    public String m_method;
    public int m_nonce;
    public JSONObject m_input;
    private BigDecimal m_value;
    private BigDecimal m_fee;

    public RTransaction() {
        this.m_hash = Encoding.NULL_HASH;
        this.m_publicKey = Encoding.ZERO_KEY;
        this.m_signature = Digest.textToBytes(Encoding.ZERO_SIG64);
        this.m_method = "";
        this.m_nonce = -1;
        this.m_input = null;
        this.m_value = new BigDecimal(0);
        this.m_fee = new BigDecimal(0);
    }

    public void setMethod(String method) {
        this.m_method = method;
    }

    public void setNonce(int nonce) {
        this.m_nonce = nonce;
    }

    public void setInput(JSONObject input) {
        this.m_input = input;
    }

    public void setValue(BigDecimal amount) {
        this.m_value = amount;
    }

    public void setFee(BigDecimal fee) {
        this.m_fee = fee;
    }

    public void setPublicKey(String strPri) {
        this.m_publicKey = DemoAddr.publicKeyFromSecretKey(strPri);
    }

    public void print() {
        System.out.println("\nprint:");
        System.out.println(this.m_method);
        System.out.println(this.m_nonce);
        System.out.println(this.m_publicKey);
        System.out.println(Encoding.toStringifiable(this.m_input, true));
        System.out.println(this.m_value);
        System.out.println(this.m_fee);
        System.out.println(Digest.bytesToText(this.m_signature));
    }

    public byte[] render() {
        BufferWriter writer = new BufferWriter();
        writer.writeVarString(this.m_method);
        writer.writeU32(this.m_nonce);
        writer.writeBytes(Digest.textToBytes(this.m_publicKey));
        String input = Encoding.toStringifiable(this.m_input, true);
        writer.writeVarString(input);
        writer.writeBigNumber(this.m_value);
        writer.writeBigNumber(this.m_fee);
        writer.writeBytes(this.m_signature);

        byte[] dataBuf = writer.render();
        return dataBuf;
    }

    public boolean sign(String strPri) {
        if (strPri.length() > 0) {

            this.m_signature = this.updateData(strPri);

            if (this.m_signature == null) {
                return false;
            } else {
                return true;
            }
        }

        return false;
    }

    private byte[] updateData(String strPri) {
        BufferWriter writer = new BufferWriter();
        writer.writeVarString(this.m_method);
        writer.writeU32(this.m_nonce);
        writer.writeBytes(Digest.textToBytes(this.m_publicKey));
        String input = Encoding.toStringifiable(this.m_input, true);
        writer.writeVarString(input);
        writer.writeBigNumber(this.m_value);
        writer.writeBigNumber(this.m_fee);

        byte[] content = writer.render();
        byte[] byteHash = Digest.hash256(content, content.length);
        String strHash = Digest.bytesToText(byteHash);
        System.out.println("\nHash:");
        System.out.println(strHash);
        this.m_hash = strHash;
        System.out.println("\nSignature:");
        byte[] signature = Digest.sign(strHash, strPri);

        System.out.println(Arrays.toString(Digest.bytesToInts(signature)));

        return signature;
    }

    public String getHash() {
        return this.m_hash;
    }

    public static JSONObject parse(byte[] data) {
        System.out.println("\n====================");
        System.out.println("    parse the byte[] to json");
        System.out.println("=====================");

        final int STATE_METHOD = 0;
        final int STATE_METHOD_BODY = 10;
        final int STATE_NONCE = 1;
        final int STATE_PUBKEY = 2;
        final int STATE_INPUT = 3;
        final int STATE_INPUT_BODY = 30;
        final int STATE_AMOUNT = 4;
        final int STATE_AMOUNT_BODY = 40;
        final int STATE_FEE = 5;
        final int STATE_FEE_BODY = 50;
        final int STATE_SIGN = 6;

        int state = STATE_METHOD;
        int nMethodLen = 0;
        byte[] byteMethod = new byte[0];
        int indexMethod = 0;
        byte[] byteNonce = new byte[4];
        int indexNonce = 0;
        byte[] bytePubKey = new byte[33];
        int indexPubKey = 0;
        byte[] byteInput = new byte[0];
        int indexInput = 0;
        int nInputLen = 0;
        byte[] byteAmount = new byte[0];
        int indexAmount = 0;
        int nAmountLen = 0;
        byte[] byteFee = new byte[0];
        int indexFee = 0;
        int nFeeLen = 0;
        byte[] byteSign = new byte[64];
        int indexSign = 0;

        for (int i = 0; i < data.length; i++) {
            byte ch = data[i];
            switch (state) {
            case STATE_METHOD:
                // I wont consider method name len > 100 bytes
                nMethodLen = (int) ch;
                byteMethod = new byte[nMethodLen];
                state = STATE_METHOD_BODY;
                break;
            case STATE_METHOD_BODY:
                byteMethod[indexMethod++] = ch;
                if (indexMethod == nMethodLen) {
                    state = STATE_NONCE;
                }
                break;
            case STATE_NONCE:
                byteNonce[indexNonce++] = ch;
                if (indexNonce == 4) {
                    state = STATE_PUBKEY;
                }
                break;
            case STATE_PUBKEY:
                bytePubKey[indexPubKey++] = ch;
                if (indexPubKey == 33) {
                    state = STATE_INPUT;
                }
                break;
            case STATE_INPUT:
                // input length will < 253, now it's 44 bytes
                nInputLen = (ch > 0) ? (int) ch : (256 + (int) ch);
                byteInput = new byte[nInputLen];
                state = STATE_INPUT_BODY;
                break;
            case STATE_INPUT_BODY:
                byteInput[indexInput++] = ch;
                if (indexInput == nInputLen) {
                    state = STATE_AMOUNT;
                }
                break;
            case STATE_AMOUNT:
                // amount length will < 253
                nAmountLen = (ch > 0) ? (int) ch : (256 + (int) ch);
                byteAmount = new byte[nAmountLen];
                state = STATE_AMOUNT_BODY;
                break;
            case STATE_AMOUNT_BODY:
                byteAmount[indexAmount++] = ch;
                if (indexAmount == nAmountLen) {
                    state = STATE_FEE;
                }
                break;
            case STATE_FEE:
                nFeeLen = (ch > 0) ? (int) ch : (256 + (int) ch);
                byteFee = new byte[nFeeLen];
                state = STATE_FEE_BODY;
                break;
            case STATE_FEE_BODY:
                byteFee[indexFee++] = ch;
                if (indexFee == nFeeLen) {
                    state = STATE_SIGN;
                }
                break;
            case STATE_SIGN:
                byteSign[indexSign++] = ch;
                break;
            default:
                return null;
            }
        }

        JSONObject obj = new JSONObject();

        try {
            obj.put("method", new String(byteMethod));
            int nonce = 0;
            nonce += byteNonce[0];
            nonce += ((int) byteNonce[1] << 8);
            nonce += ((int) byteNonce[2] << 16);
            nonce += ((int) byteNonce[3] << 24);
            obj.put("nonce", nonce);
            obj.put("publicKey", Digest.bytesToText(bytePubKey));
            obj.put("input", new String(byteInput));
            obj.put("amount", new String(byteAmount));
            obj.put("fee", new String(byteFee));
            obj.put("signature", Digest.bytesToText(byteSign));
        } catch (JSONException e) {
            e.printStackTrace();

        }

        return obj;
    }
}